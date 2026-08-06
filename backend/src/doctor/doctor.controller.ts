import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Body, Put } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DoctorService } from "./doctor.service";
import { Post } from "@nestjs/common";
import { UpgradeDoctorDto } from "./dto/upgrade-doctor.dto";

@Controller("doctor")
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Get("profile")
  getProfile(@Req() req: any) {
    return this.doctorService.getProfile(
      req.user.id,
    );
  }

  @Put("profile")
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.doctorService.updateProfile(
      req.user.id,
      dto,
    );
  }

  @Post("upgrade")
  upgrade(
    @Req() req: any,
    @Body() dto: UpgradeDoctorDto,
  ) {
    return this.doctorService.upgradeToDoctor(
      req.user.id,
      dto,
    );
  }
  }