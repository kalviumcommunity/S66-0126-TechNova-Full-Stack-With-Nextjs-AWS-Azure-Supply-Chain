import { z } from 'zod'
import { uuidSchema, paginationSchema } from './common'

/**
 * Report related validation schemas
 */

// Report type enum
export const reportTypeSchema = z.enum([
  'AVAILABILITY',
  'FULL',
  'EMPTY',
  'PRICING_ISSUE',
  'FACILITY_ISSUE',
  'SAFETY_CONCERN',
  'INCORRECT_INFO',
  'OTHER',
])

// Report priority
export const reportPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

// Report status
export const reportStatusSchema = z.enum([
  'PENDING',
  'VERIFIED',
  'REJECTED',
  'RESOLVED',
])

// Create report validation
export const createReportSchema = z.object({
  parkingLotId: uuidSchema,
  type: reportTypeSchema,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  availableSpots: z.number().int().nonnegative().optional(),
  images: z
    .array(z.string().url())
    .max(5, 'Maximum 5 images allowed')
    .optional(),
})

// Update report validation
export const updateReportSchema = z.object({
  status: reportStatusSchema,
  adminNotes: z
    .string()
    .max(500, 'Admin notes must not exceed 500 characters')
    .optional(),
})

// Get reports with filters
export const getReportsSchema = paginationSchema.extend({
  parkingLotId: uuidSchema.optional(),
  type: reportTypeSchema.optional(),
  status: reportStatusSchema.optional(),
  priority: reportPrioritySchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  userId: uuidSchema.optional(),
  sortBy: z
    .enum(['createdAt', 'priority', 'status'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Verify report validation (admin only)
export const verifyReportSchema = z.object({
  isVerified: z.boolean(),
  confidence: z
    .number()
    .min(0, 'Confidence must be between 0 and 1')
    .max(1, 'Confidence must be between 0 and 1')
    .optional(),
  verificationNotes: z
    .string()
    .max(500, 'Verification notes must not exceed 500 characters')
    .optional(),
})

// Type exports
export type CreateReportInput = z.infer<typeof createReportSchema>
export type UpdateReportInput = z.infer<typeof updateReportSchema>
export type GetReportsInput = z.infer<typeof getReportsSchema>
export type VerifyReportInput = z.infer<typeof verifyReportSchema>
export type ReportType = z.infer<typeof reportTypeSchema>
export type ReportStatus = z.infer<typeof reportStatusSchema>
export type ReportPriority = z.infer<typeof reportPrioritySchema>
