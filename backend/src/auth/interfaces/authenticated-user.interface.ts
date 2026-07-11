import { AccountType, DoctorLevel } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  accountType: AccountType;
  doctorLevel: DoctorLevel | null;
}