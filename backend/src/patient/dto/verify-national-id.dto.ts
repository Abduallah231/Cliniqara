import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyNationalIdDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, {
    message: 'National ID must be exactly 14 digits.',
  })
  nationalId!: string;
}