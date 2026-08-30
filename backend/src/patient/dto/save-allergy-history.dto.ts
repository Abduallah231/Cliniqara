import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AllergySeverity,
  AllergyType,
} from '@prisma/client';

export class PatientAllergyDto {
  @IsEnum(AllergyType)
  type!: AllergyType;

  @IsString()
  @IsNotEmpty()
  allergen!: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsEnum(AllergySeverity)
  severity!: AllergySeverity;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaveAllergyHistoryDto {
  @IsBoolean()
  hasAllergy!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientAllergyDto)
  allergies!: PatientAllergyDto[];
}