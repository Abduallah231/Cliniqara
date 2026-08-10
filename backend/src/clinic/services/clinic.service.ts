import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  ClinicRole,
  DoctorLevel,
  MembershipStatus,
} from '@prisma/client';
import { randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { JoinClinicDto } from '../dto/join-clinic.dto';
import { TransferOwnershipDto } from '../dto/transfer-ownership.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveMembership(
    userId: string,
    clinicId: string,
  ) {
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

    if (!membership.clinic.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    return membership;
  }

  async create(
    userId: string,
    dto: CreateClinicDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          doctorLevel: true,
          verificationStatus: true,
        },
      });

      if (
        !user ||
        user.doctorLevel !== DoctorLevel.DOCTOR ||
        user.verificationStatus !== 'APPROVED'
      ) {
        throw new ConflictException(
          'Only approved doctors can create a clinic',
        );
      }
      
      const clinic = await tx.clinic.create({
        data: {
          clinicCode: randomUUID(),

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
              is24Hours: day.is24Hours,
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

  async getMyClinics(userId: string) {
    const memberships =
      await this.prisma.clinicMember.findMany({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
          OR: [
            { clinic: { isActive: true } },
            {
              clinic: {
                isActive: false,
              },
              clinicRole: ClinicRole.OWNER,
            },
          ],
        },
        include: {
          clinic: {
            include: {
              workingDays: true,
            },
          },
        },
        orderBy: {
          joinedAt: 'asc',
        },
      });

    return memberships.map((membership) => ({
      membershipId: membership.id,
      role: membership.clinicRole,
      clinic: membership.clinic,
    }));
  }

  async createJoinCode(
    userId: string,
    clinicId: string,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    if (!clinic.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const code = randomBytes(6)
      .toString('base64url')
      .toUpperCase();

    const expiresAt = new Date(
      Date.now() + 48 * 60 * 60 * 1000,
    );

    await this.prisma.clinicJoinCode.updateMany({
      where: {
        clinicId,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        expiresAt: new Date(),
      },
    });

    return this.prisma.clinicJoinCode.create({
      data: {
        clinicId,
        code,
        expiresAt,
      },
    });
  }

  async updateMyClinic(
    userId: string,
    clinicId: string,
    dto: UpdateClinicDto,
  ) {
    const membership =
    await this.prisma.clinicMember.findFirst({
      where: {
        userId,
        clinicId,
        status: MembershipStatus.ACTIVE,
        clinicRole: ClinicRole.OWNER,
      },
    });

    if (!membership) {
      throw new NotFoundException('Clinic not found');
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: membership.clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const updatedClinic =
      await this.prisma.$transaction(async (tx) => {
        if (dto.workingDays) {
          await tx.clinicWorkingDay.deleteMany({
            where: {
              clinicId: membership.clinicId,
            },
          });

          await tx.clinicWorkingDay.createMany({
            data: dto.workingDays.map((day) => ({
              clinicId: membership.clinicId,
              day: day.day,
              startTime: day.startTime ?? '',
              endTime: day.endTime ?? '',
              isClosed: day.isClosed,
            })),
          });
        }

        return tx.clinic.update({
          where: {
            id: membership.clinicId,
          },
          data: {
            ...(dto.name !== undefined && {
              name: dto.name,
            }),
            ...(dto.phone !== undefined && {
              phone: dto.phone,
            }),
            ...(dto.email !== undefined && {
              email: dto.email,
            }),
            ...(dto.address !== undefined && {
              address: dto.address,
            }),
            ...(dto.country !== undefined && {
              country: dto.country,
            }),
            ...(dto.city !== undefined && {
              city: dto.city,
            }),
          },
          include: {
            workingDays: true,
          },
        });
      });

    return updatedClinic;
  }

  async joinClinic(
    userId: string,
    dto: JoinClinicDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        accountType: true,
        doctorLevel: true,
        verificationStatus: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    if (user.accountType === AccountType.DOCTOR) {
      if (
        user.doctorLevel !== DoctorLevel.DOCTOR ||
        user.verificationStatus !== 'APPROVED'
      ) {
        throw new ConflictException(
          'Only approved doctors can join a clinic',
        );
      }
    } else if (user.accountType !== AccountType.RECEPTION) {
      throw new ConflictException(
        'This account cannot join a clinic',
      );
    }

    const joinCode =
      await this.prisma.clinicJoinCode.findUnique({
        where: {
          code: dto.joinCode,
        },
        include: {
          clinic: true,
        },
      });

    if (!joinCode) {
      throw new NotFoundException(
        'Invalid clinic join code',
      );
    }

    if (joinCode.expiresAt <= new Date()) {
      throw new ConflictException(
        'Clinic join code has expired',
      );
    }

    const clinic = joinCode.clinic;

    if (!clinic.isActive) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinicRole =
    user.accountType === AccountType.DOCTOR
      ? ClinicRole.DOCTOR
      : ClinicRole.RECEPTION;

    const existingMembership =
      await this.prisma.clinicMember.findUnique({
        where: {
          clinicId_userId: {
            clinicId: clinic.id,
            userId,
          },
        },
      });

    if (
      existingMembership &&
      existingMembership.status === MembershipStatus.ACTIVE
    ) {
      throw new ConflictException(
        'You are already a member of this clinic',
      );
    }

    if (
      existingMembership &&
      existingMembership.status === MembershipStatus.PENDING
    ) {
      throw new ConflictException(
        'Your membership request is already pending',
      );
    }

    if (
      existingMembership &&
      existingMembership.status === MembershipStatus.REMOVED
    ) {
      return this.prisma.clinicMember.update({
        where: {
          id: existingMembership.id,
        },
        data: {
          clinicRole,
          status: MembershipStatus.PENDING,
          removedAt: null,
        },
      });
    }

    return this.prisma.clinicMember.create({
      data: {
        clinicId: clinic.id,
        userId,
        clinicRole,
        status: MembershipStatus.PENDING,
      },
    });
  }

  async approveMembership(
    userId: string,
    clinicId: string,
    membershipId: string,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          id: membershipId,
          clinicId,
          status: MembershipStatus.PENDING,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Membership request not found',
      );
    }

    return this.prisma.clinicMember.update({
      where: {
        id: membershipId,
      },
      data: {
        status: MembershipStatus.ACTIVE,
        joinedAt: new Date(),
        removedAt: null,
      },
    });
  }

  async rejectMembership(
    userId: string,
    clinicId: string,
    membershipId: string,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          id: membershipId,
          clinicId,
          status: MembershipStatus.PENDING,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Membership request not found',
      );
    }

    return this.prisma.clinicMember.update({
      where: {
        id: membershipId,
      },
      data: {
        status: MembershipStatus.REMOVED,
        removedAt: new Date(),
      },
    });
  }

  async getMembershipRequests(
    userId: string,
    clinicId: string,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    return this.prisma.clinicMember.findMany({
      where: {
        clinicId,
        status: MembershipStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            userCode: true,
            accountType: true,
            doctorLevel: true,
            fullName: true,
            specialty: true,
            professionalTitle: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getMembers(
    userId: string,
    clinicId: string,
  ) {
    await this.getActiveMembership(
      userId,
      clinicId,
    );

    return this.prisma.clinicMember.findMany({
      where: {
        clinicId,
        status: MembershipStatus.ACTIVE,
      },
      include: {
        user: {
          select: {
            id: true,
            userCode: true,
            accountType: true,
            doctorLevel: true,
            fullName: true,
            specialty: true,
            professionalTitle: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });
  }

  async removeMember(
    userId: string,
    clinicId: string,
    membershipId: string,
) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: owner.clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          id: membershipId,
          clinicId,
          status: MembershipStatus.ACTIVE,
          clinicRole: {
            not: ClinicRole.OWNER,
          },
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Member not found',
      );
    }

    return this.prisma.clinicMember.update({
      where: {
        id: membershipId,
      },
      data: {
        status: MembershipStatus.REMOVED,
        removedAt: new Date(),
      },
    });
  }

  async transferOwnership(
    userId: string,
    clinicId: string,
    dto: TransferOwnershipDto,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException('Clinic not found');
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: owner.clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is inactive',
      );
    }

    const newOwner =
      await this.prisma.clinicMember.findFirst({
        where: {
          id: dto.membershipId,
          clinicId,
          status: MembershipStatus.ACTIVE,
          clinicRole: ClinicRole.DOCTOR,
        },
        include: {
          user: {
            select: {
              accountType: true,
              doctorLevel: true,
              verificationStatus: true,
            },
          },
        },
      });

    if (!newOwner) {
      throw new NotFoundException(
        'Eligible doctor not found',
      );
    }

    if (
      newOwner.user.accountType !== AccountType.DOCTOR ||
      newOwner.user.doctorLevel !== DoctorLevel.DOCTOR ||
      newOwner.user.verificationStatus !==
        'APPROVED'
    ) {
      throw new ConflictException(
        'Only approved doctors can become owner',
      );
    }

    if (newOwner.id === owner.id) {
      throw new ConflictException(
        'Owner cannot transfer ownership to themselves',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.clinicMember.update({
        where: {
          id: newOwner.id,
        },
        data: {
          clinicRole: ClinicRole.OWNER,
        },
      });

      return tx.clinicMember.update({
        where: {
          id: owner.id,
        },
        data: {
          clinicRole: ClinicRole.DOCTOR,
        },
      });
    });
  }

  async deactivateClinic(userId: string, clinicId: string) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException('Clinic not found');
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: owner.clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic?.isActive) {
      throw new ConflictException(
        'Clinic is already inactive',
      );
    }

    const activeMembers =
      await this.prisma.clinicMember.count({
        where: {
          clinicId,
          status: MembershipStatus.ACTIVE,
          clinicRole: {
            not: ClinicRole.OWNER,
          },
        },
      });

    if (activeMembers > 0) {
      throw new ConflictException(
        'Remove all clinic members before deactivating the clinic',
      );
    }

    return this.prisma.clinic.update({
      where: {
        id: owner.clinicId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async leaveClinic(
    userId: string,
    membershipId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          id: membershipId,
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic membership not found',
      );
    }

    if (membership.clinicRole === ClinicRole.OWNER) {
      throw new ConflictException(
        'Clinic owner cannot leave the clinic',
      );
    }

    return this.prisma.clinicMember.update({
      where: {
        id: membership.id,
      },
      data: {
        status: MembershipStatus.REMOVED,
        removedAt: new Date(),
      },
    });
  }

  async reactivateClinic(
    userId: string,
    clinicId: string,
  ) {
    const owner =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      });

    if (!owner) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
        select: {
          isActive: true,
        },
      });

    if (!clinic) {
      throw new NotFoundException(
        'Clinic not found',
      );
    }

    if (clinic.isActive) {
      throw new ConflictException(
        'Clinic is already active',
      );
    }

    return this.prisma.clinic.update({
      where: {
        id: clinicId,
      },
      data: {
        isActive: true,
      },
    });
  }
}