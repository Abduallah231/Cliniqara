import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DrugService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async search(
    query: string,
    page = 1,
    limit = 20,
  ) {
    const q = query.trim();

    if (!q) {
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      OR: [
        {
          commercialNameEn: {
            contains: q,
            mode: 'insensitive' as const,
          },
        },
        {
          scientificName: {
            contains: q,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    const [total, drugs] =
      await this.prisma.$transaction([
        this.prisma.drug.count({
          where,
        }),

        this.prisma.drug.findMany({
          where,
          skip,
          take: limit,

          select: {
            id: true,
            commercialNameEn: true,
            commercialNameAr: true,
            scientificName: true,
            manufacturer: true,
            drugClass: true,
            route: true,
            priceEgp: true,
          },

          orderBy: {
            commercialNameEn: 'asc',
          },
        }),
      ]);

    return {
      data: drugs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async getById(id: string) {
    const drug =
      await this.prisma.drug.findFirst({
        where: {
          id,
          isActive: true,
        },

        select: {
          id: true,
          commercialNameEn: true,
          commercialNameAr: true,
          scientificName: true,
          manufacturer: true,
          drugClass: true,
          route: true,
          priceEgp: true,
        },
      });

    if (!drug) {
      throw new NotFoundException(
        'Drug not found',
      );
    }

    return drug;
  }

  async getActiveDrugOrThrow(
    drugId: string,
  ) {
    const drug =
      await this.prisma.drug.findFirst({
        where: {
          id: drugId,
          isActive: true,
        },

        select: {
          id: true,
          commercialNameEn: true,
          commercialNameAr: true,
          scientificName: true,
          manufacturer: true,
          drugClass: true,
          route: true,
          priceEgp: true,
        },
      });

    if (!drug) {
      throw new NotFoundException(
        'Drug not found or inactive',
      );
    }

    return drug;
  }
}