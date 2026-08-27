import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChronicDiseaseDto {
  @IsString()
  diseaseCode!: string;

  @IsString()
  diseaseName!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class HospitalizationDto {
  @IsString()
  reason!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class OperationDto {
  @IsString()
  operationName!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  indication?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BloodTransfusionDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class MajorTraumaDto {
  @IsString()
  traumaType!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  complications?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ICUAdmissionDto {
  @IsString()
  reason!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  ventilatorSupport?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SavePastHistoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChronicDiseaseDto)
  chronicDiseases!: ChronicDiseaseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HospitalizationDto)
  hospitalizations!: HospitalizationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationDto)
  operations!: OperationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BloodTransfusionDto)
  bloodTransfusions!: BloodTransfusionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MajorTraumaDto)
  majorTraumas!: MajorTraumaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ICUAdmissionDto)
  icuAdmissions!: ICUAdmissionDto[];
}