import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveGeneralInspectionDto {
  @IsOptional()
  @IsString()
  consciousness?: string;

  @IsOptional()
  @IsString()
  appearance?: string;

  @IsOptional()
  @IsString()
  hydration?: string;

  @IsOptional()
  @IsString()
  bodyBuild?: string;

  @IsOptional()
  @IsString()
  nourishment?: string;

  @IsArray()
  @IsString({ each: true })
  findings!: string[];

  @IsArray()
  @IsString({ each: true })
  edemaLocations!: string[];
}