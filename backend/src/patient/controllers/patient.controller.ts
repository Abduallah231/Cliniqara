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
  Put,
} from '@nestjs/common';
import { VerifyNationalIdDto } from '../dto/verify-national-id.dto';
import { AccountType } from '@prisma/client';

import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { PatientService } from '../services/patient.service';

import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { SaveVaccinationHistoryDto } from "../dto/save-vaccination-history.dto";
import { SavePastHistoryDto } from '../dto/save-past-history.dto';
import { SaveDrugHistoryDto } from '../dto/save-drug-history.dto';
import { SaveAllergyHistoryDto } from '../dto/save-allergy-history.dto';
import { SaveFamilyHistoryDto } from '../dto/save-family-history.dto';
import { SaveSocialHistoryDto } from '../dto/save-social-history.dto';

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

  @Post('verify-national-id')
  @Roles(AccountType.DOCTOR, AccountType.RECEPTION)
  verifyNationalId(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('x-clinic-id') clinicId: string,
    @Body() dto: VerifyNationalIdDto,
  ) {
    return this.patientService.verifyNationalId(
      user.id,
      clinicId,
      dto,
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

  @Put(':patientId/vaccination-history')
  @Roles(AccountType.DOCTOR)
  async saveVaccinationHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SaveVaccinationHistoryDto,
  ) {
    return this.patientService.saveVaccinationHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/vaccination-history')
  @Roles(AccountType.DOCTOR)
  async getVaccinationHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getVaccinationHistory(
      user.id,
      patientId,
    );
  }

  @Put(':patientId/past-history')
  @Roles(AccountType.DOCTOR)
  async savePastHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SavePastHistoryDto,
  ) {
    return this.patientService.savePastHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/past-history')
  @Roles(AccountType.DOCTOR)
  async getPastHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getPastHistory(
      user.id,
      patientId,
    );
  }

  // =========================
  // Drug History
  // =========================

  @Put(':patientId/drug-history')
  @Roles(AccountType.DOCTOR)
  async saveDrugHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SaveDrugHistoryDto,
  ) {
    return this.patientService.saveDrugHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/drug-history')
  @Roles(AccountType.DOCTOR)
  async getDrugHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getDrugHistory(
      user.id,
      patientId,
    );
  }

  // =========================
  // Allergy History
  // =========================

  @Put(':patientId/allergy-history')
  @Roles(AccountType.DOCTOR)
  async saveAllergyHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SaveAllergyHistoryDto,
  ) {
    return this.patientService.saveAllergyHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/allergy-history')
  @Roles(AccountType.DOCTOR)
  async getAllergyHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getAllergyHistory(
      user.id,
      patientId,
    );
  }

  // =========================
  // Family History
  // =========================

  @Put(':patientId/family-history')
  @Roles(AccountType.DOCTOR)
  async saveFamilyHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SaveFamilyHistoryDto,
  ) {
    return this.patientService.saveFamilyHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/family-history')
  @Roles(AccountType.DOCTOR)
  async getFamilyHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getFamilyHistory(
      user.id,
      patientId,
    );
  }

  // =========================
  // Social History
  // =========================

  @Put(':patientId/social-history')
  @Roles(AccountType.DOCTOR)
  async saveSocialHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
    @Body() dto: SaveSocialHistoryDto,
  ) {
    return this.patientService.saveSocialHistory(
      user.id,
      patientId,
      dto,
    );
  }

  @Get(':patientId/social-history')
  @Roles(AccountType.DOCTOR)
  async getSocialHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getSocialHistory(
      user.id,
      patientId,
    );
  }
}