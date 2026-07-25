import { IsUUID } from "class-validator";

export class CompleteVisitDto {
  @IsUUID()
  visitId!: string;
}