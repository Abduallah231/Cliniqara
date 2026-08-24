import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SelectClinicDto } from '../dto/select-clinic.dto';

import { AccountType } from '@prisma/client';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { ClinicService } from '../services/clinic.service';

import { CreateClinicDto } from '../dto/create-clinic.dto';
import { JoinClinicDto } from '../dto/join-clinic.dto';
import { TransferOwnershipDto } from '../dto/transfer-ownership.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';

@Controller('clinics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
  ) {}

  @Post()
  @Roles(AccountType.DOCTOR)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateClinicDto,
  ) {
    return this.clinicService.create(
      user.id,
      dto,
    );
  }

  @Get('me')
  getMyClinics(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clinicService.getMyClinics(
      user.id,
    );
  }

  @Patch('current')
  setCurrentClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Body('clinicId') clinicId: string,
  ) {
    return this.clinicService.setCurrentClinic(
      user.id,
      clinicId,
    );
  }

  @Patch('selected')
  selectClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SelectClinicDto,
  ) {
    return this.clinicService.selectClinic(
      user.id,
      dto.clinicId,
    );
  }

  @Post(':clinicId/join-code')
  @Roles(AccountType.DOCTOR)
  createJoinCode(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.createJoinCode(
      user.id,
      clinicId,
    );
  }

  @Patch(':clinicId')
  updateMyClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Body() dto: UpdateClinicDto,
  ) {
    return this.clinicService.updateMyClinic(
      user.id,
      clinicId,
      dto,
    );
  }

  @Post('join')
  joinClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: JoinClinicDto,
  ) {
    return this.clinicService.joinClinic(
      user.id,
      dto,
    );
  }

  @Get('my-membership-requests')
  getMyMembershipRequests(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clinicService.getMyMembershipRequests(
      user.id,
    );
  }

  @Get(':clinicId/membership-requests')
  @Roles(AccountType.DOCTOR)
  getMembershipRequests(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.getMembershipRequests(
      user.id,
      clinicId,
    );
  }

  @Patch(':clinicId/members/:membershipId/approve')
  @Roles(AccountType.DOCTOR)
  approveMembership(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.clinicService.approveMembership(
      user.id,
      clinicId,
      membershipId,
    );
  }

  @Patch(':clinicId/members/:membershipId/reject')
  @Roles(AccountType.DOCTOR)
  rejectMembership(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.clinicService.rejectMembership(
      user.id,
      clinicId,
      membershipId,
    );
  }

  @Get(':clinicId/members')
  getMembers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.getMembers(
      user.id,
      clinicId,
    );
  }

  @Patch(':clinicId/members/:membershipId/remove')
  @Roles(AccountType.DOCTOR)
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.clinicService.removeMember(
      user.id,
      clinicId,
      membershipId,
    );
  }

  @Patch(':clinicId/transfer-ownership')
  @Roles(AccountType.DOCTOR)
  transferOwnership(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
    @Body() dto: TransferOwnershipDto,
  ) {
    return this.clinicService.transferOwnership(
      user.id,
      clinicId,
      dto,
    );
  }

  @Patch(':clinicId/deactivate')
  @Roles(AccountType.DOCTOR)
  deactivateClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.deactivateClinic(
      user.id,
      clinicId,
    );
  }

  @Patch('members/:membershipId/leave')
  leaveClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Param('membershipId') membershipId: string,
  ) {
    return this.clinicService.leaveClinic(
      user.id,
      membershipId,
    );
  }

  @Patch(':clinicId/reactivate')
  @Roles(AccountType.DOCTOR)
  reactivateClinic(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clinicId') clinicId: string,
  ) {
    return this.clinicService.reactivateClinic(
      user.id,
      clinicId,
    );
  }

  @Get('selected')
  getSelectedClinic(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clinicService.getSelectedClinic(
      user.id,
    );
  }

}