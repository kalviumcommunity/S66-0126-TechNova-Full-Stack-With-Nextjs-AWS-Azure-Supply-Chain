import { NextRequest, NextResponse } from 'next/server'
import { ApiError, isOperationalError } from '@/lib/api-error'
import { errorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'
import { HTTP_STATUS, ERROR_CODES } from '@/types/api'

/**
 * Global Error Handling Middleware
 * Module 2.22 - Centralized Error Handling
 */

/**
 * Generate unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extract relevant request information for logging
 */
function getRequestInfo(request: NextRequest) {
  return {
    method: request.method,
    path: request.nextUrl.pathname,
    query: Object.fromEntries(request.nextUrl.searchParams),
    userAgent: request.headers.get('user-agent') || undefined,
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined,
  }
}

/**
 * Handle operational errors (expected errors that can be handled)
 */
function handleOperationalError(
  error: ApiError,
  requestId: string,
  requestInfo: ReturnType<typeof getRequestInfo>
): NextResponse {
  // Log warning for operational errors
  logger.warn(error.message, {
    requestId,
    errorCode: error.code,
    statusCode: error.statusCode,
    ...requestInfo,
  })

  // Return structured error response
  return errorResponse(error.code, error.message, error.statusCode, {
    ...error.details,
    requestId,
  })
}

/**
 * Handle non-operational errors (unexpected system errors)
 */
function handleNonOperationalError(
  error: Error,
  requestId: string,
  requestInfo: ReturnType<typeof getRequestInfo>
): NextResponse {
  // Log critical error
  logger.error('Unexpected server error', error, {
    requestId,
    ...requestInfo,
  })

  // Return generic error response (hide internal details in production)
  const isDevelopment = process.env.NODE_ENV === 'development'

  return errorResponse(
    ERROR_CODES.SERVER_ERROR,
    isDevelopment
      ? `Internal server error: ${error.message}`
      : 'An unexpected error occurred. Please try again later.',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isDevelopment
      ? {
          errorName: error.name,
          stack: error.stack,
          requestId,
        }
      : { requestId }
  )
}

/**
 * Global error handler wrapper
 * Wraps route handlers to catch and process errors
 *
 * Usage:
 * ```typescript
 * export const GET = withErrorHandler(async (request) => {
 *   // Your route logic
 * })
 * ```
 */
export function withErrorHandler(
  handler: (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
): (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const requestId = generateRequestId()
    const startTime = Date.now()
    const requestInfo = getRequestInfo(request)

    try {
      // Log incoming request
      logger.request(requestInfo.method, requestInfo.path, {
        requestId,
        query: requestInfo.query,
      })

      // Execute the handler
      const response = await handler(request, context)

      // Log successful response
      const duration = Date.now() - startTime
      logger.response(
        requestInfo.method,
        requestInfo.path,
        response.status,
        duration,
        { requestId }
      )

      // Add request ID to response headers for tracing
      response.headers.set('X-Request-ID', requestId)

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      // Handle different error types
      if (error instanceof ApiError) {
        const response = handleOperationalError(error, requestId, requestInfo)

        // Log error response
        logger.response(
          requestInfo.method,
          requestInfo.path,
          response.status,
          duration,
          { requestId, errorCode: error.code }
        )

        response.headers.set('X-Request-ID', requestId)
        return response
      }

      // Handle unexpected errors
      const response = handleNonOperationalError(
        error as Error,
        requestId,
        requestInfo
      )

      // Log error response
      logger.response(
        requestInfo.method,
        requestInfo.path,
        response.status,
        duration,
        { requestId, error: 'unexpected' }
      )

      response.headers.set('X-Request-ID', requestId)
      return response
    }
  }
}

/**
 * Async handler wrapper with error handling
 * Simplified version for async functions
 */
export async function handleAsync<T>(
  fn: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    logger.error(errorMessage, error as Error)
    throw new ApiError(
      ERROR_CODES.SERVER_ERROR,
      errorMessage,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Process unhandled rejections (for server-side)
 */
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Promise Rejection', reason, {
      promise: promise.toString(),
    })
  })

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error)

    // Give logger time to write, then exit
    if (!isOperationalError(error)) {
      setTimeout(() => {
        process.exit(1)
      }, 1000)
    }
  })
}
