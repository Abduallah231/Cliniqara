import {
  BleedingDuration,
  CycleRegularity,
  DysmenorrheaSeverity,
  MenstrualFlow,
  PainStart,
} from "@prisma/client";

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

export class SaveMenstrualHistoryDto {
  @IsOptional()
  @IsInt()
  ageAtMenarche?: number | null;

  @IsOptional()
  @IsEnum(CycleRegularity)
  cycleRegularity?: CycleRegularity | null;

  @IsOptional()
  @IsInt()
  cycleLength?: number | null;

  @IsOptional()
  @IsEnum(BleedingDuration)
  bleedingDuration?: BleedingDuration | null;

  @IsOptional()
  @IsEnum(MenstrualFlow)
  menstrualFlow?: MenstrualFlow | null;

  @IsOptional()
  @IsEnum(DysmenorrheaSeverity)
  dysmenorrhea?: DysmenorrheaSeverity | null;

  @IsOptional()
  @IsEnum(PainStart)
  painStarts?: PainStart | null;

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
