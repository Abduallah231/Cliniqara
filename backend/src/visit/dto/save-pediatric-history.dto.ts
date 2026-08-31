import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SavePediatricHistoryDto {
  @IsOptional()
  @IsString()
  antenatalCare?: string;

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
  @IsString()
  smokingExposure?: string;

  @IsOptional()
  @IsBoolean()
  alcoholExposure?: boolean;

  @IsOptional()
  @IsString()
  alcoholExposureDetails?: string;

  @IsOptional()
  @IsString()
  gestationalAge?: string;

  @IsOptional()
  @IsNumber()
  gestationalWeeks?: number;

  @IsOptional()
  @IsString()
  deliveryMode?: string;

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
  @IsString()
  development?: string;

  @IsOptional()
  @IsString()
  delayType?: string;

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
  @IsString()
  schoolPerformance?: string;

  @IsOptional()
  @IsString()
  schoolPerformanceDetails?: string;

  @IsOptional()
  @IsString()
  schoolAttendance?: string;

  @IsOptional()
  @IsString()
  schoolAttendanceReason?: string;
}