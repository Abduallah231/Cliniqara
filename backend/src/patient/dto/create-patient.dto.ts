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

import {
  AgeUnit,
  Gender,
  MaritalStatus,
  PatientIdentifierType,
} from '@prisma/client';

import { Type } from 'class-transformer';

export class CreatePatientDto {
  // =========================
  // Identification
  // =========================

  @IsEnum(PatientIdentifierType)
  identifierType!: PatientIdentifierType;

  @ValidateIf(
    (o) =>
      o.identifierType !==
      PatientIdentifierType.UNKNOWN,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identifierNumber?: string;

  @ValidateIf(
    (o) =>
      o.identifierType ===
      PatientIdentifierType.OTHER,
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
  @IsEnum(AgeUnit)
  estimatedAgeUnit?: AgeUnit;

  @ValidateIf(
    (o) =>
      o.identifierType !==
      PatientIdentifierType.NATIONAL_ID,
  )
  @IsEnum(Gender)
  gender?: Gender;

  @IsEnum(MaritalStatus)
  maritalStatus!: MaritalStatus;

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