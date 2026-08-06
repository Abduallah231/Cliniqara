import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChiefComplaintsModule } from './chief-complaints/chief-complaints.module';
import { ClinicModule } from './clinic/clinic.module';
import { DoctorModule } from "./doctor/doctor.module";
import { PatientModule } from './patient/patient.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from "./upload/upload.module";
import { VisitModule } from "./visit/visit.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    ClinicModule,
    PatientModule,
    VisitModule,
    ChiefComplaintsModule,
    UploadModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}