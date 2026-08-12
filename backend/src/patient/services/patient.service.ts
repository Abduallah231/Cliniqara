import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MembershipStatus,
  PatientIdentifierType,
  Prisma
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
    const counter = await tx.systemCounter.update({
      where: {
        id: "PATIENT_CODE",
      },
      data: {
        value: {
          increment: 1,
        },
      },
    });

    return `PT-${counter.value
      .toString()
      .padStart(6, "0")}`;
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
      estimatedAgeValue: dto.estimatedAgeValue,
      estimatedAgeUnit: dto.estimatedAgeUnit,
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
      dto.identifierType === 'NATIONAL_ID'
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
          dateOfBirth: nationalIdData.dateOfBirth,
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

    return this.prisma.$transaction(async (tx) => {
      const patientCode = await this.generatePatientCode(
        tx,
      );

      return tx.patient.create({
        data: {
          clinicId: membership.clinicId,
          patientCode,
          ...patientData,
        },
      });
    });
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

    return this.prisma.patient.findMany({
      where: {
        clinicId: membership.clinicId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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

    return patient;
  }

  async update(
    userId: string,
    clinicId: string,
    id: string,
    dto: UpdatePatientDto,
  ) {
    await this.getActiveMembership(
      userId,
      clinicId,
    );

    await this.getById(
      userId,
      clinicId,
      id,
    );

    return this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        ...(dto.phone !== undefined && {
          phone: dto.phone,
        }),
        ...(dto.occupation !== undefined && {
          occupation: dto.occupation,
        }),
        ...(dto.childrenCount !== undefined && {
          childrenCount: dto.childrenCount,
        }),
        ...(dto.governorate !== undefined && {
          governorate: dto.governorate,
        }),
        ...(dto.city !== undefined && {
          city: dto.city,
        }),
        ...(dto.district !== undefined && {
          district: dto.district,
        }),
        ...(dto.streetAddress !== undefined && {
          streetAddress: dto.streetAddress,
        }),
      },
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

    return this.prisma.patient.findMany({
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