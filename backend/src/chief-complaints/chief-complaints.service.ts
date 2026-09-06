import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  MembershipStatus,
} from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { CreateChiefComplaintDto } from "./dto/create-chief-complaint.dto";
import { UpdateChiefComplaintDto } from "./dto/update-chief-complaint.dto";

@Injectable()
export class ChiefComplaintsService {
  constructor(private prisma: PrismaService) {}

  private async getActiveClinicMembership(
    userId: string,
    clinicId: string,
  ) {
    if (!clinicId?.trim()) {
      throw new BadRequestException(
        "Clinic ID is required.",
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
        "Clinic membership not found.",
      );
    }

    if (!membership.clinic.isActive) {
      throw new ConflictException(
        "Clinic is inactive.",
      );
    }

    return membership;
  }

  async findAll(search?: string) {
    return this.prisma.chiefComplaintMaster.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  code: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }

  async findForClinic(
    userId: string,
    clinicId: string,
  ) {
    const membership =
      await this.getActiveClinicMembership(
        userId,
        clinicId,
      );

    const complaints =
      await this.prisma.chiefComplaintMaster.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

    if (!complaints.length) {
      return [];
    }

    const usage =
      await this.prisma.visitChiefComplaint.groupBy({
        by: ["chiefComplaintId"],
        where: {
          visit: {
            clinicId: membership.clinicId,
            visitStatus: {
              not: "CANCELLED",
            },
          },
        },
        _count: {
          chiefComplaintId: true,
        },
      });

    const usageMap = new Map(
      usage.map((item) => [
        item.chiefComplaintId,
        item._count.chiefComplaintId,
      ]),
    );

    return complaints
      .map((complaint) => ({
        ...complaint,
        usageCount:
          usageMap.get(complaint.id) ?? 0,
      }))
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) {
          return b.usageCount - a.usageCount;
        }

        return a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: "base",
          },
        );
      });
  }

  async findOne(id: string) {
    const complaint =
      await this.prisma.chiefComplaintMaster.findUnique({
        where: { id },
        include: {
          template: true,
        },
      });

    if (!complaint) {
      throw new NotFoundException(
        "Chief complaint not found.",
      );
    }

    return complaint;
  }

  async create(
    dto: CreateChiefComplaintDto,
  ) {
    const exists =
      await this.prisma.chiefComplaintMaster.findFirst({
        where: {
          OR: [
            { code: dto.code },
            { name: dto.name },
          ],
        },
      });

    if (exists) {
      throw new BadRequestException(
        "Chief complaint already exists.",
      );
    }

    return this.prisma.chiefComplaintMaster.create({
      data: {
        code: dto.code,
        name: dto.name,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateChiefComplaintDto,
  ) {
    await this.findOne(id);

    return this.prisma.chiefComplaintMaster.update({
      where: { id },
      data: dto,
    });
  }

  async getTemplate(id: string) {
    const complaint =
      await this.prisma.chiefComplaintMaster.findUnique({
        where: {
          id,
        },
        include: {
          template: true,
        },
      });

    if (!complaint) {
      throw new NotFoundException(
        "Chief complaint not found.",
      );
    }

    if (!complaint.template) {
      throw new NotFoundException(
        "Template not found for this chief complaint.",
      );
    }

    return complaint.template;
  }
}