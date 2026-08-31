import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class RelatedSystemItemDto {
  @IsString()
  system!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(100)
  symptoms!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  otherFinding?: string | null;
}

export class SaveRelatedSystemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelatedSystemItemDto)
  @ArrayMaxSize(14)
  systems!: RelatedSystemItemDto[];
}