import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DifferentialDiagnosisDto {
  @IsString()
  code!: string;

  @IsString()
  diagnosis!: string;
}

export class SaveDiagnosisDto {
  @IsOptional()
  @IsString()
  primaryDiagnosisCode?: string;

  @IsOptional()
  @IsString()
  primaryDiagnosisName?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifferentialDiagnosisDto)
  differentialDiagnoses?: DifferentialDiagnosisDto[];
}