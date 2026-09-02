import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { DrugService } from '../services/drug.service';
import { SearchDrugsDto } from '../dto/search-drugs.dto';

@Controller('drugs')
@UseGuards(JwtAuthGuard)
export class DrugController {
  constructor(
    private readonly drugService: DrugService,
  ) {}

  @Get('search')
  search(
    @Query() dto: SearchDrugsDto,
  ) {
    return this.drugService.search(
      dto.q,
      dto.page ?? 1,
      dto.limit ?? 20,
    );
  }

  @Get(':id')
  getById(
    @Param('id') id: string,
  ) {
    return this.drugService.getById(id);
  }
}