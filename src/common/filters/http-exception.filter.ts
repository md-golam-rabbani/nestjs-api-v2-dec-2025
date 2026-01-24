import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ServerError } from '../interfaces/api-response.interface';

/**
 * Interface for HTTP exception response
 */
interface ExceptionResponseObject {
  message?: string | string[];
  error?: string;
  errors?: Array<{
    field?: string;
    property?: string;
    message?: string;
    constraints?: string | Record<string, string>;
    code?: string;
  }>;
}

/**
 * Global HTTP Exception Filter
 * Catches all HTTP exceptions and transforms them into standard ApiResponse format
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error information
    let errors: ServerError[] = [];
    let message = exception.message || 'An error occurred';

    // Handle validation errors
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as ExceptionResponseObject;

      // Handle class-validator errors
      if (responseObj.message && Array.isArray(responseObj.message)) {
        errors = this.transformValidationErrors(responseObj.message);
        message = 'Validation failed';
      } else if (responseObj.error) {
        message = responseObj.error;
      }

      // Handle additional error details
      if (responseObj.errors && Array.isArray(responseObj.errors)) {
        errors = responseObj.errors.map((err) => ({
          field: err.field || err.property,
          message: err.message || JSON.stringify(err.constraints),
          code: err.code,
        }));
      }
    }

    // If no specific errors, add the exception message
    if (errors.length === 0 && message) {
      errors.push({
        message: message,
      });
    }

    // Build standard error response
    const errorResponse: ApiResponse<null> = {
      status: this.getStatusMessage(status),
      code: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
      errors: errors,
    };

    // Log error for debugging (optional)
    // console.error({
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   method: request.method,
    //   error: errorResponse,
    // });

    response.status(status).json(errorResponse);
  }

  /**
   * Transform class-validator validation errors into ServerError format
   */
  private transformValidationErrors(messages: string[]): ServerError[] {
    return messages.map((msg) => {
      // Check if message matches format: "field message"
      const parts = msg.split(' ');
      if (parts.length > 1) {
        return {
          field: parts[0],
          message: parts.slice(1).join(' '),
        };
      }
      return {
        message: msg,
      };
    });
  }

  /**
   * Get HTTP status message from status code
   */
  private getStatusMessage(statusCode: number): string {
    const statusMessages: Record<number, string> = {
      400: 'bad_request',
      401: 'unauthorized',
      403: 'forbidden',
      404: 'not_found',
      409: 'conflict',
      422: 'unprocessable_entity',
      429: 'too_many_requests',
      500: 'internal_server_error',
      503: 'service_unavailable',
    };

    return statusMessages[statusCode] || 'error';
  }
}

/**
 * Global Exception Filter
 * Catches all unhandled exceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse<null> = {
      status: 'internal_server_error',
      code: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
      errors: [
        {
          message: message,
        },
      ],
    };

    response.status(status).json(errorResponse);
  }
}
