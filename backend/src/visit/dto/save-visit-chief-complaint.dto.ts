import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class SaveVisitChiefComplaintDto {
  @IsString()
  chiefComplaintId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationValue?: number;

  @IsOptional()
  @IsString()
  durationUnit?: string;

  @IsOptional()
  @IsObject()
  answers?: Record<string, any>;
}