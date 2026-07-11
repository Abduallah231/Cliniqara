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

  @ValidateIf((o) => !o.isClosed)
  @IsString()
  @IsNotEmpty()
  startTime?: string;

  @ValidateIf((o) => !o.isClosed)
  @IsString()
  @IsNotEmpty()
  endTime?: string;

  @IsBoolean()
  isClosed!: boolean;
}