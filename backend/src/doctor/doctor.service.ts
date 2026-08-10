import {
  BadRequestException,
  ConflictException, Injectable
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpgradeDoctorDto } from "./dto/upgrade-doctor.dto";

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        userCode: true,
        fullName: true,
        email: true,
        phone: true,
        accountType: true,
        doctorLevel: true,
        verificationStatus: true,
        nationalId: true,
        medicalLicenseNumber: true,
        nationalIdImage: true,
        medicalLicenseImage: true,
        specialty: true,
        professionalTitle: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new BadRequestException("User not found");
    }

    if (
      dto.phone &&
      dto.phone !== currentUser.phone
    ) {
      const phoneExists =
        await this.prisma.user.findUnique({
          where: {
            phone: dto.phone,
          },
        });

      if (phoneExists) {
        throw new ConflictException(
          "Phone already exists",
        );
      }
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        specialty: dto.specialty,
        professionalTitle: dto.professionalTitle,
      },
      select: {
        id: true,
        userCode: true,
        fullName: true,
        phone: true,
        accountType: true,
        doctorLevel: true,
        specialty: true,
        professionalTitle: true,
        verificationStatus: true,
      },
      
    });
  }

  async upgradeToDoctor(
    userId: string,
    dto: UpgradeDoctorDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.doctorLevel !== "INTERN") {
      throw new BadRequestException(
        "Only interns can request an upgrade",
      );
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        medicalLicenseNumber:
          dto.medicalLicenseNumber,
        medicalLicenseImage:
          dto.medicalLicenseImage,
        verificationStatus: "PENDING",
      },
    });
  }
}