import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FamilyRelation } from '@prisma/client';

export class PatientFamilyHistoryDto {
  @IsEnum(FamilyRelation)
  relation!: FamilyRelation;

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