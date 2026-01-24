import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { serializeMongoData } from '../utils/serialization.util';

/**
 * Typed Request interface for Express
 */
interface TypedRequest {
  method?: string;
  url?: string;
}

/**
 * Global Response Interceptor
 * Transforms all successful responses into standard ApiResponse format
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<TypedRequest>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;

        // Serialize MongoDB data to fix _id buffer issue
        const serializedData = serializeMongoData(data);

        // Build standard response
        const standardResponse: ApiResponse<T> = {
          status: this.getStatusMessage(statusCode),
          code: statusCode,
          message: this.getMessage(statusCode, request),
          data: (serializedData ?? null) as T,
          timestamp: new Date().toISOString(),
          errors: null,
        };

        return standardResponse;
      }),
    );
  }

  /**
   * Get HTTP status message from status code
   */
  private getStatusMessage(statusCode: number): string {
    const statusMessages: Record<number, string> = {
      200: 'success',
      201: 'created',
      202: 'accepted',
      204: 'no_content',
      304: 'not_modified',
      400: 'bad_request',
      401: 'unauthorized',
      403: 'forbidden',
      404: 'not_found',
      409: 'conflict',
      422: 'unprocessable_entity',
      500: 'internal_server_error',
      503: 'service_unavailable',
    };

    return statusMessages[statusCode] || 'unknown';
  }

  /**
   * Get appropriate message based on status code and request method
   */
  private getMessage(statusCode: number, request: TypedRequest): string {
    const method = request?.method?.toUpperCase();

    // Success messages based on method and status
    if (statusCode === 200 || statusCode === 201) {
      const methodMessages: Record<string, string> = {
        GET: 'Resource retrieved successfully',
        POST: 'Resource created successfully',
        PUT: 'Resource updated successfully',
        PATCH: 'Resource updated successfully',
        DELETE: 'Resource deleted successfully',
      };

      return methodMessages[method ?? ''] || 'Request processed successfully';
    }

    if (statusCode === 204) {
      return 'Request processed successfully with no content';
    }

    return 'Request processed';
  }
}
