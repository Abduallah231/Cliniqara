import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  generateAccessToken(): string {
    return '';
  }

  generateRefreshToken(): string {
    return '';
  }

  verifyAccessToken(): boolean {
    return true;
  }

  verifyRefreshToken(): boolean {
    return true;
  }
}