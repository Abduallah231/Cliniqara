import { DoctorLevel } from "@prisma/client";
import {
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  doctorLevel?: DoctorLevel;
}