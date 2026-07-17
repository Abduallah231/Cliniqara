import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
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

  @IsOptional()
  @IsString()
  @MaxLength(50)
  identifierNumber?: string;

  @IsString()
  @MaxLength(200)
  fullName!: string;

  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedAgeValue?: number;

  @IsOptional()
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