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
}