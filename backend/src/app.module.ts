import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClinicModule } from './clinic/clinic.module';
@Module({
  imports: [PrismaModule, ClinicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
