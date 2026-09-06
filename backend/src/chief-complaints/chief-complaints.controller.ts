import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChiefComplaintsService } from "./chief-complaints.service";

import { CreateChiefComplaintDto } from "./dto/create-chief-complaint.dto";
import { UpdateChiefComplaintDto } from "./dto/update-chief-complaint.dto";

@Controller("chief-complaints")
@UseGuards(JwtAuthGuard)
export class ChiefComplaintsController {
  constructor(
    private readonly chiefComplaintsService: ChiefComplaintsService,
  ) {}

  @Get()
  findAll(@Query("search") search?: string) {
    return this.chiefComplaintsService.findAll(search);
  }

  /*
   * Clinic-scoped list.
   *
   * Returns all active chief complaints ordered by
   * usage inside the requested clinic.
   *
   * The service verifies that the current user has
   * an active membership in this clinic.
   */
  @Get("clinic/:clinicId")
  findForClinic(
    @Req() req: any,
    @Param("clinicId") clinicId: string,
  ) {
    return this.chiefComplaintsService.findForClinic(
      req.user.id,
      clinicId,
    );
  }

  @Get(":id/template")
  getTemplate(@Param("id") id: string) {
    return this.chiefComplaintsService.getTemplate(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.chiefComplaintsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateChiefComplaintDto) {
    return this.chiefComplaintsService.create(dto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateChiefComplaintDto,
  ) {
    return this.chiefComplaintsService.update(id, dto);
  }
}