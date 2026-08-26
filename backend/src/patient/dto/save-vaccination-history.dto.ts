import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

import {
  ReactionSeverity,
  VaccinationReason,
  VaccinationStatus,
} from "@prisma/client";

export class SaveVaccinationHistoryDto {
  @IsOptional()
  @IsEnum(VaccinationStatus)
  vaccinationStatus?: VaccinationStatus;

  @IsArray()
  @IsString({ each: true })
  missedVaccines!: string[];

  @IsOptional()
  @IsEnum(VaccinationReason)
  partialReason?: VaccinationReason;

  @IsOptional()
  @IsString()
  partialOtherDetails?: string;

  @IsOptional()
  @IsEnum(VaccinationReason)
  unvaccinatedReason?: VaccinationReason;

  @IsOptional()
  @IsString()
  unvaccinatedOtherDetails?: string;

  @IsOptional()
  @IsBoolean()
  previousReaction?: boolean;

  @IsOptional()
  @IsEnum(ReactionSeverity)
  reactionSeverity?: ReactionSeverity;

  @IsOptional()
  @IsString()
  reactionDetails?: string;
}