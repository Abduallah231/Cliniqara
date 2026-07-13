import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClinicService } from '../services/clinic.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('clinics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
  ) {}

  @Post()
  @Roles('DOCTOR')
  create(
    @Body() dto: CreateClinicDto,
  ) {
    return this.clinicService.create(dto);
  }
}