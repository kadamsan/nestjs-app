import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let msg = null;

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      const { statusCode, error, message } = resp as Record<string, any>;
      msg = message;
    } else {
      msg = JSON.stringify(exception);
    }

    response.status(status).json({
      statusCode: status,
      msg: [].concat(msg),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
