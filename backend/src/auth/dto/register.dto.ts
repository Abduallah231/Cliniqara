import { AccountType, DoctorLevel } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";

export class RegisterDto {
  @IsEnum(AccountType)
  accountType!: AccountType;
  @IsOptional()
  @IsEnum(DoctorLevel)
  doctorLevel?: DoctorLevel;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  fullName!: string;

  @IsEmail()
  email!: string;

  @Matches(/^[0-9]{10,15}$/)
  phone!: string;

  @Length(8, 100)
  password!: string;

  @IsOptional()
  @Matches(/^\d{14}$/)
  nationalId?: string;

  @IsOptional()
  @IsString()
  medicalLicenseNumber?: string;

  @IsOptional()
  @IsString()
  nationalIdImage?: string;

  @IsOptional()
  @IsString()
  medicalLicenseImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  professionalTitle?: string;
}