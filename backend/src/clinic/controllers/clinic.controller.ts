import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { ClinicService } from '../services/clinic.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { AccountType } from '@prisma/client';
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
    return this.clinicService.create(user.id, dto);
  }
  @Get('me')
  getMyClinic(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clinicService.getMyClinic(user.id);
  }
  @Patch('me')
  updateMyClinic(
  @CurrentUser() user: AuthenticatedUser,
  @Body() dto: UpdateClinicDto,
) {
  return this.clinicService.updateMyClinic(
    user.id,
    dto,
  );
}
}