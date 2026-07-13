import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateClinicDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
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

          clinicRole: 'OWNER',
          status: 'ACTIVE',
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
          status: 'ACTIVE',
        },
      },
    },
    include: {
      workingDays: true,
      members: true,
    },
  });
}
}