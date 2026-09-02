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

export class UpdatePrescriptionTemplateMedicationDto {
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

export class UpdatePrescriptionTemplateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  folderId?: string | null;

  @IsOptional()
  @IsString()
  advice?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  followUp?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(
    () => UpdatePrescriptionTemplateMedicationDto,
  )
  medications?: UpdatePrescriptionTemplateMedicationDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}