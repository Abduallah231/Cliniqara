import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ChiefComplaintsService } from "./chief-complaints.service";
import { CreateChiefComplaintDto } from "./dto/create-chief-complaint.dto";
import { UpdateChiefComplaintDto } from "./dto/update-chief-complaint.dto";

@Controller("chief-complaints")
export class ChiefComplaintsController {
  constructor(
    private readonly chiefComplaintsService: ChiefComplaintsService,
  ) {}

  @Get()
  findAll(@Query("search") search?: string) {
    return this.chiefComplaintsService.findAll(search);
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