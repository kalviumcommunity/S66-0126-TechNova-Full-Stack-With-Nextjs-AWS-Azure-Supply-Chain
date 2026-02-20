import { z } from 'zod'

/**
 * Common validation schemas used across the application
 */

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .toLowerCase()
  .trim()

// Password validation - minimum 8 characters, at least one uppercase, lowercase, number, and special char
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Phone number validation for Indian format
export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number format')
  .length(10, 'Phone number must be 10 digits')

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim()

// Pagination validation
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(1000)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().min(1).max(100)),
})

// ID validation (UUID or MongoDB ObjectId)
export const uuidSchema = z.string().uuid('Invalid ID format')

// Coordinates validation
export const latitudeSchema = z
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90')

export const longitudeSchema = z
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180')

export const coordinatesSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
})

// Indian city validation
export const indianCitySchema = z.enum([
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Chennai',
  'Hyderabad',
  'Kolkata',
])

// Price validation (in INR)
export const priceSchema = z
  .number()
  .nonnegative('Price must be non-negative')
  .max(10000, 'Price must not exceed ₹10,000 per hour')

// Date validation helpers
export const futureDateSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) > new Date(), {
    message: 'Date must be in the future',
  })

export const pastDateSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) < new Date(), {
    message: 'Date must be in the past',
  })

// Generic search query validation
export const searchQuerySchema = z
  .string()
  .min(1, 'Search query must not be empty')
  .max(200, 'Search query must not exceed 200 characters')
  .trim()

// URL validation
export const urlSchema = z.string().url('Invalid URL format')

// Optional string that trims and rejects empty strings
export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, 'Field cannot be empty')

// Helper to make schema optional but validated when present
export const optionalNonEmpty = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.literal('').transform(() => undefined)])
