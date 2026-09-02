import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePrescriptionTemplateFolderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  isActive?: boolean;
}