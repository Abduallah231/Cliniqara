import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PatientAllergyDto {
  @IsString()
  type!: string;

  @IsString()
  @IsNotEmpty()
  allergen!: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsString()
  severity!: string;

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