import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    let error: HttpException;

    switch (exception.code) {
      case 'P2002':
        const target = Array.isArray(exception.meta?.target)
            ? exception.meta.target.join(', ')
            : 'resource';

            console.log(exception.meta);
console.log(target);

        error = new ConflictException(
            `${target} already exists`,
        );
        break;

      case 'P2025':
        error = new HttpException(
          'Resource not found',
          HttpStatus.NOT_FOUND,
        );
        break;

      default:
        error = new HttpException(
          'Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    response
      .status(error.getStatus())
      .json(error.getResponse());
  }
}