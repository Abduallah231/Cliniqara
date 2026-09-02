import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class PrescriptionMedicationDto {
  @IsString()
  @IsNotEmpty()
  drugId!: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationValue?: number;

  @IsOptional()
  @IsString()
  durationUnit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class SavePrescriptionDto {
  @IsOptional()
  @IsString()
  advice?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  followUp?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionMedicationDto)
  medications!: PrescriptionMedicationDto[];
}