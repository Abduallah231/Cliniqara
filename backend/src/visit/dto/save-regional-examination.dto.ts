import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegionalExaminationItemDto {
  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsArray()
  @IsString({ each: true })
  findings!: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaveRegionalExaminationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegionalExaminationItemDto)
  regionalExaminations!: RegionalExaminationItemDto[];
}