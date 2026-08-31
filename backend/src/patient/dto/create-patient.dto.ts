import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  // =========================
  // Identification
  // =========================

  @IsString()
  identifierType!: string;

  @ValidateIf(
    (o) =>
      o.identifierType !== 'UNKNOWN',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identifierNumber?: string;

  @ValidateIf(
    (o) =>
      o.identifierType === 'OTHER',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  documentType?: string;

  // =========================
  // Basic Information
  // =========================

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName!: string;

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue === undefined,
  )
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @ValidateIf(
    (o) => !o.dateOfBirth,
  )
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  estimatedAgeValue?: number;

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue !== undefined,
  )
  @IsString()
  estimatedAgeUnit?: string;

  @ValidateIf(
    (o) =>
      o.identifierType !== 'NATIONAL_ID',
  )
  @IsEnum(Gender)
  gender?: Gender;

  @IsString()
  maritalStatus!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  childrenCount?: number;

  // =========================
  // Contact
  // =========================

  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  // =========================
  // Occupation
  // =========================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  // =========================
  // Address
  // =========================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  streetAddress?: string;
}