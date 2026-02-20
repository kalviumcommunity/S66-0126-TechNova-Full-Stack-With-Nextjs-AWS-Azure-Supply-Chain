import { z } from 'zod'
import {
  nameSchema,
  indianCitySchema,
  coordinatesSchema,
  priceSchema,
  urlSchema,
  uuidSchema,
  paginationSchema,
} from './common'

/**
 * Parking lot related validation schemas
 */

// Parking lot amenities
export const amenitiesSchema = z.array(
  z.enum([
    'CCTV',
    'SECURITY_GUARD',
    'COVERED',
    'EV_CHARGING',
    'WHEELCHAIR_ACCESSIBLE',
    'RESTROOM',
    'CAR_WASH',
    'VALET',
    '24_7',
  ])
)

// Parking spot type
export const spotTypeSchema = z.enum([
  'TWO_WHEELER',
  'FOUR_WHEELER',
  'DISABLED',
])

// Parking spot status
export const spotStatusSchema = z.enum([
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'MAINTENANCE',
])

// Create parking lot validation
export const createParkingLotSchema = z.object({
  name: nameSchema,
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500),
  city: indianCitySchema,
  latitude: coordinatesSchema.shape.latitude,
  longitude: coordinatesSchema.shape.longitude,
  totalSpots: z
    .number()
    .int()
    .positive()
    .max(10000, 'Total spots must not exceed 10,000'),
  pricePerHour: priceSchema,
  amenities: amenitiesSchema.optional().default([]),
  images: z
    .array(urlSchema)
    .max(10, 'Maximum 10 images allowed')
    .optional()
    .default([]),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
})

// Update parking lot validation
export const updateParkingLotSchema = createParkingLotSchema.partial()

// Get parking lot by ID
export const getParkingLotSchema = z.object({
  id: uuidSchema,
})

// Search/filter parking lots
export const searchParkingLotsSchema = paginationSchema.extend({
  city: indianCitySchema.optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(priceSchema.optional()),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(priceSchema.optional()),
  spotType: spotTypeSchema.optional(),
  amenities: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',') : undefined)),
  latitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(coordinatesSchema.shape.latitude.optional()),
  longitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(coordinatesSchema.shape.longitude.optional()),
  radius: z
    .string()
    .optional()
    .default('5')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive().max(50, 'Radius must not exceed 50 km')),
  sortBy: z
    .enum(['price', 'distance', 'availability', 'rating'])
    .optional()
    .default('distance'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
})

// Create parking spot validation
export const createParkingSpotSchema = z.object({
  parkingLotId: uuidSchema,
  spotNumber: z.string().min(1).max(20),
  type: spotTypeSchema,
  status: spotStatusSchema.optional().default('AVAILABLE'),
})

// Update parking spot validation
export const updateParkingSpotSchema = z.object({
  status: spotStatusSchema,
})

// Bulk create parking spots
export const bulkCreateSpotsSchema = z.object({
  parkingLotId: uuidSchema,
  twoWheelerCount: z.number().int().nonnegative().default(0),
  fourWheelerCount: z.number().int().nonnegative().default(0),
  disabledCount: z.number().int().nonnegative().default(0),
  prefix: z.string().max(10).optional().default(''), // e.g., "A-", "B-"
})

// Get spots by parking lot
export const getSpotsByLotSchema = z.object({
  parkingLotId: uuidSchema,
  status: spotStatusSchema.optional(),
  type: spotTypeSchema.optional(),
})

// Type exports
export type CreateParkingLotInput = z.infer<typeof createParkingLotSchema>
export type UpdateParkingLotInput = z.infer<typeof updateParkingLotSchema>
export type SearchParkingLotsInput = z.infer<typeof searchParkingLotsSchema>
export type CreateParkingSpotInput = z.infer<typeof createParkingSpotSchema>
export type UpdateParkingSpotInput = z.infer<typeof updateParkingSpotSchema>
export type BulkCreateSpotsInput = z.infer<typeof bulkCreateSpotsSchema>
export type GetSpotsByLotInput = z.infer<typeof getSpotsByLotSchema>
export type SpotType = z.infer<typeof spotTypeSchema>
export type SpotStatus = z.infer<typeof spotStatusSchema>
export type Amenity = z.infer<typeof amenitiesSchema>[number]
