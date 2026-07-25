import { IsUUID } from "class-validator";

export class GetVisitDto {
  @IsUUID()
 visitId!: string;
}