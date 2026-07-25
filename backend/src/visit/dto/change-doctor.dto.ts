import { IsUUID } from "class-validator";

export class ChangeDoctorDto {
  @IsUUID()
 visitId!: string;

  @IsUUID()
 doctorId!: string;
}