import { Module } from '@nestjs/common';

import { PrescriptionTemplateController } from './controllers/prescription-template.controller';
import { PrescriptionTemplateService } from './services/prescription-template.service';

@Module({
  controllers: [
    PrescriptionTemplateController,
  ],
  providers: [
    PrescriptionTemplateService,
  ],
})
export class PrescriptionTemplateModule {}