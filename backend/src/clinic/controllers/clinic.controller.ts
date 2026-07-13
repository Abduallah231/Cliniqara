import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { ClinicService } from '../services/clinic.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('clinics')
@UseGuards(JwtAuthGuard)
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
  ) {}

  @Post()
  @Roles('DOCTOR')
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
}