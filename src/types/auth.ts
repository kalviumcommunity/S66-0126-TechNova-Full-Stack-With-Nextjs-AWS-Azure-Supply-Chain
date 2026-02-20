import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

/**
 * Authentication and Authorization Type Definitions
 * Module 2.21 - Authorization Middleware
 */

// Re-export UserRole from Prisma for convenience
export { UserRole }

/**
 * Authenticated user object
 * Contains essential user information from JWT + database
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Authentication context passed to route handlers
 * Contains the authenticated user and request metadata
 */
export interface AuthContext {
  user: AuthUser
  params?: Record<string, string>
}

/**
 * Optional authentication context (for routes that support both auth and non-auth)
 */
export interface OptionalAuthContext {
  user: AuthUser | null
  params?: Record<string, string>
}

/**
 * Authenticated route handler
 * Receives NextRequest and AuthContext, returns NextResponse or Promise<NextResponse>
 */
export type AuthenticatedRouteHandler = (
  request: NextRequest,
  context: AuthContext
) => NextResponse | Promise<NextResponse>

/**
 * Optional auth route handler
 * Receives NextRequest and OptionalAuthContext, returns NextResponse or Promise<NextResponse>
 */
export type OptionalAuthRouteHandler = (
  request: NextRequest,
  context: OptionalAuthContext
) => NextResponse | Promise<NextResponse>

/**
 * Middleware wrapper type
 * Takes a route handler and returns a wrapped handler
 */
export type MiddlewareWrapper = (
  handler: AuthenticatedRouteHandler
) => AuthenticatedRouteHandler

/**
 * Resource ownership check options
 */
export interface OwnershipCheckOptions {
  resourceType: 'booking' | 'parkingLot' | 'report'
  getResourceId?: (params: Record<string, string>) => string
  allowAdmin?: boolean // Whether ADMIN can bypass ownership check (default: true)
}

/**
 * Role hierarchy for permission checks
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  PARKING_OWNER: 2,
  ADMIN: 3,
}

/**
 * Check if a role has higher or equal permissions than required role
 */
export function hasRolePermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole)
}
