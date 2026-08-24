import { IsUUID } from 'class-validator';

export class SelectClinicDto {
  @IsUUID()
  clinicId!: string;
}