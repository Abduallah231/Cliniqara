import {
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateWaitingVisitDto {
  @IsUUID()
  patientId!: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}