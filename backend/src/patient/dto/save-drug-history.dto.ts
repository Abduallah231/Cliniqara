import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PatientMedicationDto {
  @IsString()
  @IsNotEmpty()
  medicationName!: string;

  @IsOptional()
  @IsString()
  dose?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationValue?: number;

  @IsOptional()
  @IsString()
  durationUnit?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaveDrugHistoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientMedicationDto)
  medications!: PatientMedicationDto[];

  @IsOptional()
  @IsString()
  medicationCompliance?: string;

  @IsBoolean()
  selfMedication!: boolean;

  @IsOptional()
  @IsString()
  selfMedicationDetails?: string;

  @IsBoolean()
  takesSupplements!: boolean;

  @IsOptional()
  @IsString()
  supplementDetails?: string;
}