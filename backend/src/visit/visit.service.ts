import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AccountType,
  DoctorLevel,
  MembershipStatus,
  VisitStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CancelVisitDto } from './dto/cancel-visit.dto';
import { ChangeDoctorDto } from './dto/change-doctor.dto';
import { CompleteVisitDto } from './dto/complete-visit.dto';
import { CreateWaitingVisitDto } from './dto/create-waiting-visit.dto';
import { GetVisitDto } from './dto/get-visit.dto';
import { SaveVisitChiefComplaintDto } from './dto/save-visit-chief-complaint.dto';
import { StartVisitDto } from './dto/start-visit.dto';
import { SaveRelatedSystemsDto } from './dto/save-related-systems.dto';
import { SavePediatricHistoryDto } from './dto/save-pediatric-history.dto';
import { SaveMenstrualHistoryDto } from './dto/save-menstrual-history.dto';

@Injectable()
export class VisitService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async getActiveClinicId(
    currentUserId: string,
  ): Promise<string> {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          status: 'ACTIVE',
        },
        select: {
          clinicId: true,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of a clinic.',
      );
    }

    return membership.clinicId;
  }

  private async getVisitMembership(
    currentUserId: string,
    clinicId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    return membership;
  }

  private async getClinicalVisitAccess(
    currentUserId: string,
    clinicId: string,
    visitDoctorId: string | null,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId,
          status: 'ACTIVE',
        },
        include: {
          user: true,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    /*
     * Only a verified doctor can enter
     * the clinical visit.
     *
     * Interns and Reception accounts
     * are not allowed to enter the visit.
     */
    if (
      membership.user.accountType !==
      AccountType.DOCTOR
    ) {
      throw new BadRequestException(
        'You are not allowed to enter this visit.',
      );
    }

    if (
      membership.user.doctorLevel !==
      DoctorLevel.DOCTOR
    ) {
      throw new BadRequestException(
        'Only verified doctors can enter a clinical visit.',
      );
    }

    /*
     * A doctor can only access a visit
     * assigned to that doctor.
     */
    if (
      visitDoctorId !==
      currentUserId
    ) {
      throw new BadRequestException(
        'This visit is assigned to another doctor.',
      );
    }

    return membership;
  }

  async createWaitingVisit(
    dto: CreateWaitingVisitDto,
    currentUserId: string,
    accountType: AccountType,
  ) {
    const patient =
      await this.prisma.patient.findUnique({
        where: {
          id: dto.patientId,
        },
      });

    const clinicId =
      await this.getActiveClinicId(
        currentUserId,
      );

    if (!patient) {
      throw new NotFoundException(
        'Patient not found.',
      );
    }

    if (
      patient.clinicId !==
      clinicId
    ) {
      throw new NotFoundException(
        'Patient does not belong to this clinic.',
      );
    }

    const clinic =
      await this.prisma.clinic.findUnique({
        where: {
          id: clinicId,
        },
      });

    if (!clinic) {
      throw new NotFoundException(
        'Clinic not found.',
      );
    }

    let doctorId = dto.doctorId;

    if (
      accountType ===
      AccountType.DOCTOR
    ) {
      if (
        doctorId &&
        doctorId !== currentUserId
      ) {
        throw new BadRequestException(
          'A doctor can only add patients to their own waiting list.',
        );
      }

      doctorId =
        currentUserId;
    }

    if (
      accountType ===
        AccountType.RECEPTION &&
      !doctorId
    ) {
      throw new BadRequestException(
        'Doctor must be selected for waiting visit.',
      );
    }

    if (!doctorId) {
      throw new BadRequestException(
        'Doctor must be selected for waiting visit.',
      );
    }

    const doctorMembership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: doctorId,
          clinicId,
          status: 'ACTIVE',
        },
        include: {
          user: true,
        },
      });

    if (!doctorMembership) {
      throw new BadRequestException(
        'Selected doctor is not an active member of this clinic.',
      );
    }

    if (
      doctorMembership.user.accountType !==
      AccountType.DOCTOR
    ) {
      throw new BadRequestException(
        'Selected user is not a doctor.',
      );
    }

    const openVisit =
      await this.prisma.visit.findFirst({
        where: {
          patientId:
            dto.patientId,
          clinicId,
          visitStatus: {
            in: [
              VisitStatus.WAITING,
              VisitStatus.IN_PROGRESS,
            ],
          },
        },
      });

    if (openVisit) {
      throw new BadRequestException(
        'Patient already has an open visit.',
      );
    }

    console.log(
      'CREATE VISIT DEBUG',
      {
        patientId:
          dto.patientId,
        clinicId,
        currentUserId,
        patientClinicId:
          patient.clinicId,
      },
    );

    const visit =
      await this.prisma.$transaction(
        async (tx) => {
          const currentClinic =
            await tx.clinic.findUnique({
              where: {
                id: clinicId,
              },
            });

          if (!currentClinic) {
            throw new NotFoundException(
              'Clinic not found.',
            );
          }

          const visitNumber =
            currentClinic.nextVisitNumber;

          const visitCode =
            `VIS-${visitNumber
              .toString()
              .padStart(6, '0')}`;

          const newVisit =
            await tx.visit.create({
              data: {
                visitCode,
                patientId:
                  dto.patientId,
                clinicId,
                createdById:
                  currentUserId,
                doctorId:
                  doctorId!,
                visitStatus:
                  VisitStatus.WAITING,
                notes:
                  dto.notes,
              },
            });

          await tx.clinic.update({
            where: {
              id: clinicId,
            },
            data: {
              nextVisitNumber: {
                increment: 1,
              },
            },
          });

          return newVisit;
        },
      );

    return visit;
  }

  async startVisit(
    dto: StartVisitDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: dto.visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Completed visit cannot be started.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cancelled visit cannot be started.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Visit is already in progress.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.doctorId !==
      currentUserId
    ) {
      throw new BadRequestException(
        'You are not assigned to this visit.',
      );
    }

    const updatedVisit =
      await this.prisma.visit.update({
        where: {
          id: visit.id,
        },
        data: {
          visitStatus:
            VisitStatus.IN_PROGRESS,
          startedAt:
            new Date(),
        },
      });

    return updatedVisit;
  }

  async completeVisit(
    dto: CompleteVisitDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: dto.visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Visit is already completed.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cancelled visit cannot be completed.',
      );
    }

    if (
      visit.visitStatus !==
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Visit must be in progress before completion.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.doctorId !==
      currentUserId
    ) {
      throw new BadRequestException(
        'You are not assigned to this visit.',
      );
    }

    const updatedVisit =
      await this.prisma.visit.update({
        where: {
          id: visit.id,
        },
        data: {
          visitStatus:
            VisitStatus.COMPLETED,
          completedAt:
            new Date(),
        },
      });

    return updatedVisit;
  }

  async cancelVisit(
    dto: CancelVisitDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: dto.visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Completed visit cannot be cancelled.',
      );
    }

    if (
      visit.visitStatus ===
      VisitStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Visit is already cancelled.',
      );
    }

    const updatedVisit =
      await this.prisma.visit.update({
        where: {
          id: visit.id,
        },
        data: {
          visitStatus:
            VisitStatus.CANCELLED,
          cancelledAt:
            new Date(),
          cancellationReason:
            dto.reason,
        },
      });

    return updatedVisit;
  }

  async changeDoctor(
    dto: ChangeDoctorDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: dto.visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.getVisitMembership(
        currentUserId,
        visit.clinicId,
      );

    const canCancel =
      membership.clinicRole ===
        'OWNER' ||
      membership.clinicRole ===
        'RECEPTION' ||
      visit.doctorId ===
        currentUserId;

    if (!canCancel) {
      throw new BadRequestException(
        'You are not allowed to cancel this visit.',
      );
    }

    if (
      membership.clinicRole !==
        'OWNER' &&
      membership.clinicRole !==
        'RECEPTION'
    ) {
      throw new BadRequestException(
        'Only the clinic owner or assistant can change the assigned doctor.',
      );
    }

    if (
      visit.visitStatus !==
      VisitStatus.WAITING
    ) {
      throw new BadRequestException(
        'Doctor can only be changed while visit is waiting.',
      );
    }

    const doctorMembership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId:
            dto.doctorId,
          clinicId:
            visit.clinicId,
          status: 'ACTIVE',
        },
        include: {
          user: true,
        },
      });

    if (!doctorMembership) {
      throw new BadRequestException(
        'Selected doctor is not an active member of this clinic.',
      );
    }

    const doctor =
      doctorMembership.user;

    if (!doctor) {
      throw new NotFoundException(
        'Doctor not found.',
      );
    }

    if (
      doctor.accountType !==
      AccountType.DOCTOR
    ) {
      throw new BadRequestException(
        'Selected user is not a doctor.',
      );
    }

    return this.prisma.visit.update({
      where: {
        id: dto.visitId,
      },
      data: {
        doctorId:
          dto.doctorId,
      },
    });
  }

  async getWaitingVisits(
    clinicId: string,
    currentUserId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    return this.prisma.visit.findMany({
      where: {
        clinicId,
        visitStatus: {
          in: [
            VisitStatus.WAITING,
            VisitStatus.IN_PROGRESS,
          ],
        },
      },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getOpenPatientVisit(
    patientId: string,
    currentUserId: string,
  ) {
    const clinicId =
      await this.getActiveClinicId(
        currentUserId,
      );

    const visit =
      await this.prisma.visit.findFirst({
        where: {
          patientId,
          clinicId,
          visitStatus: {
            in: [
              VisitStatus.WAITING,
              VisitStatus.IN_PROGRESS,
            ],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return visit;
  }

  async getTodayVisitCount(
    clinicId: string,
    currentUserId: string,
  ): Promise<{ count: number }> {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    const now =
      new Date();

    const startOfDay =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

    const startOfNextDay =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

    const count =
      await this.prisma.visit.count({
        where: {
          clinicId,
          createdAt: {
            gte: startOfDay,
            lt: startOfNextDay,
          },
        },
      });

    return { count };
  }

  async getVisit(
    dto: GetVisitDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: dto.visitId,
        },
        include: {
          patient: true,
          doctor: true,
          clinic: true,

          chiefComplaint: {
            include: {
              chiefComplaint: true,
              analysis: true,
            },
          },

          relatedSystems: true,
          systematicReview: true,
          menstrualHistory: true,
          pediatricHistory: true,
          vitalSigns: true,
          generalInspection: true,
          regionalExaminations: true,
          systemExaminations: true,
          diagnosis: true,
          investigations: true,
          procedures: true,
          referrals: true,
          prescription: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    return visit;
  }

  async saveRelatedSystems(
    visitId: string,
    dto: SaveRelatedSystemsDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
        select: {
          id: true,
          clinicId: true,
          doctorId: true,
          visitStatus: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status:
            MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.visitStatus !==
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Related system symptoms can only be saved for an in-progress visit.',
      );
    }

    // Prevent duplicate systems inside
    // the same request.
    const systems =
      dto.systems.map(
        (item) =>
          item.system,
      );

    const uniqueSystems =
      new Set(systems);

    if (
      uniqueSystems.size !==
      systems.length
    ) {
      throw new BadRequestException(
        'Duplicate systems are not allowed.',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        // Replace the complete current state.
        await tx.visitRelatedSystem.deleteMany(
          {
            where: {
              visitId,
            },
          },
        );

        if (
          dto.systems.length ===
          0
        ) {
          return [];
        }

        await tx.visitRelatedSystem.createMany(
          {
            data: dto.systems.map(
              (item) => ({
                visitId,
                system:
                  item.system,
                symptoms:
                  item.symptoms,
                otherFinding:
                  item.otherFinding ??
                  null,
              }),
            ),
          },
        );

        return tx.visitRelatedSystem.findMany(
          {
            where: {
              visitId,
            },
            orderBy: {
              system: 'asc',
            },
          },
        );
      },
    );
  }

  async getRelatedSystems(
    visitId: string,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
        select: {
          id: true,
          clinicId: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status:
            MembershipStatus.ACTIVE,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    return this.prisma.visitRelatedSystem.findMany(
      {
        where: {
          visitId,
        },
        orderBy: {
          system: 'asc',
        },
      },
    );
  }

  async saveChiefComplaint(
    visitId: string,
    dto: SaveVisitChiefComplaintDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.visitStatus !==
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Chief complaint can only be saved for an in-progress visit.',
      );
    }

    const complaint =
      await this.prisma.chiefComplaintMaster.findUnique(
        {
          where: {
            id:
              dto.chiefComplaintId,
          },
          include: {
            template: true,
          },
        },
      );

    if (!complaint) {
      throw new NotFoundException(
        'Chief complaint not found.',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const existing =
          await tx.visitChiefComplaint.findUnique(
            {
              where: {
                visitId,
              },
            },
          );

        /*
         * If the selected complaint changed,
         * remove the old analysis first.
         */
        if (
          existing &&
          existing.chiefComplaintId !==
            dto.chiefComplaintId
        ) {
          await tx.visitComplaintAnalysis.deleteMany(
            {
              where: {
                visitChiefComplaintId:
                  existing.id,
              },
            },
          );
        }

        const chiefComplaint =
          await tx.visitChiefComplaint.upsert(
            {
              where: {
                visitId,
              },

              create: {
                visitId,

                chiefComplaintId:
                  dto.chiefComplaintId,

                durationValue:
                  dto.durationValue,

                durationUnit:
                  dto.durationUnit,
              },

              update: {
                chiefComplaintId:
                  dto.chiefComplaintId,

                ...(dto.durationValue !==
                  undefined && {
                  durationValue:
                    dto.durationValue,
                }),

                ...(dto.durationUnit !==
                  undefined && {
                  durationUnit:
                    dto.durationUnit,
                }),
              },
            },
          );

        /*
         * Analysis is saved only when answers
         * are actually supplied.
         */
        if (
          dto.answers !==
            undefined &&
          complaint.template
        ) {
          await tx.visitComplaintAnalysis.upsert(
            {
              where: {
                visitChiefComplaintId:
                  chiefComplaint.id,
              },

              create: {
                visitChiefComplaintId:
                  chiefComplaint.id,

                templateCode:
                  complaint.code,

                templateVersion:
                  complaint.template.version,

                values:
                  dto.answers,
              },

              update: {
                templateCode:
                  complaint.code,

                templateVersion:
                  complaint.template.version,

                values:
                  dto.answers,
              },
            },
          );
        }

        return tx.visitChiefComplaint.findUnique(
          {
            where: {
              id:
                chiefComplaint.id,
            },
            include: {
              chiefComplaint:
                true,
              analysis:
                true,
            },
          },
        );
      },
    );
  }

  async getChiefComplaint(
    visitId: string,
    chiefComplaintId: string,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId: currentUserId,
          clinicId:
            visit.clinicId,
          status: 'ACTIVE',
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'You are not an active member of this clinic.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    return this.prisma.visitChiefComplaint.findFirst(
      {
        where: {
          visitId,
          chiefComplaintId,
        },
        include: {
          chiefComplaint:
            true,
          analysis:
            true,
        },
      },
    );
  }

  async savePediatricHistory(
    visitId: string,
    dto: SavePediatricHistoryDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
        select: {
          id: true,
          clinicId: true,
          doctorId: true,
          visitStatus: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.visitStatus !==
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Pediatric history can only be saved for an in-progress visit.',
      );
    }

    return this.prisma.visitPediatricHistory.upsert(
      {
        where: {
          visitId,
        },

        create: {
          visitId,
          ...dto,
        },

        update: {
          ...dto,
        },
      },
    );
  }

  async getPediatricHistory(
    visitId: string,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
        select: {
          id: true,
          clinicId: true,
          doctorId: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    return this.prisma.visitPediatricHistory.findUnique(
      {
        where: {
          visitId,
        },
      },
    );
  }

  async saveMenstrualHistory(
    visitId: string,
    dto: SaveMenstrualHistoryDto,
    currentUserId: string,
  ) {
    const visit =
      await this.prisma.visit.findUnique({
        where: {
          id: visitId,
        },
        select: {
          id: true,
          clinicId: true,
          doctorId: true,
          visitStatus: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    if (
      visit.visitStatus !==
      VisitStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'Menstrual history can only be saved for an in-progress visit.',
      );
    }

    return this.prisma.visitMenstrualHistory.upsert(
      {
        where: {
          visitId,
        },

        create: {
          visitId,

          painRelievedBy: [],
          associatedSymptoms: [],
          pmsSymptoms: [],

          ...dto,
        },

        update: {
          ...dto,
        },
      },
    );
  }

  async getMenstrualHistory(
    visitId: string,
    currentUserId: string,
  ) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
      select: {
        id: true,
        clinicId: true,
        doctorId: true,
      },
    });

    if (!visit) {
      throw new NotFoundException("Visit not found.");
    }

    await this.getClinicalVisitAccess(
      currentUserId,
      visit.clinicId,
      visit.doctorId,
    );

    return this.prisma.visitMenstrualHistory.findUnique({
      where: { visitId },
    });
  }
}