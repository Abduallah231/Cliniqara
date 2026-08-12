import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingDayDto } from './working-day.dto';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

    @IsOptional()
    @IsString()
    governorate?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    streetAddress?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingDayDto)
  workingDays!: WorkingDayDto[];
}