import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { CreateWaitingVisitDto } from "./dto/create-waiting-visit.dto";
import { StartVisitDto } from "./dto/start-visit.dto";
import { CompleteVisitDto } from "./dto/complete-visit.dto";
import { CancelVisitDto } from "./dto/cancel-visit.dto";
import { ChangeDoctorDto } from "./dto/change-doctor.dto";
import { GetVisitDto } from "./dto/get-visit.dto";
import { SaveVisitChiefComplaintDto } from "./dto/save-visit-chief-complaint.dto";

import { VisitService } from "./visit.service";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";

@Controller("visits")
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
  ) {}

  // =========================
  // Waiting Visit
  // =========================

  @Post("waiting")
  async createWaitingVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWaitingVisitDto,
  ) {
    return this.visitService.createWaitingVisit(
      dto,
      user.id,
      user.accountType,
    );
  }

  @Get("waiting")
  async getWaitingVisits(
    @CurrentUser() user: AuthenticatedUser,
    @Query("clinicId") clinicId: string,
  ) {
    return this.visitService.getWaitingVisits(
      clinicId,
      user.id,
    );
  }

  @Get("patient/:patientId/open")
  async getOpenPatientVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Param("patientId") patientId: string,
  ) {
    return this.visitService.getOpenPatientVisit(
      patientId,
      user.id,
    );
  }

  @Get("today/count")
  async getTodayVisitCount(
    @CurrentUser() user: AuthenticatedUser,
    @Query("clinicId") clinicId: string,
  ) {
    return this.visitService.getTodayVisitCount(
      clinicId,
      user.id,
    );
  }

  // =========================
  // Visit Lifecycle
  // =========================

  @Post("start")
  async startVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartVisitDto,
  ) {
    return this.visitService.startVisit(
      dto,
      user.id,
    );
  }

  @Post("complete")
  async completeVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CompleteVisitDto,
  ) {
    return this.visitService.completeVisit(
      dto,
      user.id,
    );
  }

  @Post("cancel")
  async cancelVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CancelVisitDto,
  ) {
    return this.visitService.cancelVisit(
      dto,
      user.id,
    );
  }

  @Post("change-doctor")
  async changeDoctor(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangeDoctorDto,
  ) {
    return this.visitService.changeDoctor(
      dto,
      user.id,
    );
  }

  // =========================
  // Visit Details
  // =========================

  @Post("details")
  async getVisit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GetVisitDto,
  ) {
    return this.visitService.getVisit(
      dto,
      user.id,
    );
  }

  // =========================
  // Chief Complaint
  // =========================

  @Post(":visitId/chief-complaint")
  async saveChiefComplaint(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveVisitChiefComplaintDto,
  ) {
    return this.visitService.saveChiefComplaint(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/chief-complaint/:chiefComplaintId")
  async getChiefComplaint(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Param("chiefComplaintId") chiefComplaintId: string,
  ) {
    return this.visitService.getChiefComplaint(
      visitId,
      chiefComplaintId,
      user.id,
    );
  }
}