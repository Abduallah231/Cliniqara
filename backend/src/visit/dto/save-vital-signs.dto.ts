import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SaveVitalSignsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  systolicBP?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  diastolicBP?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  heartRate?: number;

  @IsOptional()
  @IsString()
  pulseRhythm?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  respiratoryRate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  spo2?: number;

  @IsOptional()
  @IsString()
  oxygenSource?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsString()
  temperatureRoute?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  bloodGlucose?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bmi?: number;
}