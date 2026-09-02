import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { UploadService } from "./upload.service";

const uploadRoot = join(
  process.cwd(),
  "uploads",
);

const ensureDirectory = (
  directory: string,
) => {
  mkdirSync(directory, {
    recursive: true,
  });
};

const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      new BadRequestException(
        "Only images are allowed",
      ),
      false,
    );
  }

  cb(null, true);
};

const imageLimits = {
  fileSize: 5 * 1024 * 1024,
};

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) {}

  // =========================
  // National ID
  // =========================

  @Post("user/national-id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (
          req,
          file,
          cb,
        ) => {
          const directory = join(
            uploadRoot,
            "users",
            "pending",
            "national-id",
          );

          ensureDirectory(directory);

          cb(null, directory);
        },

        filename: (
          req,
          file,
          cb,
        ) => {
          cb(
            null,
            randomUUID() +
              extname(
                String(file.originalname),
              ),
          );
        },
      }),

      fileFilter: imageFileFilter,
      limits: imageLimits,
    }),
  )
  uploadNationalId(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        "National ID image is required",
      );
    }

    return {
      url:
        this.uploadService.getPendingUserImageUrl(
          "national-id",
          file.filename,
        ),
    };
  }

  // =========================
  // Medical License
  // =========================

  @Post("user/medical-license")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (
          req,
          file,
          cb,
        ) => {
          const directory = join(
            uploadRoot,
            "users",
            "pending",
            "medical-license",
          );

          ensureDirectory(directory);

          cb(null, directory);
        },

        filename: (
          req,
          file,
          cb,
        ) => {
          cb(
            null,
            randomUUID() +
              extname(
                String(file.originalname),
              ),
          );
        },
      }),

      fileFilter: imageFileFilter,
      limits: imageLimits,
    }),
  )
  uploadMedicalLicense(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        "Medical license image is required",
      );
    }

    return {
      url:
        this.uploadService.getPendingUserImageUrl(
          "medical-license",
          file.filename,
        ),
    };
  }

  // =========================
  // Investigation Result Image
  // =========================

  @Post(
    "visits/:visitId/investigations/:investigationId",
  )
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (
          req,
          file,
          cb,
        ) => {
          const visitId = String(
            req.params.visitId,
          );

          const investigationId =
            String(
              req.params.investigationId,
            );

          const directory = join(
            uploadRoot,
            "visits",
            visitId,
            "investigations",
            investigationId,
          );

          ensureDirectory(directory);

          cb(null, directory);
        },

        filename: (
          req,
          file,
          cb,
        ) => {
          cb(
            null,
            randomUUID() +
              extname(
                String(file.originalname),
              ),
          );
        },
      }),

      fileFilter: imageFileFilter,
      limits: imageLimits,
    }),
  )
  async uploadInvestigationImage(
    @Param("visitId")
    visitId: string,
    @Param("investigationId")
    investigationId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        "Investigation image is required",
      );
    }

    try {
      await this.uploadService.validateInvestigationOwnership(
        visitId,
        investigationId,
      );
    } catch (error) {
      await this.uploadService.deleteFileByUrl(
        this.uploadService.getInvestigationImageUrl(
          visitId,
          investigationId,
          file.filename,
        ),
      );

      throw error;
    }

    return {
      url:
        this.uploadService.getInvestigationImageUrl(
          visitId,
          investigationId,
          file.filename,
        ),
    };
  }
}