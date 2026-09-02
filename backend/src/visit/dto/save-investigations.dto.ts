import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvestigationStatus } from '@prisma/client';

export class InvestigationResultFieldDto {
  @IsString()
  fieldId!: string;

  @IsString()
  fieldLabel!: string;

  @IsOptional()
  value?: string | string[] | number | boolean | null;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class InvestigationImageDto {
  @IsString()
  fileUrl!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class InvestigationItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name!: string;

  @IsEnum(InvestigationStatus)
  status!: InvestigationStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvestigationResultFieldDto)
  result?: InvestigationResultFieldDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvestigationImageDto)
  images?: InvestigationImageDto[];
}

export class SaveInvestigationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvestigationItemDto)
  investigations!: InvestigationItemDto[];
}