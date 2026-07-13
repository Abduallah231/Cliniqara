import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClinicDto) {
    // هنكملها على الـ PC
    return dto;
  }
}