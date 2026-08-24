import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { DurationUnit } from "@prisma/client";

export class SaveVisitChiefComplaintDto {
  @IsString()
  chiefComplaintId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationValue?: number;

  @IsOptional()
  @IsEnum(DurationUnit)
  durationUnit?: DurationUnit;

  @IsOptional()
  @IsObject()
  answers?: Record<string, any>;
}