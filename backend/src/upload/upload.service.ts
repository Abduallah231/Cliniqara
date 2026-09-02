import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { unlink, rename } from "fs/promises";
import { extname, join, normalize, relative } from "path";
import { PrismaService } from "../prisma/prisma.service";

export type UserImageType =
  | "national-id"
  | "medical-license";

@Injectable()
export class UploadService {
  private readonly uploadRoot = join(
    process.cwd(),
    "uploads",
  );

  private readonly pendingUserRoot = join(
    this.uploadRoot,
    "users",
    "pending",
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.ensureDirectory(
      this.pendingUserRoot,
    );
  }

  private ensureDirectory(directory: string) {
    if (!existsSync(directory)) {
      mkdirSync(directory, {
        recursive: true,
      });
    }
  }

  private getUserImageDirectory(
    type: UserImageType,
  ) {
    return join(
      this.pendingUserRoot,
      type,
    );
  }

  getPendingUserImageDirectory(
    type: UserImageType,
  ) {
    const directory =
      this.getUserImageDirectory(type);

    this.ensureDirectory(directory);

    return directory;
  }

  getInvestigationImageDirectory(
    visitId: string,
    investigationId: string,
  ) {
    const directory = join(
      this.uploadRoot,
      "visits",
      visitId,
      "investigations",
      investigationId,
    );

    this.ensureDirectory(directory);

    return directory;
  }

  async validateInvestigationOwnership(
    visitId: string,
    investigationId: string,
  ) {
    const investigation =
      await this.prisma.visitInvestigation.findFirst({
        where: {
          id: investigationId,
          visitId,
        },
        select: {
          id: true,
        },
      });

    if (!investigation) {
      throw new BadRequestException(
        "Investigation does not belong to this visit",
      );
    }

    return investigation;
  }

  buildUrl(
    relativePath: string,
  ) {
    return `/${relativePath
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")}`;
  }

  getPendingUserImageUrl(
    type: UserImageType,
    filename: string,
  ) {
    return this.buildUrl(
      join(
        "uploads",
        "users",
        "pending",
        type,
        filename,
      ),
    );
  }

  getInvestigationImageUrl(
    visitId: string,
    investigationId: string,
    filename: string,
  ) {
    return this.buildUrl(
      join(
        "uploads",
        "visits",
        visitId,
        "investigations",
        investigationId,
        filename,
      ),
    );
  }

  async movePendingUserImage(
    pendingUrl: string,
    userId: string,
    type: UserImageType,
  ) {
    const expectedPrefix =
      `/uploads/users/pending/${type}/`;

    if (!pendingUrl.startsWith(expectedPrefix)) {
      throw new BadRequestException(
        "Invalid uploaded image path",
      );
    }

    const filename =
      pendingUrl.slice(expectedPrefix.length);

    if (
      !filename ||
      filename.includes("/") ||
      filename.includes("\\") ||
      filename.includes("..")
    ) {
      throw new BadRequestException(
        "Invalid uploaded image",
      );
    }

    const sourcePath = join(
      this.pendingUserRoot,
      type,
      filename,
    );

    const destinationDirectory = join(
      this.uploadRoot,
      "users",
      userId,
      type,
    );

    this.ensureDirectory(
      destinationDirectory,
    );

    const destinationPath = join(
      destinationDirectory,
      filename,
    );

    const sourceRelative = relative(
      this.pendingUserRoot,
      sourcePath,
    );

    if (
      sourceRelative.startsWith("..") ||
      sourceRelative.includes("..")
    ) {
      throw new BadRequestException(
        "Invalid uploaded image path",
      );
    }

    try {
      await rename(
        sourcePath,
        destinationPath,
      );
    } catch {
      throw new InternalServerErrorException(
        "Failed to finalize uploaded image",
      );
    }

    return this.buildUrl(
      join(
        "uploads",
        "users",
        userId,
        type,
        filename,
      ),
    );
  }

  async deleteFileByUrl(url: string) {
    if (!url.startsWith("/uploads/")) {
      return;
    }

    const relativePath =
      url.replace(/^\/uploads\//, "");

    const filePath = normalize(
      join(
        this.uploadRoot,
        relativePath,
      ),
    );

    const relativeToRoot = relative(
      this.uploadRoot,
      filePath,
    );

    if (
      relativeToRoot.startsWith("..") ||
      relativeToRoot.includes("..")
    ) {
      return;
    }

    try {
      await unlink(filePath);
    } catch {
      // File may already be removed.
    }
  }
}