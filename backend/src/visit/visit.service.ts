import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AccountType, VisitStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CancelVisitDto } from "./dto/cancel-visit.dto";
import { ChangeDoctorDto } from "./dto/change-doctor.dto";
import { CompleteVisitDto } from "./dto/complete-visit.dto";
import { CreateWaitingVisitDto } from "./dto/create-waiting-visit.dto";
import { StartVisitDto } from "./dto/start-visit.dto";
import { GetVisitDto } from "./dto/get-visit.dto";
import { SaveVisitChiefComplaintDto } from "./dto/save-visit-chief-complaint.dto";

@Injectable()
export class VisitService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createWaitingVisit(
  dto: CreateWaitingVisitDto,
  currentUserId: string,
  accountType: AccountType,
) {
  const patient = await this.prisma.patient.findUnique({
    where: {
      id: dto.patientId,
    },
  });

  const membership =
    await this.prisma.clinicMember.findFirst({
      where: {
        userId: currentUserId,
        clinicId: dto.clinicId,
        status: "ACTIVE",
      },
    });

  if (!membership) {
    throw new NotFoundException(
      "You are not an active member of this clinic.",
    );
  }

  const clinicId = dto.clinicId;

  if (!patient) {
    throw new NotFoundException("Patient not found.");
  }

  const clinic = await this.prisma.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });

  if (!clinic) {
    throw new NotFoundException("Clinic not found.");
  }

  let doctorId = dto.doctorId;

  if (accountType === AccountType.DOCTOR) {
    doctorId = currentUserId;
  }

  if (accountType === AccountType.RECEPTION && !doctorId) {
    throw new BadRequestException(
      "Doctor must be selected for waiting visit.",
    );
  }

  if (!doctorId) {
    throw new BadRequestException(
      "Doctor must be selected for waiting visit.",
    );
  }

  const doctorMembership =
    await this.prisma.clinicMember.findFirst({
      where: {
        userId: doctorId,
        clinicId,
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

  if (!doctorMembership) {
    throw new BadRequestException(
      "Selected doctor is not an active member of this clinic.",
    );
  }

  if (
    doctorMembership.user.accountType !==
    AccountType.DOCTOR
  ) {
    throw new BadRequestException(
      "Selected user is not a doctor.",
    );
  }

  const openVisit = await this.prisma.visit.findFirst({
    where: {
      patientId: dto.patientId,
      clinicId: clinicId,
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
      "Patient already has an open visit.",
    );
  }

  const visit = await this.prisma.$transaction(async (tx) => {
  const currentClinic = await tx.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });

  if (!currentClinic) {
    throw new NotFoundException("Clinic not found.");
  }

  const visitNumber = currentClinic.nextVisitNumber;

  const visitCode = `VIS-${visitNumber
    .toString()
    .padStart(6, "0")}`;

    const newVisit = await tx.visit.create({
    data: {
      visitCode,
      patientId: dto.patientId,
      clinicId: clinicId,
      createdById: currentUserId,
      doctorId: doctorId!,
      visitStatus: VisitStatus.WAITING,
      notes: dto.notes,
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
});
return visit;
}
async startVisit(
  dto: StartVisitDto,
  currentUserId: string,
) {

  const visit = await this.prisma.visit.findUnique({
    where: {
      id: dto.visitId,
    },
  });

  if (!visit) {
    throw new NotFoundException("Visit not found.");
  }

  if (visit.visitStatus === VisitStatus.COMPLETED) {
    throw new BadRequestException(
      "Completed visit cannot be started.",
    );
  }

  if (visit.visitStatus === VisitStatus.CANCELLED) {
    throw new BadRequestException(
      "Cancelled visit cannot be started.",
    );
  }

  if (visit.visitStatus === VisitStatus.IN_PROGRESS) {
    throw new BadRequestException(
      "Visit is already in progress.",
    );
  }

  if (visit.doctorId !== currentUserId) {
    throw new BadRequestException(
      "You are not assigned to this visit.",
    );
  }

  const updatedVisit = await this.prisma.visit.update({
    where: {
      id: visit.id,
    },
    data: {
      visitStatus: VisitStatus.IN_PROGRESS,
      startedAt: new Date(),
    },
  });

  return updatedVisit;

  }

  async completeVisit(
    dto: CompleteVisitDto,
    currentUserId: string,
  ) {

    const visit = await this.prisma.visit.findUnique({
      where: {
        id: dto.visitId,
      },
    });

    if (!visit) {
      throw new NotFoundException("Visit not found.");
    }

    if (visit.visitStatus === VisitStatus.COMPLETED) {
      throw new BadRequestException(
        "Visit is already completed.",
      );
    }

    if (visit.visitStatus === VisitStatus.CANCELLED) {
      throw new BadRequestException(
        "Cancelled visit cannot be completed.",
      );
    }

    if (visit.visitStatus !== VisitStatus.IN_PROGRESS) {
      throw new BadRequestException(
        "Visit must be in progress before completion.",
      );
    }

    if (visit.doctorId !== currentUserId) {
      throw new BadRequestException(
        "You are not assigned to this visit.",
      );
    }

    const updatedVisit = await this.prisma.visit.update({
      where: {
        id: visit.id,
      },
      data: {
        visitStatus: VisitStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return updatedVisit;

  }

  async cancelVisit(
    dto: CancelVisitDto,
    currentUserId: string,
  ) {
    const visit = await this.prisma.visit.findUnique({
      where: {
        id: dto.visitId,
      },
    });

    if (!visit) {
      throw new NotFoundException("Visit not found.");
    }

    if (visit.visitStatus === VisitStatus.COMPLETED) {
      throw new BadRequestException(
        "Completed visit cannot be cancelled.",
      );
    }

    if (visit.visitStatus === VisitStatus.CANCELLED) {
      throw new BadRequestException(
        "Visit is already cancelled.",
      );
    }

    const updatedVisit = await this.prisma.visit.update({
      where: {
        id: visit.id,
      },
      data: {
        visitStatus: VisitStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
      },
    });

    return updatedVisit;
  }

  async changeDoctor(
    dto: ChangeDoctorDto,
  ) {
    const visit = await this.prisma.visit.findUnique({
      where: {
        id: dto.visitId,
      },
    });

    if (!visit) {
      throw new NotFoundException("Visit not found.");
    }

    if (visit.visitStatus !== VisitStatus.WAITING) {
      throw new BadRequestException(
        "Doctor can only be changed while visit is waiting.",
      );
    }

    const doctor = await this.prisma.user.findUnique({
      where: {
        id: dto.doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found.");
    }

    if (doctor.accountType !== AccountType.DOCTOR) {
      throw new BadRequestException(
        "Selected user is not a doctor.",
      );
    }

    return this.prisma.visit.update({
      where: {
        id: dto.visitId,
      },
      data: {
        doctorId: dto.doctorId,
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
          status: "ACTIVE",
        },
      });

    if (!membership) {
      throw new NotFoundException(
        "You are not an active member of this clinic.",
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
        createdAt: "asc",
      },
    });
  }

  async getVisit(
    dto: GetVisitDto,
  ) {
    const visit = await this.prisma.visit.findUnique({
      where: {
        id: dto.visitId,
      },
      include: {
        patient: true,
        doctor: true,
        clinic: true,
        chiefComplaint: true,
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
      throw new NotFoundException("Visit not found.");
    }

    return visit;
  }

  async saveChiefComplaint(
    visitId: string,
    dto: SaveVisitChiefComplaintDto,
  ) {
    return this.prisma.visitChiefComplaintAnswer.upsert({
      where: {
        visitId_chiefComplaintId: {
          visitId,
          chiefComplaintId: dto.chiefComplaintId,
        },
      },
      update: {
        answers: dto.answers,
      },
      create: {
        visitId,
        chiefComplaintId: dto.chiefComplaintId,
        answers: dto.answers,
      },
    });
  }

  async getChiefComplaint(
    visitId: string,
    chiefComplaintId: string,
  ) {
    return this.prisma.visitChiefComplaintAnswer.findUnique({
      where: {
        visitId_chiefComplaintId: {
          visitId,
          chiefComplaintId,
        },
      },
    });
  }

}