import { Body, Controller, Post } from "@nestjs/common";
import { AccountType } from "@prisma/client";
import { CreateWaitingVisitDto } from "./dto/create-waiting-visit.dto";
import { VisitService } from "./visit.service";
import { StartVisitDto } from "./dto/start-visit.dto";
import { CompleteVisitDto } from "./dto/complete-visit.dto";
import { CancelVisitDto } from "./dto/cancel-visit.dto";
import { ChangeDoctorDto } from "./dto/change-doctor.dto";
import { GetVisitDto } from "./dto/get-visit.dto";

@Controller("visits")
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
  ) {}

  @Post("waiting")
  async createWaitingVisit(
    @Body() dto: CreateWaitingVisitDto,
  ) {
    return this.visitService.createWaitingVisit(
      dto,
      "CURRENT_USER_ID",
      AccountType.RECEPTION,
    );
  }

  @Post("start")
  async startVisit(
    @Body() dto: StartVisitDto,
  ) {
    return this.visitService.startVisit(
      dto,
      "CURRENT_USER_ID",
    );
  }

  @Post("complete")
  async completeVisit(
    @Body() dto: CompleteVisitDto,
  ) {
    return this.visitService.completeVisit(
      dto,
      "CURRENT_USER_ID",
    );
  }

  @Post("cancel")
  async cancelVisit(
    @Body() dto: CancelVisitDto,
        currentUserId: string,
  ) {
    return this.visitService.cancelVisit(
      dto,
      "CURRENT_USER_ID",
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

  
}