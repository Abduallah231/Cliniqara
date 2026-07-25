import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateChiefComplaintDto } from "./dto/create-chief-complaint.dto";
import { UpdateChiefComplaintDto } from "./dto/update-chief-complaint.dto";

@Injectable()
export class ChiefComplaintsService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const complaint = await this.prisma.chiefComplaintMaster.findUnique({
      where: { id },
      include: {
        template: true,
      },
    });

    if (!complaint) {
      throw new NotFoundException("Chief complaint not found.");
    }

    return complaint;
  }

  async create(dto: CreateChiefComplaintDto) {
    const exists = await this.prisma.chiefComplaintMaster.findFirst({
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

  async update(id: string, dto: UpdateChiefComplaintDto) {
    await this.findOne(id);

    return this.prisma.chiefComplaintMaster.update({
      where: { id },
      data: dto,
    });
  }

  async getTemplate(id: string) {
    const complaint = await this.prisma.chiefComplaintMaster.findUnique({
      where: {
        id,
      },
      include: {
        template: true,
      },
    });

    if (!complaint) {
      throw new NotFoundException("Chief complaint not found.");
    }

    if (!complaint.template) {
      throw new NotFoundException(
        "Template not found for this chief complaint.",
      );
    }

    return complaint.template;
  }

}