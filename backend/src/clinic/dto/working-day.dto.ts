import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDay } from '@prisma/client';

export class WorkingShiftDto {
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}

export class WorkingDayDto {
  @IsEnum(WeekDay)
  day!: WeekDay;

  @IsBoolean()
  isClosed!: boolean;

  @IsBoolean()
  is24Hours!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingShiftDto)
  shifts!: WorkingShiftDto[];
}