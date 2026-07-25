import { Module } from "@nestjs/common";
import { ChiefComplaintsController } from "./chief-complaints.controller";
import { ChiefComplaintsService } from "./chief-complaints.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ChiefComplaintsController],
  providers: [ChiefComplaintsService],
  exports: [ChiefComplaintsService],
})
export class ChiefComplaintsModule {}