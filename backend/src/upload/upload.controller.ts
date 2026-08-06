import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { randomUUID } from "crypto";


@Controller("upload")
export class UploadController {
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(
            null,
            randomUUID() + extname(file.originalname),
          );
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          return cb(
            new BadRequestException("Only images are allowed"),
            false,
          );
        }

        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    
  ) {
    if (!file) {
      throw new BadRequestException(
        "Image is required",
      );
    }
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}