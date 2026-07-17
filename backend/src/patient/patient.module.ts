import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    PatientController,
  ],
  providers: [
    PatientService,
  ],
  exports: [
    PatientService,
  ],
})
export class PatientModule {}