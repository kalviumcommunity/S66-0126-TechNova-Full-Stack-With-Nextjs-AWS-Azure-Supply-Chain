/**
 * API Response Types
 * Standard response formats for all API endpoints
 */

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Standard success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
  pagination?: PaginationMeta
}

/**
 * Validation error details
 */
export interface ValidationErrorDetails {
  [field: string]: string[]
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: ValidationErrorDetails | Record<string, unknown>
    stack?: string // Only in development
  }
}

/**
 * Generic API response (success or error)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Standard error codes
 */
export const ERROR_CODES = {
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business Logic Errors
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  SPOT_UNAVAILABLE: 'SPOT_UNAVAILABLE',
  SPOT_ALREADY_BOOKED: 'SPOT_ALREADY_BOOKED',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  BOOKING_NOT_CANCELLABLE: 'BOOKING_NOT_CANCELLABLE',

  // Payment Errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',

  // External Service Errors
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  SMS_SEND_FAILED: 'SMS_SEND_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',

  // System Errors
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
