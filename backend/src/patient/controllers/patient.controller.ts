import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';

import { AccountType } from '@prisma/client';

import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { PatientService } from '../services/patient.service';

import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @Roles(AccountType.DOCTOR, AccountType.RECEPTION)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientService.create(
      user.id,
      clinicId,
      dto,
    );
  }

  @Get()
  @Roles(AccountType.DOCTOR, AccountType.RECEPTION)
  getAll(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
  ) {
    return this.patientService.getAll(
      user.id,
      clinicId,
    );
  }

  @Get('search')
  @Roles(AccountType.DOCTOR, AccountType.RECEPTION)
  search(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Query('q') query: string,
  ) {
    return this.patientService.search(
      user.id,
      clinicId,
      query,
    );
  }

  @Get(':id')
  @Roles(AccountType.DOCTOR, AccountType.RECEPTION)
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Param('id') id: string,
  ) {
    return this.patientService.getById(
      user.id,
      clinicId,
      id,
    );
  }

  @Roles(AccountType.DOCTOR)
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientService.update(
      user.id,
      clinicId,
      id,
      dto,
    );
  }

  @Roles(AccountType.DOCTOR)
  @Patch(':id/deactivate')
  deactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Param('id') id: string,
  ) {
    return this.patientService.deactivate(
      user.id,
      clinicId,
      id,
    );
  }

  @Roles(AccountType.DOCTOR)
  @Patch(':id/reactivate')
  reactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Param('id') id: string,
  ) {
    return this.patientService.reactivate(
      user.id,
      clinicId,
      id,
    );
  }
}