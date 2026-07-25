import { IsObject, IsString } from "class-validator";

export class SaveVisitChiefComplaintDto {
  @IsString()
  visitId!: string;

  @IsString()
  chiefComplaintId!: string;

  @IsObject()
  answers!: Record<string, any>;
}