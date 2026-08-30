import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MembershipStatus,
  PatientIdentifierType,
  Prisma,
} from '@prisma/client';
import { parseEgyptianNationalId } from '../../utils/egyptian-national-id.util';
import { PrismaService } from '../../prisma/prisma.service';
import { VerifyNationalIdDto } from '../dto/verify-national-id.dto';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { SaveVaccinationHistoryDto } from "../dto/save-vaccination-history.dto";
import { SavePastHistoryDto } from '../dto/save-past-history.dto';
import { SaveDrugHistoryDto } from '../dto/save-drug-history.dto';
import { SaveAllergyHistoryDto } from '../dto/save-allergy-history.dto';
import { SaveFamilyHistoryDto } from '../dto/save-family-history.dto';
import { SaveSocialHistoryDto } from '../dto/save-social-history.dto';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private maskIdentifierNumber(
    identifierNumber?: string | null,
  ): string | null {
    if (!identifierNumber) {
      return null;
    }

    if (identifierNumber.length <= 4) {
      return '*'.repeat(identifierNumber.length);
    }

    return `${'*'.repeat(
      identifierNumber.length - 4,
    )}${identifierNumber.slice(-4)}`;
  }

  private sanitizePatient<T extends {
    identifierNumber?: string | null;
  }>(patient: T) {
    return {
      ...patient,
      identifierNumber:
        this.maskIdentifierNumber(
          patient.identifierNumber,
        ),
    };
  }

  private async getActiveMembership(
    userId: string,
    clinicId: string,
  ) {
    if (!clinicId?.trim()) {
      throw new BadRequestException(
        'Clinic ID is required',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          status: MembershipStatus.ACTIVE,
        },
        include: {
          clinic: {
            select: {
              isActive: true,
            },
          },
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic membership not found',
      );
    }

    return membership;
  }

  private async getActiveMembershipForPatient(
    userId: string,
    patientId: string,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
        clinicId: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.getActiveMembership(
      userId,
      patient.clinicId,
    );
  }

  private async generatePatientCode(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const counter =
      await tx.systemCounter.update({
        where: {
          id: 'PATIENT_CODE',
        },
        data: {
          value: {
            increment: 1,
          },
        },
      });

    return `PT-${counter.value
      .toString()
      .padStart(6, '0')}`;
  }

  async create(
    userId: string,
    clinicId: string,
    dto: CreatePatientDto,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    if (
      dto.dateOfBirth === undefined &&
      dto.estimatedAgeValue === undefined
    ) {
      throw new BadRequestException(
        'Date of birth or estimated age is required.',
      );
    }

    if (
      dto.estimatedAgeValue !== undefined &&
      !dto.estimatedAgeUnit
    ) {
      throw new BadRequestException(
        'Estimated age unit is required.',
      );
    }

    if (
      dto.identifierType !==
      PatientIdentifierType.OTHER
    ) {
      dto.documentType = undefined;
    }

    const basePatientData = {
      identifierType: dto.identifierType,
      identifierNumber: dto.identifierNumber,
      documentType: dto.documentType,
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth,
      estimatedAgeValue:
        dto.estimatedAgeValue,
      estimatedAgeUnit:
        dto.estimatedAgeUnit,
      maritalStatus: dto.maritalStatus,
      childrenCount: dto.childrenCount,
      phone: dto.phone,
      occupation: dto.occupation,
      governorate: dto.governorate,
      city: dto.city,
      district: dto.district,
      streetAddress: dto.streetAddress,
    };

    let patientData: typeof basePatientData & {
      gender: import('@prisma/client').Gender;
    };

    if (
      dto.identifierType ===
      PatientIdentifierType.NATIONAL_ID
    ) {
      if (!dto.identifierNumber) {
        throw new BadRequestException(
          'National ID is required.',
        );
      }

      const existingPatient =
        await this.prisma.patient.findFirst({
          where: {
            clinicId: membership.clinicId,
            identifierType:
              PatientIdentifierType.NATIONAL_ID,
            identifierNumber:
              dto.identifierNumber,
          },
          select: {
            id: true,
          },
        });

      if (existingPatient) {
        throw new ConflictException(
          'A patient with this National ID already exists in this clinic.',
        );
      }

      try {
        const nationalIdData =
          parseEgyptianNationalId(
            dto.identifierNumber,
          );

        patientData = {
          ...basePatientData,
          dateOfBirth:
            nationalIdData.dateOfBirth,
          gender: nationalIdData.gender,
        };
      } catch (error) {
        throw new BadRequestException(
          error instanceof Error
            ? error.message
            : 'Invalid Egyptian National ID.',
        );
      }
    } else {
      if (!dto.gender) {
        throw new BadRequestException(
          'Gender is required.',
        );
      }

      patientData = {
        ...basePatientData,
        gender: dto.gender,
      };
    }

    return this.prisma.$transaction(
      async (tx) => {
        const patientCode =
          await this.generatePatientCode(tx);

        const patient = await tx.patient.create({
          data: {
            clinicId: membership.clinicId,
            patientCode,
            ...patientData,
          },
        });

        return this.sanitizePatient(patient);
      },
    );
  }

  async getAll(
    userId: string,
    clinicId: string,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    const patients =
      await this.prisma.patient.findMany({
        where: {
          clinicId: membership.clinicId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return patients.map((patient) =>
      this.sanitizePatient(patient),
    );
  }

  async getById(
    userId: string,
    clinicId: string,
    id: string,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    const patient =
      await this.prisma.patient.findFirst({
        where: {
          id,
          clinicId: membership.clinicId,
        },
      });

    if (!patient) {
      throw new NotFoundException(
        'Patient not found',
      );
    }

    return this.sanitizePatient(patient);
  }

  async update(
    userId: string,
    clinicId: string,
    id: string,
    dto: UpdatePatientDto,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    const patient =
      await this.prisma.patient.findFirst({
        where: {
          id,
          clinicId: membership.clinicId,
        },
      });

    if (!patient) {
      throw new NotFoundException(
        'Patient not found',
      );
    }

    const currentIsNationalId =
      patient.identifierType ===
      PatientIdentifierType.NATIONAL_ID;

    const requestedIdentifierType =
      dto.identifierType ??
      patient.identifierType;

    // =========================================
    // National ID type cannot be changed
    // =========================================

    if (
      currentIsNationalId &&
      dto.identifierType !== undefined &&
      dto.identifierType !==
        PatientIdentifierType.NATIONAL_ID
    ) {
      throw new BadRequestException(
        'Patient identifier type cannot be changed because the patient has a National ID.',
      );
    }

    // =========================================
    // National ID patients:
    // ID, DOB, age and gender are protected
    // =========================================

    if (currentIsNationalId) {
      if (
        dto.identifierNumber !== undefined &&
        dto.identifierNumber !==
          patient.identifierNumber
      ) {
        throw new BadRequestException(
          'National ID cannot be changed.',
        );
      }

      if (dto.dateOfBirth !== undefined) {
        throw new BadRequestException(
          'Date of birth cannot be changed for a patient with a National ID.',
        );
      }

      if (
        dto.estimatedAgeValue !== undefined ||
        dto.estimatedAgeUnit !== undefined
      ) {
        throw new BadRequestException(
          'Age cannot be changed for a patient with a National ID.',
        );
      }

      if (dto.gender !== undefined) {
        throw new BadRequestException(
          'Gender cannot be changed for a patient with a National ID.',
        );
      }
    }

    // =========================================
    // If changing TO National ID
    // =========================================

    let nationalIdData:
      | ReturnType<typeof parseEgyptianNationalId>
      | undefined;

    if (
      requestedIdentifierType ===
      PatientIdentifierType.NATIONAL_ID
    ) {
      const nationalId =
        dto.identifierNumber ??
        patient.identifierNumber;

      if (!nationalId) {
        throw new BadRequestException(
          'National ID is required.',
        );
      }

      try {
        nationalIdData =
          parseEgyptianNationalId(
            nationalId,
          );
      } catch (error) {
        throw new BadRequestException(
          error instanceof Error
            ? error.message
            : 'Invalid Egyptian National ID.',
        );
      }

      const existingPatient =
        await this.prisma.patient.findFirst({
          where: {
            clinicId: membership.clinicId,
            identifierType:
              PatientIdentifierType.NATIONAL_ID,
            identifierNumber: nationalId,
            id: {
              not: patient.id,
            },
          },
          select: {
            id: true,
          },
        });

      if (existingPatient) {
        throw new ConflictException(
          'A patient with this National ID already exists in this clinic.',
        );
      }
    }

    // =========================================
    // Non-National ID patients
    // =========================================

    if (
      requestedIdentifierType !==
        PatientIdentifierType.NATIONAL_ID &&
      !currentIsNationalId
    ) {
      const finalDateOfBirth =
        dto.dateOfBirth ??
        patient.dateOfBirth;

      const finalEstimatedAgeValue =
        dto.estimatedAgeValue ??
        patient.estimatedAgeValue;

      const finalEstimatedAgeUnit =
        dto.estimatedAgeUnit ??
        patient.estimatedAgeUnit;

      const finalGender =
        dto.gender ?? patient.gender;

      if (
        finalDateOfBirth === null &&
        finalEstimatedAgeValue === null
      ) {
        throw new BadRequestException(
          'Date of birth or estimated age is required.',
        );
      }

      if (
        finalEstimatedAgeValue !== null &&
        !finalEstimatedAgeUnit
      ) {
        throw new BadRequestException(
          'Estimated age unit is required.',
        );
      }

      if (!finalGender) {
        throw new BadRequestException(
          'Gender is required.',
        );
      }
    }

    // =========================================
    // documentType follows Create rules
    // =========================================

    const documentType =
      requestedIdentifierType ===
      PatientIdentifierType.OTHER
        ? dto.documentType !== undefined
          ? dto.documentType
          : patient.documentType
        : null;

    // =========================================
    // Build update data
    // =========================================

    const data: Prisma.PatientUpdateInput = {
      ...(dto.fullName !== undefined && {
        fullName: dto.fullName,
      }),

      ...(dto.identifierType !==
        undefined && {
        identifierType:
          dto.identifierType,
      }),

      ...(dto.identifierNumber !==
        undefined && {
        identifierNumber:
          dto.identifierNumber,
      }),

      ...(dto.documentType !==
        undefined ||
        dto.identifierType !==
          undefined
        ? {
            documentType,
          }
        : {}),

      ...(dto.dateOfBirth !==
        undefined && {
        dateOfBirth:
          dto.dateOfBirth,
      }),

      ...(dto.estimatedAgeValue !==
        undefined && {
        estimatedAgeValue:
          dto.estimatedAgeValue,
      }),

      ...(dto.estimatedAgeUnit !==
        undefined && {
        estimatedAgeUnit:
          dto.estimatedAgeUnit,
      }),

      ...(dto.gender !== undefined && {
        gender: dto.gender,
      }),

      ...(dto.maritalStatus !==
        undefined && {
        maritalStatus:
          dto.maritalStatus,
      }),

      ...(dto.childrenCount !==
        undefined && {
        childrenCount:
          dto.childrenCount,
      }),

      ...(dto.phone !== undefined && {
        phone: dto.phone,
      }),

      ...(dto.occupation !==
        undefined && {
        occupation:
          dto.occupation,
      }),

      ...(dto.governorate !==
        undefined && {
        governorate:
          dto.governorate,
      }),

      ...(dto.city !== undefined && {
        city: dto.city,
      }),

      ...(dto.district !==
        undefined && {
        district:
          dto.district,
      }),

      ...(dto.streetAddress !==
        undefined && {
        streetAddress:
          dto.streetAddress,
      }),

      // National ID always determines these values.
      ...(nationalIdData && {
        dateOfBirth:
          nationalIdData.dateOfBirth,
        gender:
          nationalIdData.gender,
        estimatedAgeValue: null,
        estimatedAgeUnit: null,
      }),
    };

    return this.prisma.patient.update({
      where: {
        id: patient.id,
      },
      data,
    });
  }

  async search(
    userId: string,
    clinicId: string,
    query: string,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    const value = query?.trim();

    if (!value) {
      throw new BadRequestException(
        'Search query is required.',
      );
    }

    const patients =
      await this.prisma.patient.findMany({
        where: {
          clinicId: membership.clinicId,
          OR: [
            {
              patientCode: {
                contains: value,
                mode: 'insensitive',
              },
            },
            {
              fullName: {
                contains: value,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: value,
              },
            },
            {
              identifierNumber: {
                contains: value,
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

    return patients.map((patient) =>
      this.sanitizePatient(patient),
    );
  }

  async verifyNationalId(
    userId: string,
    clinicId: string,
    dto: VerifyNationalIdDto,
  ) {
    const membership =
      await this.getActiveMembership(
        userId,
        clinicId,
      );

    const nationalId =
      dto.nationalId.trim();

    if (!/^\d{14}$/.test(nationalId)) {
      throw new BadRequestException(
        'National ID must be exactly 14 digits.',
      );
    }

    let nationalIdData;

    try {
      nationalIdData =
        parseEgyptianNationalId(
          nationalId,
        );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Invalid Egyptian National ID.',
      );
    }

    const existingPatient =
      await this.prisma.patient.findFirst({
        where: {
          clinicId: membership.clinicId,
          identifierType:
            PatientIdentifierType.NATIONAL_ID,
          identifierNumber: nationalId,
        },
        select: {
          id: true,
          patientCode: true,
          fullName: true,
        },
      });

    return {
      valid: true,
      alreadyExists: !!existingPatient,
      existingPatient:
        existingPatient
          ? {
              id: existingPatient.id,
              patientCode:
                existingPatient.patientCode,
              fullName:
                existingPatient.fullName,
            }
          : null,
      dateOfBirth:
        nationalIdData.dateOfBirth,
      gender:
        nationalIdData.gender,
    };
  }

  async saveVaccinationHistory(
    userId: string,
    patientId: string,
    dto: SaveVaccinationHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    // =========================================
    // Basic validation
    // =========================================
    if (!dto.vaccinationStatus) {
      throw new BadRequestException(
        'Vaccination status is required.',
      );
    }

    // =========================================
    // PARTIALLY VACCINATED
    // =========================================
    let missedVaccines: string[] = [];
    let partialReason:
      | SaveVaccinationHistoryDto['partialReason']
      | undefined;
    let partialOtherDetails: string | undefined;

    if (
      dto.vaccinationStatus ===
      'PARTIALLY_VACCINATED'
    ) {
      missedVaccines = dto.missedVaccines ?? [];

      if (missedVaccines.length === 0) {
        throw new BadRequestException(
          'At least one missed vaccine is required for a partially vaccinated patient.',
        );
      }

      if (!dto.partialReason) {
        throw new BadRequestException(
          'Reason is required for a partially vaccinated patient.',
        );
      }

      partialReason = dto.partialReason;

      if (
        dto.partialReason === 'OTHER'
      ) {
        if (!dto.partialOtherDetails?.trim()) {
          throw new BadRequestException(
            'Other reason details are required.',
          );
        }

        partialOtherDetails =
          dto.partialOtherDetails.trim();
      }
    }

    // =========================================
    // UNVACCINATED
    // =========================================
    let unvaccinatedReason:
      | SaveVaccinationHistoryDto['unvaccinatedReason']
      | undefined;
    let unvaccinatedOtherDetails:
      | string
      | undefined;

    if (
      dto.vaccinationStatus ===
      'UNVACCINATED'
    ) {
      if (!dto.unvaccinatedReason) {
        throw new BadRequestException(
          'Reason is required for an unvaccinated patient.',
        );
      }

      unvaccinatedReason =
        dto.unvaccinatedReason;

      if (
        dto.unvaccinatedReason === 'OTHER'
      ) {
        if (
          !dto.unvaccinatedOtherDetails?.trim()
        ) {
          throw new BadRequestException(
            'Other reason details are required.',
          );
        }

        unvaccinatedOtherDetails =
          dto.unvaccinatedOtherDetails.trim();
      }
    }

    // =========================================
    // PREVIOUS VACCINE REACTION
    // =========================================
    let reactionSeverity:
      | SaveVaccinationHistoryDto['reactionSeverity']
      | undefined;
    let reactionDetails:
      | string
      | undefined;

    if (dto.previousReaction === true) {
      if (!dto.reactionSeverity) {
        throw new BadRequestException(
          'Reaction severity is required when previous reaction is yes.',
        );
      }

      if (!dto.reactionDetails?.trim()) {
        throw new BadRequestException(
          'Reaction details are required when previous reaction is yes.',
        );
      }

      reactionSeverity =
        dto.reactionSeverity;

      reactionDetails =
        dto.reactionDetails.trim();
    }

    // =========================================
    // Upsert patient vaccination history
    // =========================================
    return this.prisma.patientVaccinationHistory.upsert({
      where: {
        patientId,
      },

      create: {
        patientId,

        vaccinationStatus:
          dto.vaccinationStatus,

        missedVaccines,

        partialReason,
        partialOtherDetails,

        unvaccinatedReason,
        unvaccinatedOtherDetails,

        previousReaction:
          dto.previousReaction ?? false,

        reactionSeverity,
        reactionDetails,
      },

      update: {
        vaccinationStatus:
          dto.vaccinationStatus,

        // Clear old conditional data when
        // vaccination status changes.
        missedVaccines,

        partialReason,
        partialOtherDetails,

        unvaccinatedReason,
        unvaccinatedOtherDetails,

        previousReaction:
          dto.previousReaction ?? false,

        reactionSeverity,
        reactionDetails,
      },
    });
  }

  async getVaccinationHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patientVaccinationHistory.findUnique({
      where: {
        patientId,
      },
    });
  }

  async savePastHistory(
    userId: string,
    patientId: string,
    dto: SavePastHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.$transaction(
      async (tx) => {
        // =========================================
        // Remove previous Past History
        // =========================================

        await tx.patientChronicDisease.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patientHospitalization.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patientOperation.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patientBloodTransfusion.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patientMajorTrauma.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patientICUAdmission.deleteMany({
          where: {
            patientId,
          },
        });

        // =========================================
        // Create Chronic Diseases
        // =========================================

        if (dto.chronicDiseases.length > 0) {
          await tx.patientChronicDisease.createMany({
            data: dto.chronicDiseases.map(
              (disease) => ({
                patientId,
                diseaseCode:
                  disease.diseaseCode,
                diseaseName:
                  disease.diseaseName,
                notes:
                  disease.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Create Hospitalizations
        // =========================================

        if (dto.hospitalizations.length > 0) {
          await tx.patientHospitalization.createMany({
            data: dto.hospitalizations.map(
              (item) => ({
                patientId,
                reason: item.reason.trim(),
                date: item.date
                  ? new Date(item.date)
                  : null,
                duration:
                  item.duration?.trim() || null,
                notes:
                  item.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Create Operations
        // =========================================

        if (dto.operations.length > 0) {
          await tx.patientOperation.createMany({
            data: dto.operations.map(
              (item) => ({
                patientId,
                operationName:
                  item.operationName.trim(),
                date: item.date
                  ? new Date(item.date)
                  : null,
                indication:
                  item.indication?.trim() || null,
                notes:
                  item.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Create Blood Transfusions
        // =========================================

        if (dto.bloodTransfusions.length > 0) {
          await tx.patientBloodTransfusion.createMany({
            data: dto.bloodTransfusions.map(
              (item) => ({
                patientId,
                reason:
                  item.reason?.trim() || null,
                date: item.date
                  ? new Date(item.date)
                  : null,
                reaction:
                  item.reaction?.trim() || null,
                notes:
                  item.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Create Major Traumas
        // =========================================

        if (dto.majorTraumas.length > 0) {
          await tx.patientMajorTrauma.createMany({
            data: dto.majorTraumas.map(
              (item) => ({
                patientId,
                traumaType:
                  item.traumaType.trim(),
                date: item.date
                  ? new Date(item.date)
                  : null,
                complications:
                  item.complications?.trim() ||
                  null,
                notes:
                  item.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Create ICU Admissions
        // =========================================

        if (dto.icuAdmissions.length > 0) {
          await tx.patientICUAdmission.createMany({
            data: dto.icuAdmissions.map(
              (item) => ({
                patientId,
                reason: item.reason.trim(),
                date: item.date
                  ? new Date(item.date)
                  : null,
                duration:
                  item.duration?.trim() || null,
                ventilatorSupport:
                  item.ventilatorSupport ?? false,
                notes:
                  item.notes?.trim() || null,
              }),
            ),
          });
        }

        // =========================================
        // Return complete Past History
        // =========================================

        return tx.patient.findUnique({
          where: {
            id: patientId,
          },
          select: {
            chronicDiseases: true,
            hospitalizations: true,
            operations: true,
            bloodTransfusions: true,
            majorTraumas: true,
            icuAdmissions: true,
          },
        });
      },
    );
  }

  async getPastHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        chronicDiseases: true,
        hospitalizations: true,
        operations: true,
        bloodTransfusions: true,
        majorTraumas: true,
        icuAdmissions: true,
      },
    });
  }

  async saveDrugHistory(
    userId: string,
    patientId: string,
    dto: SaveDrugHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    if (
      dto.selfMedication &&
      !dto.selfMedicationDetails?.trim()
    ) {
      throw new BadRequestException(
        'Self-medication details are required when self-medication is yes.',
      );
    }

    if (
      !dto.selfMedication &&
      dto.selfMedicationDetails
    ) {
      dto.selfMedicationDetails = undefined;
    }

    if (
      dto.takesSupplements &&
      !dto.supplementDetails?.trim()
    ) {
      throw new BadRequestException(
        'Supplement details are required when supplements are taken.',
      );
    }

    if (
      !dto.takesSupplements &&
      dto.supplementDetails
    ) {
      dto.supplementDetails = undefined;
    }

    return this.prisma.$transaction(
      async (tx) => {
        await tx.patientMedication.deleteMany({
          where: {
            patientId,
          },
        });

        if (dto.medications.length > 0) {
          await tx.patientMedication.createMany({
            data: dto.medications.map((medication) => ({
              patientId,
              medicationName:
                medication.medicationName.trim(),
              dose:
                medication.dose?.trim() || null,
              durationValue:
                medication.durationValue ?? null,
              durationUnit:
                medication.durationUnit ?? null,
              notes:
                medication.notes?.trim() || null,
            })),
          });
        }

        const patient =
          await tx.patient.update({
            where: {
              id: patientId,
            },
            data: {
              medicationCompliance:
                dto.medicationCompliance ?? null,

              selfMedication:
                dto.selfMedication,

              selfMedicationDetails:
                dto.selfMedication
                  ? dto.selfMedicationDetails?.trim() ||
                    null
                  : null,

              takesSupplements:
                dto.takesSupplements,

              supplementDetails:
                dto.takesSupplements
                  ? dto.supplementDetails?.trim() ||
                    null
                  : null,
            },
            select: {
              medications: true,
              medicationCompliance: true,
              selfMedication: true,
              selfMedicationDetails: true,
              takesSupplements: true,
              supplementDetails: true,
            },
          });

        return patient;
      },
    );
  }

  async getDrugHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        medications: true,
        medicationCompliance: true,
        selfMedication: true,
        selfMedicationDetails: true,
        takesSupplements: true,
        supplementDetails: true,
      },
    });
  }

  async saveAllergyHistory(
    userId: string,
    patientId: string,
    dto: SaveAllergyHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    if (
      dto.hasAllergy &&
      dto.allergies.length === 0
    ) {
      throw new BadRequestException(
        'At least one allergy is required when the patient has an allergy.',
      );
    }

    if (
      !dto.hasAllergy &&
      dto.allergies.length > 0
    ) {
      throw new BadRequestException(
        'Allergies must be empty when the patient has no allergy.',
      );
    }

    if (
      dto.hasAllergy
    ) {
      for (const allergy of dto.allergies) {
        if (
          allergy.type === 'OTHER' &&
          !allergy.allergen.trim()
        ) {
          throw new BadRequestException(
            'Allergen is required.',
          );
        }
      }
    }

    return this.prisma.$transaction(
      async (tx) => {
        await tx.patientAllergy.deleteMany({
          where: {
            patientId,
          },
        });

        if (
          dto.hasAllergy &&
          dto.allergies.length > 0
        ) {
          await tx.patientAllergy.createMany({
            data: dto.allergies.map(
              (allergy) => ({
                patientId,

                type: allergy.type,

                allergen:
                  allergy.allergen.trim(),

                reaction:
                  allergy.reaction?.trim() ||
                  null,

                severity:
                  allergy.severity,

                notes:
                  allergy.notes?.trim() ||
                  null,
              }),
            ),
          });
        }

        return tx.patient.update({
          where: {
            id: patientId,
          },
          data: {
            hasAllergy: dto.hasAllergy,
          },
          select: {
            hasAllergy: true,
            allergies: true,
          },
        });
      },
    );
  }

  async getAllergyHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        hasAllergy: true,
        allergies: true,
      },
    });
  }

  async saveFamilyHistory(
    userId: string,
    patientId: string,
    dto: SaveFamilyHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    for (const member of dto.familyHistory) {
      if (
        member.relation === 'OTHER' &&
        !member.otherRelation?.trim()
      ) {
        throw new BadRequestException(
          'Other relation details are required when relation is OTHER.',
        );
      }

      if (
        member.relation !== 'OTHER' &&
        member.otherRelation?.trim()
      ) {
        throw new BadRequestException(
          'Other relation details are only allowed when relation is OTHER.',
        );
      }

      if (!member.alive) {
        if (
          member.ageAtDeath === undefined &&
          !member.causeOfDeath?.trim()
        ) {
          throw new BadRequestException(
            'Age at death or cause of death is required for a deceased family member.',
          );
        }
      }

      if (member.alive) {
        if (
          member.ageAtDeath !== undefined ||
          member.causeOfDeath?.trim()
        ) {
          throw new BadRequestException(
            'Death information cannot be provided for a living family member.',
          );
        }
      }
    }

    return this.prisma.$transaction(
      async (tx) => {
        await tx.patientFamilyHistory.deleteMany({
          where: {
            patientId,
          },
        });

        if (
          dto.familyHistory.length > 0
        ) {
          await tx.patientFamilyHistory.createMany({
            data: dto.familyHistory.map(
              (member) => ({
                patientId,

                relation:
                  member.relation,

                otherRelation:
                  member.relation === 'OTHER'
                    ? member.otherRelation?.trim() ||
                      null
                    : null,

                diseases:
                  member.diseases
                    .map((disease) =>
                      disease.trim(),
                    )
                    .filter(Boolean),

                alive:
                  member.alive,

                ageAtDeath:
                  member.alive
                    ? null
                    : member.ageAtDeath ??
                      null,

                causeOfDeath:
                  member.alive
                    ? null
                    : member.causeOfDeath?.trim() ||
                      null,

                notes:
                  member.notes?.trim() ||
                  null,
              }),
            ),
          });
        }

        return tx.patient.findUnique({
          where: {
            id: patientId,
          },
          select: {
            familyHistory: true,
          },
        });
      },
    );
  }

  async getFamilyHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        familyHistory: true,
      },
    });
  }

  async saveSocialHistory(
    userId: string,
    patientId: string,
    dto: SaveSocialHistoryDto,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    // =========================
    // Smoking validation
    // =========================

    if (
      dto.smoking === 'CURRENT'
    ) {
      if (
        dto.cigarettesPerDay === undefined
      ) {
        throw new BadRequestException(
          'Cigarettes per day is required for current smokers.',
        );
      }

      if (
        dto.yearsSmoking === undefined
      ) {
        throw new BadRequestException(
          'Years of smoking is required for current smokers.',
        );
      }
    }

    if (
      dto.smoking === 'FORMER' &&
      dto.yearsSinceQuitting === undefined
    ) {
      throw new BadRequestException(
        'Years since quitting is required for former smokers.',
      );
    }

    if (
      dto.smoking === 'NEVER'
    ) {
      dto.cigarettesPerDay = undefined;
      dto.yearsSmoking = undefined;
      dto.yearsSinceQuitting = undefined;
    }

    // =========================
    // Alcohol validation
    // =========================

    if (
      dto.alcohol === 'CURRENT'
    ) {
      if (!dto.alcoholFrequency) {
        throw new BadRequestException(
          'Alcohol frequency is required for current alcohol use.',
        );
      }

      dto.yearsSinceStopping = undefined;
    }

    if (
      dto.alcohol === 'FORMER' &&
      dto.yearsSinceStopping === undefined
    ) {
      throw new BadRequestException(
        'Years since stopping is required for former alcohol use.',
      );
    }

    if (
      dto.alcohol === 'NO'
    ) {
      dto.alcoholFrequency = undefined;
      dto.yearsSinceStopping = undefined;
    }

    // =========================
    // Substance use
    // =========================

    const substanceUse =
      dto.substanceUse
        .map((item) => item.trim())
        .filter(Boolean);

    if (
      substanceUse.length === 0
    ) {
      dto.substanceNotes = undefined;
    }

    // =========================
    // Living condition
    // =========================

    if (
      dto.livingCondition !== 'OTHER'
    ) {
      dto.livingConditionNotes =
        undefined;
    }

    // =========================
    // Save
    // =========================

    return this.prisma.patientSocialHistory.upsert({
      where: {
        patientId,
      },

      create: {
        patientId,

        smoking:
          dto.smoking ?? null,

        cigarettesPerDay:
          dto.smoking === 'CURRENT'
            ? dto.cigarettesPerDay ?? null
            : null,

        yearsSmoking:
          dto.smoking === 'CURRENT' ||
          dto.smoking === 'FORMER'
            ? dto.yearsSmoking ?? null
            : null,

        yearsSinceQuitting:
          dto.smoking === 'FORMER'
            ? dto.yearsSinceQuitting ?? null
            : null,

        alcohol:
          dto.alcohol ?? null,

        alcoholFrequency:
          dto.alcohol === 'CURRENT'
            ? dto.alcoholFrequency ?? null
            : null,

        yearsSinceStopping:
          dto.alcohol === 'FORMER'
            ? dto.yearsSinceStopping ?? null
            : null,

        livingCondition:
          dto.livingCondition ?? null,

        livingConditionNotes:
          dto.livingConditionNotes
            ?.trim() || null,

        substanceUse,

        substanceNotes:
          dto.substanceNotes?.trim() ||
          null,

        physicalActivity:
          dto.physicalActivity ?? null,

        physicalActivityNotes:
          dto.physicalActivityNotes
            ?.trim() || null,

        sleepDuration:
          dto.sleepDuration ?? null,

        sleepNotes:
          dto.sleepNotes?.trim() ||
          null,

        socialSupport:
          dto.socialSupport ?? null,

        socialSupportNotes:
          dto.socialSupportNotes
            ?.trim() || null,

        sexualHistory:
          dto.sexualHistory ?? null,

        sexualHistoryNotes:
          dto.sexualHistoryNotes
            ?.trim() || null,
      },

      update: {
        smoking:
          dto.smoking ?? null,

        cigarettesPerDay:
          dto.smoking === 'CURRENT'
            ? dto.cigarettesPerDay ?? null
            : null,

        yearsSmoking:
          dto.smoking === 'CURRENT' ||
          dto.smoking === 'FORMER'
            ? dto.yearsSmoking ?? null
            : null,

        yearsSinceQuitting:
          dto.smoking === 'FORMER'
            ? dto.yearsSinceQuitting ?? null
            : null,

        alcohol:
          dto.alcohol ?? null,

        alcoholFrequency:
          dto.alcohol === 'CURRENT'
            ? dto.alcoholFrequency ?? null
            : null,

        yearsSinceStopping:
          dto.alcohol === 'FORMER'
            ? dto.yearsSinceStopping ?? null
            : null,

        livingCondition:
          dto.livingCondition ?? null,

        livingConditionNotes:
          dto.livingConditionNotes
            ?.trim() || null,

        substanceUse,

        substanceNotes:
          dto.substanceNotes?.trim() ||
          null,

        physicalActivity:
          dto.physicalActivity ?? null,

        physicalActivityNotes:
          dto.physicalActivityNotes
            ?.trim() || null,

        sleepDuration:
          dto.sleepDuration ?? null,

        sleepNotes:
          dto.sleepNotes?.trim() ||
          null,

        socialSupport:
          dto.socialSupport ?? null,

        socialSupportNotes:
          dto.socialSupportNotes
            ?.trim() || null,

        sexualHistory:
          dto.sexualHistory ?? null,

        sexualHistoryNotes:
          dto.sexualHistoryNotes
            ?.trim() || null,
      },
    });
  }

  async getSocialHistory(
    userId: string,
    patientId: string,
  ) {
    await this.getActiveMembershipForPatient(
      userId,
      patientId,
    );

    return this.prisma.patientSocialHistory.findUnique({
      where: {
        patientId,
      },
    });
  }

}