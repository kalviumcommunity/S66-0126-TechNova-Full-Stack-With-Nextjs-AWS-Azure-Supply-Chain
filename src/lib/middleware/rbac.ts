import { ForbiddenError } from '@/lib/api-error'
import prisma from '@/lib/prisma'
import type {
  AuthenticatedRouteHandler,
  MiddlewareWrapper,
  OwnershipCheckOptions,
} from '@/types/auth'
import { UserRole, hasAnyRole } from '@/types/auth'

/**
 * Role-Based Access Control (RBAC) Middleware
 * Module 2.21 - Authorization & Permissions
 */

/**
 * Require specific role(s) to access a route
 * Use after authenticate() middleware
 *
 * Usage:
 * ```typescript
 * export const POST = authenticate(
 *   requireRole(['ADMIN', 'PARKING_OWNER'])(
 *     async (request, { user }) => {
 *       // Only ADMIN and PARKING_OWNER can access
 *     }
 *   )
 * )
 * ```
 *
 * @param allowedRoles - Array of roles that can access this route
 * @returns Middleware wrapper function
 */
export function requireRole(allowedRoles: UserRole[]): MiddlewareWrapper {
  return (handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler => {
    return async (request, context) => {
      const { user } = context

      // Check if user has any of the allowed roles
      if (!hasAnyRole(user.role, allowedRoles)) {
        throw new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        )
      }

      // User has required role, proceed to handler
      return handler(request, context)
    }
  }
}

/**
 * Require ADMIN role only
 * Convenience wrapper for admin-only routes
 *
 * Usage:
 * ```typescript
 * export const DELETE = authenticate(
 *   requireAdmin(async (request, { user }) => {
 *     // Only admins can delete
 *   })
 * )
 * ```
 */
export function requireAdmin(): MiddlewareWrapper {
  return requireRole([UserRole.ADMIN])
}

/**
 * Require ownership of a resource or ADMIN role
 * Checks if user owns the resource or is an admin
 *
 * Usage:
 * ```typescript
 * export const PUT = authenticate(
 *   requireOwnership({
 *     resourceType: 'booking',
 *     getResourceId: (params) => params.id
 *   })(
 *     async (request, { user, params }) => {
 *       // Only owner or admin can update
 *     }
 *   )
 * )
 * ```
 *
 * @param options - Ownership check configuration
 * @returns Middleware wrapper function
 */
export function requireOwnership(
  options: OwnershipCheckOptions
): MiddlewareWrapper {
  const { resourceType, getResourceId, allowAdmin = true } = options

  return (handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler => {
    return async (request, context) => {
      const { user, params } = context

      // ADMIN bypasses ownership check (if allowed)
      if (allowAdmin && user.role === UserRole.ADMIN) {
        return handler(request, context)
      }

      // Extract resource ID from params
      let resourceId: string
      if (getResourceId && params) {
        resourceId = getResourceId(params)
      } else if (params?.id) {
        resourceId = params.id
      } else {
        throw new ForbiddenError('Resource ID not found')
      }

      // Check ownership based on resource type
      const isOwner = await checkResourceOwnership(
        resourceType,
        resourceId,
        user.id
      )

      if (!isOwner) {
        throw new ForbiddenError(
          `You don't have permission to access this ${resourceType}`
        )
      }

      // User owns the resource, proceed to handler
      return handler(request, context)
    }
  }
}

/**
 * Check if user owns a specific resource
 * Internal utility function
 *
 * @param resourceType - Type of resource to check
 * @param resourceId - ID of the resource
 * @param userId - ID of the user
 * @returns true if user owns the resource, false otherwise
 */
async function checkResourceOwnership(
  resourceType: 'booking' | 'parkingLot' | 'report',
  resourceId: string,
  userId: string
): Promise<boolean> {
  try {
    switch (resourceType) {
      case 'booking': {
        const booking = await prisma.booking.findUnique({
          where: { id: resourceId },
          select: { userId: true },
        })
        return booking?.userId === userId
      }

      case 'parkingLot': {
        const parkingLot = await prisma.parkingLot.findUnique({
          where: { id: resourceId },
          select: { ownerId: true },
        })
        return parkingLot?.ownerId === userId
      }

      case 'report': {
        const report = await prisma.report.findUnique({
          where: { id: resourceId },
          select: { userId: true },
        })
        return report?.userId === userId
      }

      default:
        return false
    }
  } catch {
    return false
  }
}

/**
 * Check if user can manage a parking lot
 * Public utility function for use in route handlers
 *
 * @param parkingLotId - ID of the parking lot
 * @param userId - ID of the user
 * @param userRole - Role of the user
 * @returns true if user can manage the parking lot
 */
export async function canManageParkingLot(
  parkingLotId: string,
  userId: string,
  userRole: UserRole
): Promise<boolean> {
  // ADMIN can manage any parking lot
  if (userRole === UserRole.ADMIN) {
    return true
  }

  // Check if user owns the parking lot
  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parkingLotId },
    select: { ownerId: true },
  })

  return parkingLot?.ownerId === userId
}

/**
 * Check if user can manage a booking
 * Public utility function for use in route handlers
 *
 * @param bookingId - ID of the booking
 * @param userId - ID of the user
 * @param userRole - Role of the user
 * @returns true if user can manage the booking
 */
export async function canManageBooking(
  bookingId: string,
  userId: string,
  userRole: UserRole
): Promise<boolean> {
  // ADMIN can manage any booking
  if (userRole === UserRole.ADMIN) {
    return true
  }

  // Check if user owns the booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { userId: true },
  })

  return booking?.userId === userId
}

/**
 * Check if user can manage a report
 * Public utility function for use in route handlers
 *
 * @param reportId - ID of the report
 * @param userId - ID of the user
 * @param userRole - Role of the user
 * @returns true if user can manage the report
 */
export async function canManageReport(
  reportId: string,
  userId: string,
  userRole: UserRole
): Promise<boolean> {
  // ADMIN can manage any report
  if (userRole === UserRole.ADMIN) {
    return true
  }

  // Check if user owns the report
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { userId: true },
  })

  return report?.userId === userId
}

/**
 * Check if user can view a parking lot's sensitive data
 * Public utility function for use in route handlers
 *
 * @param parkingLotId - ID of the parking lot
 * @param userId - ID of the user
 * @param userRole - Role of the user
 * @returns true if user can view sensitive data
 */
export async function canViewParkingLotDetails(
  parkingLotId: string,
  userId: string,
  userRole: UserRole
): Promise<boolean> {
  // ADMIN can view any parking lot details
  if (userRole === UserRole.ADMIN) {
    return true
  }

  // PARKING_OWNER can view their own parking lot details
  if (userRole === UserRole.PARKING_OWNER) {
    return canManageParkingLot(parkingLotId, userId, userRole)
  }

  // Regular users cannot view sensitive details
  return false
}

/**
 * Require PARKING_OWNER or ADMIN role
 * Convenience wrapper for parking lot management routes
 */
export function requireParkingOwner(): MiddlewareWrapper {
  return requireRole([UserRole.PARKING_OWNER, UserRole.ADMIN])
}
