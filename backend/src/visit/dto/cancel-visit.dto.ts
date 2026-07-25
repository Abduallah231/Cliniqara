import {
  IsString,
  IsUUID,
} from "class-validator";

export class CancelVisitDto {
  @IsUUID()
  visitId!: string;

  @IsString()
  reason!: string;
}