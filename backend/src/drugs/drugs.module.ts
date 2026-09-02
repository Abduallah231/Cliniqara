import { Module } from '@nestjs/common';

import { DrugController } from './controllers/drug.controller';
import { DrugService } from './services/drug.service';

@Module({
  controllers: [
    DrugController,
  ],

  providers: [
    DrugService,
  ],

  exports: [
    DrugService,
  ],
})
export class DrugsModule {}