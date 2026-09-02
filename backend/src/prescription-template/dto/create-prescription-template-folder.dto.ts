import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePrescriptionTemplateFolderDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}