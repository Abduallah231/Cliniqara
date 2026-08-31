import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PatientFamilyHistoryDto {
  @IsString()
  relation!: string;

  @IsOptional()
  @IsString()
  otherRelation?: string;

  @IsArray()
  @IsString({ each: true })
  diseases!: string[];

  @IsBoolean()
  alive!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  ageAtDeath?: number;

  @IsOptional()
  @IsString()
  causeOfDeath?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaveFamilyHistoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientFamilyHistoryDto)
  familyHistory!: PatientFamilyHistoryDto[];
}