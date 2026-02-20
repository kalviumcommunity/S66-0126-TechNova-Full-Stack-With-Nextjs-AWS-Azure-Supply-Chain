import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import {
  ApiError,
  handlePrismaError,
  handleZodError,
  isOperationalError,
} from './api-error'
import {
  HTTP_STATUS,
  ERROR_CODES,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type PaginationMeta,
  type HttpStatusCode,
} from '@/types/api'

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: HttpStatusCode = HTTP_STATUS.OK
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  )
}

/**
 * Create a standardized paginated success response
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  message?: string
): NextResponse<ApiSuccessResponse<T[]>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination,
      ...(message && { message }),
    },
    { status: HTTP_STATUS.OK }
  )
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && details?.stack) {
    response.error.stack = details.stack as string
  }

  return NextResponse.json(response, { status: statusCode })
}

/**
 * Handle errors and return appropriate response
 * This is the main error handler used in try-catch blocks
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Log error for monitoring
  console.error('[API Error]', error)

  // Handle ApiError instances
  if (error instanceof ApiError) {
    return errorResponse(
      error.code,
      error.message,
      error.statusCode,
      error.details
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = handleZodError(error)
    return errorResponse(
      validationError.code,
      validationError.message,
      validationError.statusCode,
      validationError.details
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = handlePrismaError(error)
    return errorResponse(
      prismaError.code,
      prismaError.message,
      prismaError.statusCode,
      prismaError.details
    )
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    // Don't expose internal error details in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred'

    const details =
      process.env.NODE_ENV === 'development'
        ? {
            stack: error.stack,
            name: error.name,
          }
        : undefined

    return errorResponse(
      ERROR_CODES.SERVER_ERROR,
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details
    )
  }

  // Unknown error type
  return errorResponse(
    ERROR_CODES.SERVER_ERROR,
    'An unexpected error occurred',
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  )
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number
  limit: number
  skip: number
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

/**
 * Create a created response (201)
 */
export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, HTTP_STATUS.CREATED)
}

/**
 * Create a no content response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT })
}

/**
 * Async wrapper for route handlers
 * Automatically catches errors and returns proper error responses
 */
export function asyncHandler<T = any>(
  handler: (
    request: Request,
    context?: any
  ) => Promise<NextResponse<ApiSuccessResponse<T>>>
) {
  return async (
    request: Request,
    context?: any
  ): Promise<NextResponse<ApiSuccessResponse<T> | ApiErrorResponse>> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
