import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
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
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}