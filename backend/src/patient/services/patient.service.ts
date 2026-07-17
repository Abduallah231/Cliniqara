import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  MembershipStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreatePatientDto,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    // TODO (PC)
    // Generate Display Code

    // TODO (PC)
    // Generate Secure Code

    // TODO (PC)
    // Parse National ID & Calculate DOB

    return this.prisma.patient.create({
      data: {
        clinicId: membership.clinicId,

        patientCode: '',

        ...dto,
      },
    });
  }

  async getAll(
    userId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

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
    id: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

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
    id: string,
    dto: UpdatePatientDto,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    await this.getById(
      userId,
      id,
    );

    return this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
}