import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
  ) {}

  generateAccessToken(payload: object) {
    return this.jwtService.sign(
      {
        ...payload,
        tokenType: 'ACCESS',
      },
      {
        expiresIn: '15m',
      },
    );
  }

  generateRefreshToken(payload: object) {
    return this.jwtService.sign(
      {
        ...payload,
        tokenType: 'REFRESH',
      },
      {
        expiresIn: '30d',
      },
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify<{
      sub: string;
      accountType: string;
      doctorLevel?: string | null;
      tokenType: string;
    }>(token);
  }
}