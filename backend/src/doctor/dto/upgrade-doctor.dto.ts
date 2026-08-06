import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class UpgradeDoctorDto {
  @IsString()
  @IsNotEmpty()
  medicalLicenseNumber!: string;

  @IsString()
  @IsNotEmpty()
  medicalLicenseImage!: string;
}