import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

import { PasswordService } from './password.service'
@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly passwordService: PasswordService,
) {}
  async register(dto: RegisterDto) {
  const existingUser = await this.prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (existingUser) {
    throw new ConflictException('Email already exists');
  }
  const passwordHash = await this.passwordService.hash(dto.password);
  const user = await this.prisma.user.create({
  data: {
    userCode: crypto.randomUUID(),

    accountType: dto.accountType,
    doctorLevel: dto.doctorLevel,

    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,

    passwordHash,
  },
});
  return user;
};
async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isPasswordValid = await this.passwordService.compare(
    dto.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  return {
    message: 'Login successful',
    user,
  };
}
}
