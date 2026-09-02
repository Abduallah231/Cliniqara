import {
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReferralItemDto {
  @IsString()
  details!: string;
}

export class SaveReferralsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferralItemDto)
  referrals!: ReferralItemDto[];
}