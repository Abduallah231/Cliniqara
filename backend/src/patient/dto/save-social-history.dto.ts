import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  AlcoholFrequency,
  AlcoholStatus,
  LivingCondition,
  PhysicalActivityLevel,
  SleepDuration,
  SmokingStatus,
  SocialSupportLevel,
  SexualHistoryStatus,
} from '@prisma/client';

export class SaveSocialHistoryDto {
  // =========================
  // Smoking
  // =========================

  @IsOptional()
  @IsEnum(SmokingStatus)
  smoking?: SmokingStatus;

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
  @IsEnum(AlcoholStatus)
  alcohol?: AlcoholStatus;

  @IsOptional()
  @IsEnum(AlcoholFrequency)
  alcoholFrequency?: AlcoholFrequency;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsSinceStopping?: number;

  // =========================
  // Living Condition
  // =========================

  @IsOptional()
  @IsEnum(LivingCondition)
  livingCondition?: LivingCondition;

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
  @IsEnum(PhysicalActivityLevel)
  physicalActivity?: PhysicalActivityLevel;

  @IsOptional()
  @IsString()
  physicalActivityNotes?: string;

  // =========================
  // Sleep
  // =========================

  @IsOptional()
  @IsEnum(SleepDuration)
  sleepDuration?: SleepDuration;

  @IsOptional()
  @IsString()
  sleepNotes?: string;

  // =========================
  // Social Support
  // =========================

  @IsOptional()
  @IsEnum(SocialSupportLevel)
  socialSupport?: SocialSupportLevel;

  @IsOptional()
  @IsString()
  socialSupportNotes?: string;

  // =========================
  // Sexual History
  // =========================

  @IsOptional()
  @IsEnum(SexualHistoryStatus)
  sexualHistory?: SexualHistoryStatus;

  @IsOptional()
  @IsString()
  sexualHistoryNotes?: string;
}