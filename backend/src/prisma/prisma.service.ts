import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
  console.log('DATABASE_URL =', process.env.DATABASE_URL);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  super({
    adapter: new PrismaPg(pool),
  });
}

  async onModuleInit() {
    await this.$connect();
  }
}