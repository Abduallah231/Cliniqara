import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service'
@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly passwordService: PasswordService,
  private readonly jwtService: JwtService,
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

  const payload = {
    sub: user.id,
    accountType: user.accountType,
    doctorLevel: user.doctorLevel,
  };

  const accessToken = this.jwtService.generateAccessToken(payload);

  const refreshToken = this.jwtService.generateRefreshToken(payload);

  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    user,
  };
}
}
