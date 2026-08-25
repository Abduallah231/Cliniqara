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

export class SavePediatricHistoryDto {
  antenatalCare?: AntenatalCare;
  antenatalCareNotes?: string;

  maternalIllnesses?: string[];
  maternalIllnessOther?: string;

  pregnancyComplications?: string[];
  pregnancyComplicationsOther?: string;

  drugIntake?: boolean;
  drugIntakeDetails?: string;

  smokingExposure?: SmokingExposure;

  alcoholExposure?: boolean;
  alcoholExposureDetails?: string;

  gestationalAge?: GestationalAge;
  gestationalWeeks?: number;

  deliveryMode?: DeliveryMode;

  birthWeight?: number;

  nicuAdmission?: boolean;
  nicuReason?: string;
  nicuDuration?: number;

  birthComplications?: string[];
  birthComplicationDetails?: string;

  neonatalJaundice?: boolean;
  phototherapy?: boolean;
  exchangeTransfusion?: boolean;
  neonatalSeizures?: boolean;

  feedingTypes?: string[];

  development?: DevelopmentStatus;
  delayType?: DelayType;
  delayDetails?: string;

  attendsSchool?: boolean;
  grade?: string;
  schoolPerformance?: SchoolPerformance;
  schoolPerformanceDetails?: string;
  schoolAttendance?: SchoolAttendance;
  schoolAttendanceReason?: string;
}