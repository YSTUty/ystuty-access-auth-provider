import {
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import * as rxjs from 'rxjs';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() !== 'http' && host.getType() !== 'rpc') {
      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const code = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const expResponse = exception.getResponse() as string | any;
    const { message } = exception;

    let errorName: string;
    let payload: any;
    let validation: any;
    if (typeof expResponse !== 'string') {
      payload = expResponse.payload;
      validation = expResponse.validation;
      errorName ??= expResponse.error;
    }
    errorName ??= exception.name;

    const error = {
      code,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      payload,
      validation,
    };

    if (host.getType() === 'rpc') {
      return rxjs.throwError(() => error);
    }

    response.status(code).json({ error });
  }
}
