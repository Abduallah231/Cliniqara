import { IsObject, IsString } from "class-validator";

export class SaveVisitChiefComplaintDto {
  @IsString()
  chiefComplaintId!: string;

  @IsObject()
  answers!: Record<string, any>;
}