import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ClinicRole,
  MembershipStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateClinicDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existingClinic =
        await tx.clinicMember.findFirst({
          where: {
            userId,
            clinicRole: ClinicRole.OWNER,
            status: MembershipStatus.ACTIVE,
          },
        });

      if (existingClinic) {
        throw new ConflictException(
          'You already own a clinic',
        );
      }
      const phoneExists =
        await tx.clinic.findFirst({
          where: {
            phone: dto.phone,
          },
        });

      if (phoneExists) {
        throw new ConflictException(
          'Clinic phone already exists',
        );
      }

      if (dto.email) {
        const emailExists =
          await tx.clinic.findFirst({
            where: {
              email: dto.email,
            },
          });

        if (emailExists) {
          throw new ConflictException(
            'Clinic email already exists',
          );
        }
      }

      const clinic = await tx.clinic.create({
        data: {
          clinicCode: crypto.randomUUID(),

          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          country: dto.country,
          city: dto.city,

          createdById: userId,

          workingDays: {
            create: dto.workingDays.map((day) => ({
              day: day.day,
              startTime: day.startTime ?? '',
              endTime: day.endTime ?? '',
              isClosed: day.isClosed,
            })),
          },
        },

        include: {
          workingDays: true,
        },
      });
      await tx.clinicMember.create({
        data: {
          clinicId: clinic.id,
          userId,

          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });
      return clinic;
    });
  }
  async getMyClinic(userId: string) {
    return this.prisma.clinic.findFirst({
      where: {
        members: {
          some: {
            userId,
            status: MembershipStatus.ACTIVE,
          },
        },
      },
      include: {
        workingDays: true,
        members: true,
        },
      });
    }
  async updateMyClinic(
    userId: string,
    dto: UpdateClinicDto,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
          clinicRole: ClinicRole.OWNER,
        },
      });

    if (!membership) {
      throw new NotFoundException('Clinic not found');
    }

    if (dto.phone) {
      const phoneExists =
        await this.prisma.clinic.findFirst({
          where: {
            phone: dto.phone,
            NOT: {
              id: membership.clinicId,
            },
          },
        });

      if (phoneExists) {
        throw new ConflictException(
          'Clinic phone already exists',
        );
      }
    }

    if (dto.email) {
      const emailExists =
        await this.prisma.clinic.findFirst({
          where: {
            email: dto.email,
            NOT: {
              id: membership.clinicId,
            },
          },
        });

      if (emailExists) {
        throw new ConflictException(
          'Clinic email already exists',
        );
      }
    }

    return this.prisma.clinic.update({
      where: {
        id: membership.clinicId,
      },
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        country: dto.country,
        city: dto.city,
      },
      include: {
        workingDays: true,
      },
    });
  }
}