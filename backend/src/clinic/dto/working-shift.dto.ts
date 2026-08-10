import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class WorkingShiftDto {
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}