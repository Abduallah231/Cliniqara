import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateChiefComplaintDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}