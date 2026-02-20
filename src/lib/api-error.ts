import {
  ERROR_CODES,
  HTTP_STATUS,
  type ErrorCode,
  type HttpStatusCode,
  type ValidationErrorDetails,
} from '@/types/api'

/**
 * Custom API Error class
 * Provides structured error information for API responses
 */
export class ApiError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: HttpStatusCode
  public readonly details?: ValidationErrorDetails | Record<string, unknown>
  public readonly isOperational: boolean

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: ValidationErrorDetails | Record<string, unknown>,
    isOperational = true
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.isOperational = isOperational

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Convert error to JSON format
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

/**
 * Validation Error - 422 Unprocessable Entity
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: ValidationErrorDetails) {
    super(
      ERROR_CODES.VALIDATION_ERROR,
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details
    )
    this.name = 'ValidationError'
  }
}

/**
 * Authentication Error - 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(ERROR_CODES.UNAUTHORIZED, message, HTTP_STATUS.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Authorization Error - 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(ERROR_CODES.FORBIDDEN, message, HTTP_STATUS.FORBIDDEN)
    this.name = 'ForbiddenError'
  }
}

/**
 * Not Found Error - 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(ERROR_CODES.NOT_FOUND, `${resource} not found`, HTTP_STATUS.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error - 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ERROR_CODES.CONFLICT, message, HTTP_STATUS.CONFLICT, details)
    this.name = 'ConflictError'
  }
}

/**
 * Bad Request Error - 400 Bad Request
 */
export class BadRequestError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ERROR_CODES.INVALID_INPUT, message, HTTP_STATUS.BAD_REQUEST, details)
    this.name = 'BadRequestError'
  }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS
    )
    this.name = 'RateLimitError'
  }
}

/**
 * Database Error - 500 Internal Server Error
 */
export class DatabaseError extends ApiError {
  constructor(
    message: string = 'Database operation failed',
    originalError?: Error
  ) {
    super(
      ERROR_CODES.DATABASE_ERROR,
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      originalError ? { originalError: originalError.message } : undefined,
      false // Not operational - indicates system issue
    )
    this.name = 'DatabaseError'
  }
}

/**
 * Booking-specific errors
 */
export class BookingConflictError extends ApiError {
  constructor(
    message: string = 'Parking spot is already booked for this time range'
  ) {
    super(ERROR_CODES.BOOKING_CONFLICT, message, HTTP_STATUS.CONFLICT)
    this.name = 'BookingConflictError'
  }
}

export class SpotUnavailableError extends ApiError {
  constructor(message: string = 'Parking spot is not available') {
    super(ERROR_CODES.SPOT_UNAVAILABLE, message, HTTP_STATUS.CONFLICT)
    this.name = 'SpotUnavailableError'
  }
}

/**
 * Check if error is an operational error (expected, can be handled)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof ApiError) {
    return error.isOperational
  }
  return false
}

/**
 * Map common Prisma errors to ApiError
 */
export function handlePrismaError(error: any): ApiError {
  // Prisma unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field'
    return new ConflictError(`${field} already exists`, {
      field,
      constraint: 'unique',
    })
  }

  // Prisma record not found
  if (error.code === 'P2025') {
    return new NotFoundError('Record')
  }

  // Prisma foreign key constraint violation
  if (error.code === 'P2003') {
    return new BadRequestError('Invalid reference to related record', {
      constraint: 'foreign_key',
    })
  }

  // Prisma invalid data
  if (error.code === 'P2006' || error.code === 'P2007') {
    return new ValidationError('Invalid data provided', {
      prismaError: error.message,
    })
  }

  // Connection errors
  if (
    error.code === 'P1001' ||
    error.code === 'P1002' ||
    error.code === 'P1008'
  ) {
    return new DatabaseError('Unable to connect to database', error)
  }

  // Generic database error
  return new DatabaseError('Database operation failed', error)
}

/**
 * Map Zod validation errors to ValidationError
 */
export function handleZodError(error: any): ValidationError {
  const details: ValidationErrorDetails = {}

  if (error.errors) {
    error.errors.forEach((err: any) => {
      const path = err.path.join('.')
      if (!details[path]) {
        details[path] = []
      }
      details[path].push(err.message)
    })
  }

  return new ValidationError('Validation failed', details)
}
