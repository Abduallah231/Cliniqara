import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

export class CancelVisitDto {
  @IsUUID()
  visitId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}