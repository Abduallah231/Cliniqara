import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { PatientService } from '../services/patient.service';

import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientService.create(
      user.id,
      dto,
    );
  }

  @Get()
  getAll(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.patientService.getAll(
      user.id,
    );
  }

  @Get(':id')
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.patientService.getById(
      user.id,
      id,
    );
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientService.update(
      user.id,
      id,
      dto,
    );
  }
}