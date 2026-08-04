import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { AccountType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly passwordService: PasswordService,
  private readonly jwtService: JwtService,
) {}
  async register(dto: RegisterDto) {
    dto.email = dto.email.trim().toLowerCase();

    dto.phone = dto.phone.trim();

    dto.fullName = dto.fullName.trim();

    dto.nationalId = dto.nationalId?.trim();

    dto.medicalLicenseNumber = dto.medicalLicenseNumber?.trim();

    if (
      dto.accountType === AccountType.DOCTOR &&
      !dto.doctorLevel
    ) {
      throw new BadRequestException(
        'Doctor level is required',
      );
    }

    if (dto.accountType === AccountType.RECEPTION) {
      dto.doctorLevel = undefined;
    }

    if (
      dto.accountType === AccountType.DOCTOR &&
      dto.doctorLevel === "DOCTOR" &&
      !dto.medicalLicenseNumber
    ) {
      throw new BadRequestException(
        "Medical license number is required",
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (dto.nationalId) {
      const existingNationalId =
        await this.prisma.user.findFirst({
          where: {
            nationalId: dto.nationalId,
          },
        });

      if (existingNationalId) {
        throw new ConflictException(
          "National ID already exists",
        );
      }
    }

    if (dto.medicalLicenseNumber) {
      const existingLicense =
        await this.prisma.user.findFirst({
          where: {
            medicalLicenseNumber:
              dto.medicalLicenseNumber,
          },
        });

      if (existingLicense) {
        throw new ConflictException(
          "Medical license already exists",
        );
      }
    }

    if (existingPhone) {
      throw new ConflictException('Phone already exists');
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        userCode: crypto.randomUUID(),

        accountType: dto.accountType,
        doctorLevel: dto.doctorLevel,

        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,

        passwordHash: hashedPassword,

        nationalId: dto.nationalId,

        medicalLicenseNumber:
          dto.medicalLicenseNumber,

        nationalIdImage:
          dto.nationalIdImage,

        medicalCardImage:
          dto.medicalLicenseImage,
      },
    });
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

async login(dto: LoginDto) {
  dto.email = dto.email.trim().toLowerCase();
  const user = await this.prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedException('Account is inactive');
  }

  const isPasswordValid = await this.passwordService.compare(
    dto.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  await this.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  const payload = {
    sub: user.id,
    accountType: user.accountType,
    doctorLevel: user.doctorLevel,
  };

  const accessToken = this.jwtService.generateAccessToken(payload);

  const refreshToken = this.jwtService.generateRefreshToken(payload);

  const { passwordHash, ...safeUser } = user;

  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    user: safeUser,
  };
}
}
