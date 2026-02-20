import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { handleZodError } from '../api-error'
import { errorResponse } from '../api-response'
import { HTTP_STATUS } from '@/types/api'

/**
 * Validation middleware for Next.js API routes
 */

/**
 * Validates request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @param request - Next.js request object
 * @returns Validated data or throws ValidationError
 */
export async function validateBody<T>(
  schema: ZodSchema<T>,
  request: NextRequest
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw handleZodError(error)
    }
    throw error
  }
}

/**
 * Validates URL search params against a Zod schema
 * @param schema - Zod schema to validate against
 * @param request - Next.js request object
 * @returns Validated data or throws ValidationError
 */
export function validateSearchParams<T>(
  schema: ZodSchema<T>,
  request: NextRequest
): T {
  try {
    const searchParams = request.nextUrl.searchParams
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    return schema.parse(params)
  } catch (error) {
    if (error instanceof ZodError) {
      throw handleZodError(error)
    }
    throw error
  }
}

/**
 * Validates route parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @param params - Route params object
 * @returns Validated data or throws ValidationError
 */
export function validateParams<T>(
  schema: ZodSchema<T>,
  params: Record<string, string>
): T {
  try {
    return schema.parse(params)
  } catch (error) {
    if (error instanceof ZodError) {
      throw handleZodError(error)
    }
    throw error
  }
}

/**
 * Higher-order function to create validated API route handlers
 * Automatically validates request and handles errors
 */
export function withValidation<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
>(
  handler: (validated: {
    body?: TBody
    query?: TQuery
    params?: TParams
    request: NextRequest
  }) => Promise<NextResponse>,
  schemas?: {
    body?: ZodSchema<TBody>
    query?: ZodSchema<TQuery>
    params?: ZodSchema<TParams>
  }
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      const validated: {
        body?: TBody
        query?: TQuery
        params?: TParams
        request: NextRequest
      } = { request }

      // Validate body if schema provided
      if (schemas?.body) {
        validated.body = await validateBody(schemas.body, request)
      }

      // Validate query params if schema provided
      if (schemas?.query) {
        validated.query = validateSearchParams(schemas.query, request)
      }

      // Validate route params if schema provided
      if (schemas?.params && context?.params) {
        const resolvedParams = await context.params
        validated.params = validateParams(schemas.params, resolvedParams)
      }

      return await handler(validated)
    } catch (error) {
      // Return validation error response
      if (error instanceof ZodError) {
        const validationError = handleZodError(error)
        return errorResponse(
          validationError.code,
          validationError.message,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          validationError.details
        )
      }

      // Re-throw other errors to be handled by global error handler
      throw error
    }
  }
}

/**
 * Validates file upload from FormData
 * @param request - Next.js request object
 * @param fieldName - Name of the file field
 * @param options - Validation options
 * @returns File or throws ValidationError
 */
export async function validateFile(
  request: NextRequest,
  fieldName: string,
  options?: {
    maxSize?: number // in bytes
    allowedTypes?: string[] // MIME types
    required?: boolean
  }
): Promise<File | null> {
  const formData = await request.formData()
  const file = formData.get(fieldName) as File | null

  if (!file) {
    if (options?.required) {
      throw new Error(`File field '${fieldName}' is required`)
    }
    return null
  }

  // Validate file size
  if (options?.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2)
    throw new Error(`File size must not exceed ${maxSizeMB}MB`)
  }

  // Validate file type
  if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`
    )
  }

  return file
}

/**
 * Validates multiple files from FormData
 * @param request - Next.js request object
 * @param fieldName - Name of the files field
 * @param options - Validation options
 * @returns Array of files or throws ValidationError
 */
export async function validateFiles(
  request: NextRequest,
  fieldName: string,
  options?: {
    maxSize?: number // in bytes per file
    allowedTypes?: string[] // MIME types
    maxCount?: number
    minCount?: number
  }
): Promise<File[]> {
  const formData = await request.formData()
  const files = formData.getAll(fieldName) as File[]

  // Validate count
  if (options?.minCount && files.length < options.minCount) {
    throw new Error(`At least ${options.minCount} file(s) required`)
  }

  if (options?.maxCount && files.length > options.maxCount) {
    throw new Error(`Maximum ${options.maxCount} file(s) allowed`)
  }

  // Validate each file
  for (const file of files) {
    if (options?.maxSize && file.size > options.maxSize) {
      const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2)
      throw new Error(`Each file must not exceed ${maxSizeMB}MB`)
    }

    if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`
      )
    }
  }

  return files
}
