import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DurationUnit,
  MedicationCompliance,
} from '@prisma/client';

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
  @IsEnum(DurationUnit)
  durationUnit?: DurationUnit;

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
  @IsEnum(MedicationCompliance)
  medicationCompliance?: MedicationCompliance;

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