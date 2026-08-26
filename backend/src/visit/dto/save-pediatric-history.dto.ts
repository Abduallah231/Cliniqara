import {
  AntenatalCare,
  DeliveryMode,
  DevelopmentStatus,
  DelayType,
  GestationalAge,
  SchoolAttendance,
  SchoolPerformance,
  SmokingExposure,
} from "@prisma/client";

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class SavePediatricHistoryDto {
  @IsOptional()
  @IsEnum(AntenatalCare)
  antenatalCare?: AntenatalCare;

  @IsOptional()
  @IsString()
  antenatalCareNotes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  maternalIllnesses?: string[];

  @IsOptional()
  @IsString()
  maternalIllnessOther?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pregnancyComplications?: string[];

  @IsOptional()
  @IsString()
  pregnancyComplicationsOther?: string;

  @IsOptional()
  @IsBoolean()
  drugIntake?: boolean;

  @IsOptional()
  @IsString()
  drugIntakeDetails?: string;

  @IsOptional()
  @IsEnum(SmokingExposure)
  smokingExposure?: SmokingExposure;

  @IsOptional()
  @IsBoolean()
  alcoholExposure?: boolean;

  @IsOptional()
  @IsString()
  alcoholExposureDetails?: string;

  @IsOptional()
  @IsEnum(GestationalAge)
  gestationalAge?: GestationalAge;

  @IsOptional()
  @IsNumber()
  gestationalWeeks?: number;

  @IsOptional()
  @IsEnum(DeliveryMode)
  deliveryMode?: DeliveryMode;

  @IsOptional()
  @IsNumber()
  birthWeight?: number;

  @IsOptional()
  @IsBoolean()
  nicuAdmission?: boolean;

  @IsOptional()
  @IsString()
  nicuReason?: string;

  @IsOptional()
  @IsNumber()
  nicuDuration?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  birthComplications?: string[];

  @IsOptional()
  @IsString()
  birthComplicationDetails?: string;

  @IsOptional()
  @IsBoolean()
  neonatalJaundice?: boolean;

  @IsOptional()
  @IsBoolean()
  phototherapy?: boolean;

  @IsOptional()
  @IsBoolean()
  exchangeTransfusion?: boolean;

  @IsOptional()
  @IsBoolean()
  neonatalSeizures?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feedingTypes?: string[];

  @IsOptional()
  @IsEnum(DevelopmentStatus)
  development?: DevelopmentStatus;

  @IsOptional()
  @IsEnum(DelayType)
  delayType?: DelayType;

  @IsOptional()
  @IsString()
  delayDetails?: string;

  @IsOptional()
  @IsBoolean()
  attendsSchool?: boolean;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsEnum(SchoolPerformance)
  schoolPerformance?: SchoolPerformance;

  @IsOptional()
  @IsString()
  schoolPerformanceDetails?: string;

  @IsOptional()
  @IsEnum(SchoolAttendance)
  schoolAttendance?: SchoolAttendance;

  @IsOptional()
  @IsString()
  schoolAttendanceReason?: string;
}