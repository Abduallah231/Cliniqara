import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
  ) {}

  generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  }
}