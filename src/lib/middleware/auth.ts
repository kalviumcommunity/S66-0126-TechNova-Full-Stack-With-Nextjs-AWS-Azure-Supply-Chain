import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, extractBearerToken } from '@/lib/jwt'
import { UnauthorizedError } from '@/lib/api-error'
import { handleApiError } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import type {
  AuthUser,
  AuthContext,
  OptionalAuthContext,
  AuthenticatedRouteHandler,
  OptionalAuthRouteHandler,
} from '@/types/auth'

/**
 * Authentication Middleware
 * Module 2.21 - JWT Authentication & User Context
 */

/**
 * Extract and verify JWT token from request
 * Fetches user from database and returns AuthUser object
 *
 * @param request - NextRequest object
 * @returns Authenticated user object
 * @throws UnauthorizedError if token is missing, invalid, or user not found
 */
async function getUserFromRequest(request: NextRequest): Promise<AuthUser> {
  // Extract Authorization header
  const authHeader = request.headers.get('Authorization')
  const token = extractBearerToken(authHeader)

  if (!token) {
    throw new UnauthorizedError('Authentication required')
  }

  // Verify JWT token
  const decoded = verifyAccessToken(token)

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new UnauthorizedError('User not found')
  }

  return user
}

/**
 * Authentication middleware wrapper
 * Verifies JWT token and attaches user to request context
 *
 * Usage:
 * ```typescript
 * export const GET = authenticate(async (request, { user }) => {
 *   return successResponse({ userId: user.id })
 * })
 * ```
 *
 * @param handler - Route handler that receives authenticated user
 * @returns Wrapped route handler with authentication
 */
export function authenticate(
  handler: AuthenticatedRouteHandler
): (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      // Get authenticated user
      const user = await getUserFromRequest(request)

      // Await params if provided (Next.js 15+ compatibility)
      const params = context?.params ? await context.params : undefined

      // Create auth context
      const authContext: AuthContext = {
        user,
        params,
      }

      // Call the actual handler with authenticated context
      return await handler(request, authContext)
    } catch (error) {
      // Handle authentication errors
      return handleApiError(error)
    }
  }
}

/**
 * Optional authentication middleware wrapper
 * Tries to authenticate but doesn't fail if token is missing/invalid
 * Useful for routes that work both authenticated and unauthenticated
 *
 * Usage:
 * ```typescript
 * export const GET = optionalAuth(async (request, { user }) => {
 *   if (user) {
 *     // Show personalized content
 *   } else {
 *     // Show public content
 *   }
 * })
 * ```
 *
 * @param handler - Route handler that receives optional user
 * @returns Wrapped route handler with optional authentication
 */
export function optionalAuth(
  handler: OptionalAuthRouteHandler
): (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      // Try to get authenticated user
      let user: AuthUser | null = null

      try {
        user = await getUserFromRequest(request)
      } catch {
        // Ignore authentication errors - user remains null
        user = null
      }

      // Await params if provided (Next.js 15+ compatibility)
      const params = context?.params ? await context.params : undefined

      // Create optional auth context
      const authContext: OptionalAuthContext = {
        user,
        params,
      }

      // Call the actual handler with optional auth context
      return await handler(request, authContext)
    } catch (error) {
      // Handle other errors (not authentication)
      return handleApiError(error)
    }
  }
}

/**
 * Extract user ID from authenticated request
 * Utility function for quick user ID access
 *
 * @param request - NextRequest with Authorization header
 * @returns User ID string
 * @throws UnauthorizedError if not authenticated
 */
export async function getUserId(request: NextRequest): Promise<string> {
  const user = await getUserFromRequest(request)
  return user.id
}

/**
 * Check if request is authenticated
 * Non-throwing version - returns boolean
 *
 * @param request - NextRequest object
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    await getUserFromRequest(request)
    return true
  } catch {
    return false
  }
}
