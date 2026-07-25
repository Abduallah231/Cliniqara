import { PrismaClient } from '@prisma/client';
import { chiefComplaints } from './seeds/chief-complaints';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  for (const complaint of chiefComplaints) {
    await prisma.chiefComplaintMaster.upsert({
      where: {
        code: complaint.code,
      },
      update: {
        name: complaint.name,
        isActive: true,
      },
      create: {
        code: complaint.code,
        name: complaint.name,
        isActive: true,
        template: {
          create: {
            version: complaint.version,
            template: complaint.template,
          },
        },
      },
    });
  }

  console.log('✅ Chief Complaints Seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });