import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AccountType } from "@prisma/client";
import { CreateWaitingVisitDto } from "./dto/create-waiting-visit.dto";
import { VisitService } from "./visit.service";
import { StartVisitDto } from "./dto/start-visit.dto";
import { CompleteVisitDto } from "./dto/complete-visit.dto";
import { CancelVisitDto } from "./dto/cancel-visit.dto";
import { ChangeDoctorDto } from "./dto/change-doctor.dto";
import { GetVisitDto } from "./dto/get-visit.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";
import { SaveVisitChiefComplaintDto } from "./dto/save-visit-chief-complaint.dto";

@Controller("visits")
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
  ) {}

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
      @Body() dto: ChangeDoctorDto,
    ) {
      return this.visitService.changeDoctor(dto);
    }

    @Post("details")
  async getVisit(
    @Body() dto: GetVisitDto,
  ) {
    return this.visitService.getVisit(dto);
  }

  @Post(":visitId/chief-complaint")
  saveChiefComplaint(
    @Param("visitId") visitId: string,
    @Body() dto: SaveVisitChiefComplaintDto,
  ) {
    return this.visitService.saveChiefComplaint(
      visitId,
      dto,
    );
  }

  @Get(":visitId/chief-complaint/:chiefComplaintId")
  getChiefComplaint(
    @Param("visitId") visitId: string,
    @Param("chiefComplaintId") chiefComplaintId: string,
  ) {
    return this.visitService.getChiefComplaint(
      visitId,
      chiefComplaintId,
    );
  }
}