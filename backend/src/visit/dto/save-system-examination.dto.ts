import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested
} from 'class-validator';

export class DynamicFieldValueDto {
  @IsString()
  @MaxLength(100)
  fieldId!: string;

  @IsString()
  @MaxLength(200)
  fieldLabel!: string;

  @IsOptional()
  value?:
    | string
    | string[]
    | number
    | boolean
    | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;
}

export class SystemExaminationItemDto {
  @IsString()
  @MaxLength(100)
  system!: string;

  @IsObject()
  fields!: Record<string, unknown>;
}

export class SaveSystemExaminationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SystemExaminationItemDto)
  @ArrayMaxSize(20)
  systems!: SystemExaminationItemDto[];
}