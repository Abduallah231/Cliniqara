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
  @IsEnum(PatientIdentifierType)
  identifierType!: PatientIdentifierType;

  // id number

  @ValidateIf(
    (o) =>
      o.identifierType !==
      PatientIdentifierType.UNKNOWN,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identifierNumber?: string;

  // full name

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName!: string;

  // dateOfBirth

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue === undefined,
  )
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  // estimatedAgeValue

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

  // Gender

  @ValidateIf(
    (o) =>
      o.identifierType !==
      PatientIdentifierType.NATIONAL_ID,
  )
  @IsEnum(Gender)
  gender?: Gender;

  // MaritalStatus

  @IsEnum(MaritalStatus)
  maritalStatus!: MaritalStatus;

  // phone

  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  // occupation

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  // governorate

  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;

  // city

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  // district

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  // streetAddress

  @IsOptional()
  @IsString()
  @MaxLength(200)
  streetAddress?: string;
}