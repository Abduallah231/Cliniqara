import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import express from "express";

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const uploadPath = join(
    process.cwd(),
    "uploads",
  );

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  app.use(
    "/uploads",
    express.static(uploadPath),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle("Cliniqara API")
    .setDescription("Backend API for Cliniqara")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    "api",
    app,
    document,
  );

  await app.listen(
    process.env.PORT ?? 3000,
    "0.0.0.0",
  );
}

bootstrap();
