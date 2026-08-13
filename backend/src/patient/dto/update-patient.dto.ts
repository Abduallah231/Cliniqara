import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  AgeUnit,
  Gender,
  MaritalStatus,
  PatientIdentifierType,
} from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdatePatientDto {
  // =========================
  // Identification
  // =========================

  /**
   * Identifier type can normally be changed.
   *
   * IMPORTANT:
   * If the existing patient already has a
   * NATIONAL_ID, the service layer must
   * prevent changing it.
   */
  @IsOptional()
  @IsEnum(PatientIdentifierType)
  identifierType?: PatientIdentifierType;

  /**
   * Identifier number can be supplied when
   * changing/adding identification data.
   *
   * IMPORTANT:
   * The service layer must handle the actual
   * identifier securely and must never return
   * the raw identifier to the client.
   */
  @ValidateIf(
    (o) =>
      o.identifierType !== undefined &&
      o.identifierType !==
        PatientIdentifierType.UNKNOWN,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  identifierNumber?: string;

  @ValidateIf(
    (o) =>
      o.identifierType ===
      PatientIdentifierType.OTHER,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  documentType?: string;

  // =========================
  // Basic Information
  // =========================

  /**
   * Full name is freely editable.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName?: string;

  /**
   * Date of birth follows the same validation
   * rules as CreatePatientDto.
   *
   * The service layer must prevent changing
   * DOB when the patient has a verified
   * National ID.
   */
  @ValidateIf(
    (o) =>
      o.estimatedAgeValue === undefined,
  )
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  /**
   * Estimated age can be edited when the
   * patient is not locked by a verified
   * National ID.
   */
  @ValidateIf(
    (o) =>
      o.dateOfBirth === undefined,
  )
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedAgeValue?: number;

  @ValidateIf(
    (o) =>
      o.estimatedAgeValue !== undefined,
  )
  @IsEnum(AgeUnit)
  @IsOptional()
  estimatedAgeUnit?: AgeUnit;

  /**
   * Gender follows CreatePatientDto rules.
   *
   * If the patient has a verified National ID,
   * the service layer must reject changes.
   */
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  /**
   * Marital status is freely editable.
   */
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  childrenCount?: number;

  // =========================
  // Contact
  // =========================

  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  // =========================
  // Occupation
  // =========================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  // =========================
  // Address
  // =========================

  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  streetAddress?: string;
}