import { AccountType, DoctorLevel } from '@prisma/client';
export interface JwtPayload {
  sub: string;
  accountType: AccountType;
  doctorLevel: DoctorLevel | null;
}