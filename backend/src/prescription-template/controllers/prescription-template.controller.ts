import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AccountType } from '@prisma/client';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { PrescriptionTemplateService } from '../services/prescription-template.service';

import { CreatePrescriptionTemplateDto } from '../dto/create-prescription-template.dto';
import { UpdatePrescriptionTemplateDto } from '../dto/update-prescription-template.dto';
import { CreatePrescriptionTemplateFolderDto } from '../dto/create-prescription-template-folder.dto';
import { UpdatePrescriptionTemplateFolderDto } from '../dto/update-prescription-template-folder.dto';

@Controller('prescription-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionTemplateController {
  constructor(
    private readonly prescriptionTemplateService: PrescriptionTemplateService,
  ) {}

  // =========================================================
  // USER
  // =========================================================

  @Get('user')
  @Roles(AccountType.DOCTOR)
  getUserTemplates(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.prescriptionTemplateService.getUserTemplates(
      user.id,
    );
  }

  @Post('user')
  @Roles(AccountType.DOCTOR)
  createUserTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePrescriptionTemplateDto,
  ) {
    return this.prescriptionTemplateService.createUserTemplate(
      user.id,
      dto,
    );
  }

  @Get('user/folders')
  @Roles(AccountType.DOCTOR)
  getUserFolders(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.prescriptionTemplateService.getUserFolders(
      user.id,
    );
  }

  @Post('user/folders')
  @Roles(AccountType.DOCTOR)
  createUserFolder(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePrescriptionTemplateFolderDto,
  ) {
    return this.prescriptionTemplateService.createUserFolder(
      user.id,
      dto,
    );
  }

  // =========================================================
  // CLINIC
  // =========================================================

  @Get('clinic/:clinicId')
  @Roles(AccountType.DOCTOR)
  getClinicTemplates(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.prescriptionTemplateService.getClinicTemplates(
      user.id,
      clinicId,
    );
  }

  @Post('clinic/:clinicId')
  @Roles(AccountType.DOCTOR)
  createClinicTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Body() dto: CreatePrescriptionTemplateDto,
  ) {
    return this.prescriptionTemplateService.createClinicTemplate(
      user.id,
      clinicId,
      dto,
    );
  }

  @Get('clinic/:clinicId/folders')
  @Roles(AccountType.DOCTOR)
  getClinicFolders(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.prescriptionTemplateService.getClinicFolders(
      user.id,
      clinicId,
    );
  }

  @Post('clinic/:clinicId/folders')
  @Roles(AccountType.DOCTOR)
  createClinicFolder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Body() dto: CreatePrescriptionTemplateFolderDto,
  ) {
    return this.prescriptionTemplateService.createClinicFolder(
      user.id,
      clinicId,
      dto,
    );
  }

  // =========================================================
  // GLOBAL - READ ONLY
  // =========================================================

  @Get('global')
  getGlobalTemplates() {
    return this.prescriptionTemplateService.getGlobalTemplates();
  }

  @Get('global/folders')
  getGlobalFolders() {
    return this.prescriptionTemplateService.getGlobalFolders();
  }

  // =========================================================
  // SINGLE TEMPLATE
  // =========================================================

  @Get(':templateId')
  @Roles(AccountType.DOCTOR)
  getTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
  ) {
    return this.prescriptionTemplateService.getTemplate(
      user.id,
      templateId,
    );
  }

  @Patch(':templateId')
  @Roles(AccountType.DOCTOR)
  updateTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
    @Body() dto: UpdatePrescriptionTemplateDto,
  ) {
    return this.prescriptionTemplateService.updateTemplate(
      user.id,
      templateId,
      dto,
    );
  }

  @Delete(':templateId')
  @Roles(AccountType.DOCTOR)
  deactivateTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
  ) {
    return this.prescriptionTemplateService.deactivateTemplate(
      user.id,
      templateId,
    );
  }

  // =========================================================
  // FOLDERS
  // =========================================================

  @Patch('folders/:folderId')
  @Roles(AccountType.DOCTOR)
  updateFolder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('folderId') folderId: string,
    @Body() dto: UpdatePrescriptionTemplateFolderDto,
  ) {
    return this.prescriptionTemplateService.updateFolder(
      user.id,
      folderId,
      dto,
    );
  }

  @Delete('folders/:folderId')
  @Roles(AccountType.DOCTOR)
  deactivateFolder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('folderId') folderId: string,
  ) {
    return this.prescriptionTemplateService.deactivateFolder(
      user.id,
      folderId,
    );
  }
}