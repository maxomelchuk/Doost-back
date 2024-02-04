import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let key = '';

    if (exception instanceof BadRequestException) {
      key = 'BAD_REQUEST_EXCEPTION';
      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof NotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
      key = 'NOT_FOUND_EXCEPTION';
    } else if (exception instanceof InternalServerErrorException) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      key = 'INTERNAL_SERVER_EXCEPTION';
    } else if (exception instanceof HttpException) {
      key = 'OTHER_HTTP_EXCEPTION';
      httpStatus = exception.getStatus();
    }
    console.log(exception);
    let exceptionContext = exception.getResponse();
    const responseBody = {
      error: exception.message,
      key: this.determineKey(exceptionContext, exception, key),
    };

    responseBody['stack'] = exception.stack;
    console.error(exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private determineKey(
    exceptionContext: any,
    exception: any,
    key: string,
  ): string {
    for (const k in exceptionContext.contexts) {
      key = exceptionContext.contexts[k].key;
      break;
    }
    if (exception.key) {
      key = exception.key;
    }
    return key;
  }
}
