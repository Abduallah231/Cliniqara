import {
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProcedureItemDto {
  @IsString()
  details!: string;
}

export class SaveProceduresDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedureItemDto)
  procedures!: ProcedureItemDto[];
}