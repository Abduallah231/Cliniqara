import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  IsNotEmpty,
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

  @ValidateIf(
    (o) =>
      o.identifierType !==
      PatientIdentifierType.UNKNOWN,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identifierNumber?: string;

  @IsString()
  @MaxLength(200)
  fullName!: string;

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue === undefined,
  )
  @Type(() => Date)
  dateOfBirth?: Date;

  @ValidateIf(
    (o) => !o.dateOfBirth,
  )
  @IsInt()
  @Min(0)
  estimatedAgeValue?: number;

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue !== undefined,
  )
  @IsEnum(AgeUnit)
  estimatedAgeUnit?: AgeUnit;

  @IsEnum(Gender)
  gender!: Gender;

  @IsEnum(MaritalStatus)
  maritalStatus!: MaritalStatus;

  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

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