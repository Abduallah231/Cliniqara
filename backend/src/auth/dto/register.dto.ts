import { AccountType, DoctorLevel } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsOptional } from 'class-validator';
export class RegisterDto {
  @IsEnum(AccountType)
  accountType!: AccountType;
  @IsOptional()
  @IsEnum(DoctorLevel)
  doctorLevel?: DoctorLevel;

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