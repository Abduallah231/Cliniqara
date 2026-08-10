import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { WeekDay } from '@prisma/client';

export class WorkingDayDto {
  @IsEnum(WeekDay)
  day!: WeekDay;

  @ValidateIf(
    (o) => !o.isClosed && !o.is24Hours,
  )
  @IsString()
  @IsNotEmpty()
  startTime?: string;

  @ValidateIf(
    (o) => !o.isClosed && !o.is24Hours,
  )
  @IsString()
  @IsNotEmpty()
  endTime?: string;

  @IsBoolean()
  isClosed!: boolean;

  @IsBoolean()
  is24Hours!: boolean;
}