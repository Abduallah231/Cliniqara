import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveMenstrualHistoryDto {
  @IsOptional()
  @IsInt()
  ageAtMenarche?: number | null;

  @IsOptional()
  @IsString()
  cycleRegularity?: string | null;

  @IsOptional()
  @IsInt()
  cycleLength?: number | null;

  @IsOptional()
  @IsString()
  bleedingDuration?: string | null;

  @IsOptional()
  @IsString()
  menstrualFlow?: string | null;

  @IsOptional()
  @IsString()
  dysmenorrhea?: string | null;

  @IsOptional()
  @IsString()
  painStarts?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  painRelievedBy?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedSymptoms?: string[];

  @IsOptional()
  @IsBoolean()
  intermenstrualBleeding?: boolean | null;

  @IsOptional()
  @IsBoolean()
  postcoitalBleeding?: boolean | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pmsSymptoms?: string[];

  @IsOptional()
  @IsString()
  lmp?: string | null;
}