import { Module } from '@nestjs/common';

import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';

@Module({
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}