import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountType,
  ClinicRole,
  MembershipStatus,
  PrescriptionTemplateScope,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreatePrescriptionTemplateDto } from '../dto/create-prescription-template.dto';
import { UpdatePrescriptionTemplateDto } from '../dto/update-prescription-template.dto';
import { CreatePrescriptionTemplateFolderDto } from '../dto/create-prescription-template-folder.dto';
import { UpdatePrescriptionTemplateFolderDto } from '../dto/update-prescription-template-folder.dto';

@Injectable()
export class PrescriptionTemplateService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // Helpers
  // =========================================================

  private async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        accountType: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  private async getActiveClinicMembership(
    userId: string,
    clinicId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          status: MembershipStatus.ACTIVE,
          clinic: {
            isActive: true,
          },
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Active clinic membership not found',
      );
    }

    return membership;
  }

  private async getClinicOwner(
    userId: string,
    clinicId: string,
  ) {
    const membership =
      await this.prisma.clinicMember.findFirst({
        where: {
          userId,
          clinicId,
          clinicRole: ClinicRole.OWNER,
          status: MembershipStatus.ACTIVE,
          clinic: {
            isActive: true,
          },
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Clinic owner access not found',
      );
    }

    return membership;
  }

  // =========================================================
  // Templates - User
  // =========================================================

  async getUserTemplates(userId: string) {
    await this.getUser(userId);

    return this.prisma.prescriptionTemplate.findMany({
      where: {
        scope: PrescriptionTemplateScope.USER,
        userId,
        isActive: true,
      },
      include: {
        folder: true,
        medications: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async createUserTemplate(
    userId: string,
    dto: CreatePrescriptionTemplateDto,
  ) {
    await this.getUser(userId);

    if (dto.folderId) {
      const folder =
        await this.prisma.prescriptionTemplateFolder.findFirst({
          where: {
            id: dto.folderId,
            scope: PrescriptionTemplateScope.USER,
            userId,
            isActive: true,
          },
        });

      if (!folder) {
        throw new NotFoundException(
          'User template folder not found',
        );
      }
    }

    return this.prisma.prescriptionTemplate.create({
      data: {
        title: dto.title,
        scope: PrescriptionTemplateScope.USER,
        userId,
        folderId: dto.folderId,
        advice: dto.advice,
        notes: dto.notes,
        followUp: dto.followUp,

        medications: {
          create: dto.medications.map(
            (medication, index) => ({
              medication:
                medication.medication,
              instructions:
                medication.instructions,
              durationValue:
                medication.durationValue,
              durationUnit:
                medication.durationUnit,
              sortOrder:
                medication.sortOrder ?? index,
            }),
          ),
        },
      },
      include: {
        folder: true,
        medications: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  // =========================================================
  // Templates - Clinic
  // =========================================================

  async getClinicTemplates(
    userId: string,
    clinicId: string,
  ) {
    await this.getActiveClinicMembership(
      userId,
      clinicId,
    );

    return this.prisma.prescriptionTemplate.findMany({
      where: {
        scope: PrescriptionTemplateScope.CLINIC,
        clinicId,
        isActive: true,
      },
      include: {
        folder: true,
        medications: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async createClinicTemplate(
    userId: string,
    clinicId: string,
    dto: CreatePrescriptionTemplateDto,
  ) {
    await this.getClinicOwner(
      userId,
      clinicId,
    );

    if (dto.folderId) {
      const folder =
        await this.prisma.prescriptionTemplateFolder.findFirst({
          where: {
            id: dto.folderId,
            scope: PrescriptionTemplateScope.CLINIC,
            clinicId,
            isActive: true,
          },
        });

      if (!folder) {
        throw new NotFoundException(
          'Clinic template folder not found',
        );
      }
    }

    return this.prisma.prescriptionTemplate.create({
      data: {
        title: dto.title,
        scope: PrescriptionTemplateScope.CLINIC,
        clinicId,
        folderId: dto.folderId,
        advice: dto.advice,
        notes: dto.notes,
        followUp: dto.followUp,

        medications: {
          create: dto.medications.map(
            (medication, index) => ({
              medication:
                medication.medication,
              instructions:
                medication.instructions,
              durationValue:
                medication.durationValue,
              durationUnit:
                medication.durationUnit,
              sortOrder:
                medication.sortOrder ?? index,
            }),
          ),
        },
      },
      include: {
        folder: true,
        medications: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  // =========================================================
  // Templates - Global
  // =========================================================

  async getGlobalTemplates() {
    return this.prisma.prescriptionTemplate.findMany({
      where: {
        scope: PrescriptionTemplateScope.GLOBAL,
        isActive: true,
      },
      include: {
        folder: true,
        medications: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // =========================================================
  // Get single template
  // =========================================================

  async getTemplate(
    userId: string,
    templateId: string,
  ) {
    const template =
      await this.prisma.prescriptionTemplate.findUnique({
        where: {
          id: templateId,
        },
        include: {
          folder: true,
          medications: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

    if (!template || !template.isActive) {
      throw new NotFoundException(
        'Prescription template not found',
      );
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.GLOBAL
    ) {
      return template;
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.USER
    ) {
      if (template.userId !== userId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }

      return template;
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.CLINIC
    ) {
      if (!template.clinicId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }

      await this.getActiveClinicMembership(
        userId,
        template.clinicId,
      );

      return template;
    }

    throw new NotFoundException(
      'Prescription template not found',
    );
  }

  // =========================================================
  // Update Template
  // =========================================================

  async updateTemplate(
    userId: string,
    templateId: string,
    dto: UpdatePrescriptionTemplateDto,
  ) {
    const template =
      await this.prisma.prescriptionTemplate.findUnique({
        where: {
          id: templateId,
        },
      });

    if (!template || !template.isActive) {
      throw new NotFoundException(
        'Prescription template not found',
      );
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.GLOBAL
    ) {
      throw new ConflictException(
        'Global templates cannot be modified through the API',
      );
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.USER
    ) {
      if (template.userId !== userId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }

      if (dto.folderId) {
        const folder =
          await this.prisma.prescriptionTemplateFolder.findFirst({
            where: {
              id: dto.folderId,
              scope: PrescriptionTemplateScope.USER,
              userId,
              isActive: true,
            },
          });

        if (!folder) {
          throw new NotFoundException(
            'User template folder not found',
          );
        }
      }
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.CLINIC
    ) {
      if (!template.clinicId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }

      await this.getClinicOwner(
        userId,
        template.clinicId,
      );

      if (dto.folderId) {
        const folder =
          await this.prisma.prescriptionTemplateFolder.findFirst({
            where: {
              id: dto.folderId,
              scope: PrescriptionTemplateScope.CLINIC,
              clinicId: template.clinicId,
              isActive: true,
            },
          });

        if (!folder) {
          throw new NotFoundException(
            'Clinic template folder not found',
          );
        }
      }
    }

    return this.prisma.$transaction(
      async (tx) => {
        if (dto.medications !== undefined) {
          await tx.prescriptionTemplateMedication.deleteMany(
            {
              where: {
                templateId,
              },
            },
          );
        }

        return tx.prescriptionTemplate.update({
          where: {
            id: templateId,
          },
          data: {
            ...(dto.title !== undefined && {
              title: dto.title,
            }),

            ...(dto.folderId !== undefined && {
              folderId: dto.folderId,
            }),

            ...(dto.advice !== undefined && {
              advice: dto.advice,
            }),

            ...(dto.notes !== undefined && {
              notes: dto.notes,
            }),

            ...(dto.followUp !== undefined && {
              followUp: dto.followUp,
            }),

            ...(dto.isActive !== undefined && {
              isActive: dto.isActive,
            }),

            ...(dto.medications !== undefined && {
              medications: {
                create: dto.medications.map(
                  (medication, index) => ({
                    medication:
                      medication.medication,
                    instructions:
                      medication.instructions,
                    durationValue:
                      medication.durationValue,
                    durationUnit:
                      medication.durationUnit,
                    sortOrder:
                      medication.sortOrder ??
                      index,
                  }),
                ),
              },
            }),
          },

          include: {
            folder: true,
            medications: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        });
      },
    );
  }

  // =========================================================
  // Deactivate Template
  // =========================================================

  async deactivateTemplate(
    userId: string,
    templateId: string,
  ) {
    const template =
      await this.prisma.prescriptionTemplate.findUnique({
        where: {
          id: templateId,
        },
      });

    if (!template || !template.isActive) {
      throw new NotFoundException(
        'Prescription template not found',
      );
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.GLOBAL
    ) {
      throw new ConflictException(
        'Global templates cannot be modified through the API',
      );
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.USER
    ) {
      if (template.userId !== userId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }
    }

    if (
      template.scope ===
      PrescriptionTemplateScope.CLINIC
    ) {
      if (!template.clinicId) {
        throw new NotFoundException(
          'Prescription template not found',
        );
      }

      await this.getClinicOwner(
        userId,
        template.clinicId,
      );
    }

    return this.prisma.prescriptionTemplate.update({
      where: {
        id: templateId,
      },
      data: {
        isActive: false,
      },
    });
  }

  // =========================================================
  // Folders - User
  // =========================================================

  async getUserFolders(userId: string) {
    await this.getUser(userId);

    return this.prisma.prescriptionTemplateFolder.findMany({
      where: {
        scope: PrescriptionTemplateScope.USER,
        userId,
        isActive: true,
      },
      include: {
        templates: {
          where: {
            isActive: true,
          },
          include: {
            medications: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createUserFolder(
    userId: string,
    dto: CreatePrescriptionTemplateFolderDto,
  ) {
    await this.getUser(userId);

    return this.prisma.prescriptionTemplateFolder.create({
      data: {
        name: dto.name,
        scope: PrescriptionTemplateScope.USER,
        userId,
      },
    });
  }

  // =========================================================
  // Folders - Clinic
  // =========================================================

  async getClinicFolders(
    userId: string,
    clinicId: string,
  ) {
    await this.getActiveClinicMembership(
      userId,
      clinicId,
    );

    return this.prisma.prescriptionTemplateFolder.findMany({
      where: {
        scope: PrescriptionTemplateScope.CLINIC,
        clinicId,
        isActive: true,
      },
      include: {
        templates: {
          where: {
            isActive: true,
          },
          include: {
            medications: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createClinicFolder(
    userId: string,
    clinicId: string,
    dto: CreatePrescriptionTemplateFolderDto,
  ) {
    await this.getClinicOwner(
      userId,
      clinicId,
    );

    return this.prisma.prescriptionTemplateFolder.create({
      data: {
        name: dto.name,
        scope: PrescriptionTemplateScope.CLINIC,
        clinicId,
      },
    });
  }

  // =========================================================
  // Folders - Global
  // =========================================================

  async getGlobalFolders() {
    return this.prisma.prescriptionTemplateFolder.findMany({
      where: {
        scope: PrescriptionTemplateScope.GLOBAL,
        isActive: true,
      },
      include: {
        templates: {
          where: {
            isActive: true,
          },
          include: {
            medications: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // =========================================================
  // Update Folder
  // =========================================================

  async updateFolder(
    userId: string,
    folderId: string,
    dto: UpdatePrescriptionTemplateFolderDto,
  ) {
    const folder =
      await this.prisma.prescriptionTemplateFolder.findUnique({
        where: {
          id: folderId,
        },
      });

    if (!folder || !folder.isActive) {
      throw new NotFoundException(
        'Prescription template folder not found',
      );
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.GLOBAL
    ) {
      throw new ConflictException(
        'Global folders cannot be modified through the API',
      );
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.USER
    ) {
      if (folder.userId !== userId) {
        throw new NotFoundException(
          'Prescription template folder not found',
        );
      }
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.CLINIC
    ) {
      if (!folder.clinicId) {
        throw new NotFoundException(
          'Prescription template folder not found',
        );
      }

      await this.getClinicOwner(
        userId,
        folder.clinicId,
      );
    }

    return this.prisma.prescriptionTemplateFolder.update({
      where: {
        id: folderId,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
    });
  }

  // =========================================================
  // Deactivate Folder
  // =========================================================

  async deactivateFolder(
    userId: string,
    folderId: string,
  ) {
    const folder =
      await this.prisma.prescriptionTemplateFolder.findUnique({
        where: {
          id: folderId,
        },
      });

    if (!folder || !folder.isActive) {
      throw new NotFoundException(
        'Prescription template folder not found',
      );
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.GLOBAL
    ) {
      throw new ConflictException(
        'Global folders cannot be modified through the API',
      );
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.USER
    ) {
      if (folder.userId !== userId) {
        throw new NotFoundException(
          'Prescription template folder not found',
        );
      }
    }

    if (
      folder.scope ===
      PrescriptionTemplateScope.CLINIC
    ) {
      if (!folder.clinicId) {
        throw new NotFoundException(
          'Prescription template folder not found',
        );
      }

      await this.getClinicOwner(
        userId,
        folder.clinicId,
      );
    }

    return this.prisma.prescriptionTemplateFolder.update({
      where: {
        id: folderId,
      },
      data: {
        isActive: false,
      },
    });
  }
}