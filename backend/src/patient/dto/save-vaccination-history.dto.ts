import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from "class-validator";

export class SaveVaccinationHistoryDto {
  @IsOptional()
  @IsString()
  vaccinationStatus?: string;

  @IsArray()
  @IsString({ each: true })
  missedVaccines!: string[];

  @IsOptional()
  @IsString()
  partialReason?: string;

  @IsOptional()
  @IsString()
  partialOtherDetails?: string;

  @IsOptional()
  @IsString()
  unvaccinatedReason?: string;

  @IsOptional()
  @IsString()
  unvaccinatedOtherDetails?: string;

  @IsOptional()
  @IsBoolean()
  previousReaction?: boolean;

  @IsOptional()
  @IsString()
  reactionSeverity?: string;

  @IsOptional()
  @IsString()
  reactionDetails?: string;
}