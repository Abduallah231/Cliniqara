import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { StatisticsService } from "./statistics.service";
import { ClinicStatistics } from "./types/statistics.types";

interface AuthenticatedRequest
  extends Request {
  user: {
    id: string;
  };
}

@Controller("clinics")
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get(":clinicId/statistics")
  async getClinicStatistics(
    @Param("clinicId") clinicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ClinicStatistics> {
    return this.statisticsService.getClinicStatistics(
      clinicId,
      req.user.id,
    );
  }
}