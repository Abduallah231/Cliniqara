import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsInt()
  @Min(0)
  childrenCount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}