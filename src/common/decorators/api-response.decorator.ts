import { SetMetadata, Type } from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Metadata key for API response customization
 */
export const API_RESPONSE_METADATA_KEY = 'api_response';
export const API_RESPONSE_TYPE_KEY = 'api_response_type';

/**
 * Interface for API response options
 */
export interface ApiResponseOptions {
  /**
   * Custom success message
   */
  message?: string;

  /**
   * Skip response transformation
   * When true, the response will not be wrapped in ApiResponse format
   */
  skipTransform?: boolean;

  /**
   * Custom status code
   */
  statusCode?: number;
}

/**
 * Decorator to customize API response behavior
 *
 * @example
 * `@ApiResponse({ message: 'Custom success message' })`
 *
 * @example
 * `@ApiResponse({ skipTransform: true })` - Skip response wrapping
 */
export const ApiResponseDecorator = (options?: ApiResponseOptions) =>
  SetMetadata(API_RESPONSE_METADATA_KEY, options || {});

/**
 * Type-safe decorator to specify the response data type
 * This enables proper TypeScript typing for controller methods
 *
 * @example
 * `@TypedResponse(UserResponseDto)`
 * `getUser(@Param('id') id: string): Promise<ApiResponse<UserResponseDto>>`
 *
 * @example
 * `@TypedResponse(UserResponseDto[])`
 * `getUsers(): Promise<ApiResponse<UserResponseDto[]>>`
 */
export const TypedResponse = <T = any>(dataType?: Type<T>) =>
  SetMetadata(API_RESPONSE_TYPE_KEY, dataType);

/**
 * Decorator to skip response transformation for specific endpoints
 * Useful for raw responses, file downloads, webhooks, etc.
 *
 * @example
 * `@SkipResponseTransform()`
 */
export const SkipResponseTransform = () =>
  SetMetadata(API_RESPONSE_METADATA_KEY, { skipTransform: true });
