import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SaveSocialHistoryDto {
  // =========================
  // Smoking
  // =========================

  @IsOptional()
  @IsString()
  smoking?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  cigarettesPerDay?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsSmoking?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsSinceQuitting?: number;

  // =========================
  // Alcohol
  // =========================

  @IsOptional()
  @IsString()
  alcohol?: string;

  @IsOptional()
  @IsString()
  alcoholFrequency?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsSinceStopping?: number;

  // =========================
  // Living Condition
  // =========================

  @IsOptional()
  @IsString()
  livingCondition?: string;

  @IsOptional()
  @IsString()
  livingConditionNotes?: string;

  // =========================
  // Substance Use
  // =========================

  @IsArray()
  @IsString({ each: true })
  substanceUse!: string[];

  @IsOptional()
  @IsString()
  substanceNotes?: string;

  // =========================
  // Physical Activity
  // =========================

  @IsOptional()
  @IsString()
  physicalActivity?: string;

  @IsOptional()
  @IsString()
  physicalActivityNotes?: string;

  // =========================
  // Sleep
  // =========================

  @IsOptional()
  @IsString()
  sleepDuration?: string;

  @IsOptional()
  @IsString()
  sleepNotes?: string;

  // =========================
  // Social Support
  // =========================

  @IsOptional()
  @IsString()
  socialSupport?: string;

  @IsOptional()
  @IsString()
  socialSupportNotes?: string;

  // =========================
  // Sexual History
  // =========================

  @IsOptional()
  @IsString()
  sexualHistory?: string;

  @IsOptional()
  @IsString()
  sexualHistoryNotes?: string;
}