import { IsUUID } from "class-validator";

export class StartVisitDto {
  @IsUUID()
  visitId!: string;
}