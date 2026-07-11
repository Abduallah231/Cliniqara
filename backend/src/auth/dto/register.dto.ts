import { AccountType, DoctorLevel } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class RegisterDto {
  @IsEnum(AccountType)
  accountType!: AccountType;
  @IsEnum(DoctorLevel)
  doctorLevel!: DoctorLevel;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}