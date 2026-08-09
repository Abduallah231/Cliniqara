import { IsNotEmpty, IsString } from 'class-validator';

export class JoinClinicDto {
  @IsString()
  @IsNotEmpty()
  joinCode!: string;
}