import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SaveRelatedSystemsDto } from "./dto/save-related-systems.dto";
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
import { SavePediatricHistoryDto } from "./dto/save-pediatric-history.dto";
import { SaveMenstrualHistoryDto } from "./dto/save-menstrual-history.dto";
import { SaveVitalSignsDto } from "./dto/save-vital-signs.dto";
import { SaveGeneralInspectionDto } from "./dto/save-general-inspection.dto";
import { SaveRegionalExaminationDto } from "./dto/save-regional-examination.dto";
import { SaveSystemExaminationDto } from "./dto/save-system-examination.dto";
import { SaveDiagnosisDto } from "./dto/save-diagnosis.dto";
import { SaveInvestigationsDto } from "./dto/save-investigations.dto";
import { SaveProceduresDto } from "./dto/save-procedures.dto";
import { SaveReferralsDto } from "./dto/save-referrals.dto";
import { SavePrescriptionDto } from "./dto/save-prescription.dto";

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

  // =========================
  // Related System Symptoms
  // =========================

  @Put(":visitId/related-systems")
  async saveRelatedSystems(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveRelatedSystemsDto,
  ) {
    return this.visitService.saveRelatedSystems(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/related-systems")
  async getRelatedSystems(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getRelatedSystems(
      visitId,
      user.id,
    );
  }

  @Post(":visitId/pediatric-history")
  savePediatricHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SavePediatricHistoryDto,
  ) {
    return this.visitService.savePediatricHistory(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/pediatric-history")
  getPediatricHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getPediatricHistory(
      visitId,
      user.id,
    );
  }

  @Put(":visitId/menstrual-history")
  saveMenstrualHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveMenstrualHistoryDto,
  ) {
    return this.visitService.saveMenstrualHistory(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/menstrual-history")
  getMenstrualHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getMenstrualHistory(
      visitId,
      user.id,
    );
  }

  // =========================
  // Examination
  // =========================

  @Put(":visitId/vital-signs")
  saveVitalSigns(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveVitalSignsDto,
  ) {
    return this.visitService.saveVitalSigns(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/vital-signs")
  getVitalSigns(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getVitalSigns(
      visitId,
      user.id,
    );
  }

  @Put(":visitId/general-inspection")
  saveGeneralInspection(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveGeneralInspectionDto,
  ) {
    return this.visitService.saveGeneralInspection(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/general-inspection")
  getGeneralInspection(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getGeneralInspection(
      visitId,
      user.id,
    );
  }

  @Put(":visitId/regional-examination")
  saveRegionalExamination(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveRegionalExaminationDto,
  ) {
    return this.visitService.saveRegionalExamination(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/regional-examination")
  getRegionalExamination(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getRegionalExamination(
      visitId,
      user.id,
    );
  }

  @Put(":visitId/system-examination")
  saveSystemExamination(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveSystemExaminationDto,
  ) {
    return this.visitService.saveSystemExamination(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/system-examination")
  getSystemExamination(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getSystemExamination(
      visitId,
      user.id,
    );
  }

  // =========================
  // Assessment
  // =========================

  // Diagnosis
  @Put(":visitId/diagnosis")
  async saveDiagnosis(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveDiagnosisDto,
  ) {
    return this.visitService.saveDiagnosis(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/diagnosis")
  async getDiagnosis(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getDiagnosis(
      visitId,
      user.id,
    );
  }

  // Investigations
  @Put(":visitId/investigations")
  async saveInvestigations(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveInvestigationsDto,
  ) {
    return this.visitService.saveInvestigations(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/investigations")
  async getInvestigations(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getInvestigations(
      visitId,
      user.id,
    );
  }

  // Procedures
  @Put(":visitId/procedures")
  async saveProcedures(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveProceduresDto,
  ) {
    return this.visitService.saveProcedures(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/procedures")
  async getProcedures(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getProcedures(
      visitId,
      user.id,
    );
  }

  // Referrals
  @Put(":visitId/referrals")
  async saveReferrals(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SaveReferralsDto,
  ) {
    return this.visitService.saveReferrals(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/referrals")
  async getReferrals(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getReferrals(
      visitId,
      user.id,
    );
  }

  // Prescription
  @Put(":visitId/prescription")
  async savePrescription(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
    @Body() dto: SavePrescriptionDto,
  ) {
    return this.visitService.savePrescription(
      visitId,
      dto,
      user.id,
    );
  }

  @Get(":visitId/prescription")
  async getPrescription(
    @CurrentUser() user: AuthenticatedUser,
    @Param("visitId") visitId: string,
  ) {
    return this.visitService.getPrescription(
      visitId,
      user.id,
    );
  }
  
}
