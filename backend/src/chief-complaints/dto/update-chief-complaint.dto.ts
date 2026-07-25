import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateChiefComplaintDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}