import { z } from 'zod'
import { uuidSchema, futureDateSchema, paginationSchema } from './common'
import { spotTypeSchema } from './parking-lot'

/**
 * Booking related validation schemas
 */

// Booking status enum
export const bookingStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
])

// Create booking validation
export const createBookingSchema = z
  .object({
    parkingSpotId: uuidSchema,
    startTime: futureDateSchema,
    endTime: futureDateSchema,
    vehicleNumber: z
      .string()
      .regex(
        /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/,
        'Invalid vehicle number format (e.g., MH12AB1234)'
      )
      .optional(),
    vehicleType: spotTypeSchema.optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      return end > start
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return diffInHours <= 72 // Max 3 days
    },
    {
      message: 'Booking duration cannot exceed 72 hours',
      path: ['endTime'],
    }
  )

// Update booking validation
export const updateBookingSchema = z.object({
  status: bookingStatusSchema.optional(),
  endTime: futureDateSchema.optional(),
})

// Cancel booking validation
export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(10, 'Cancellation reason must be at least 10 characters')
    .max(500, 'Cancellation reason must not exceed 500 characters')
    .optional(),
})

// Get booking by ID
export const getBookingSchema = z.object({
  id: uuidSchema,
})

// Get user bookings with filters
export const getUserBookingsSchema = paginationSchema.extend({
  status: bookingStatusSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z
    .enum(['startTime', 'endTime', 'createdAt', 'totalPrice'])
    .optional()
    .default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Check availability validation
export const checkAvailabilitySchema = z
  .object({
    parkingLotId: uuidSchema.optional(),
    parkingSpotId: uuidSchema.optional(),
    startTime: futureDateSchema,
    endTime: futureDateSchema,
    spotType: spotTypeSchema.optional(),
  })
  .refine((data) => data.parkingLotId || data.parkingSpotId, {
    message: 'Either parkingLotId or parkingSpotId must be provided',
    path: ['parkingLotId'],
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      return end > start
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

// Extend booking validation
export const extendBookingSchema = z
  .object({
    newEndTime: futureDateSchema,
  })
  .refine(
    (data) => {
      const newEnd = new Date(data.newEndTime)
      const now = new Date()
      const diffInHours = (newEnd.getTime() - now.getTime()) / (1000 * 60 * 60)
      return diffInHours <= 72
    },
    {
      message: 'Extended booking cannot exceed 72 hours from now',
      path: ['newEndTime'],
    }
  )

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
export type GetUserBookingsInput = z.infer<typeof getUserBookingsSchema>
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>
export type ExtendBookingInput = z.infer<typeof extendBookingSchema>
export type BookingStatus = z.infer<typeof bookingStatusSchema>
