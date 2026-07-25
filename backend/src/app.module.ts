import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClinicModule } from './clinic/clinic.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientModule } from './patient/patient.module';
import { VisitModule } from "./visit/visit.module";
import { ChiefComplaintsModule } from './chief-complaints/chief-complaints.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}