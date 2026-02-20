import { z } from 'zod'
import { emailSchema, passwordSchema, nameSchema, phoneSchema } from './common'

/**
 * Authentication-related validation schemas
 */

// User role enum
export const userRoleSchema = z.enum(['USER', 'ADMIN', 'PARKING_OWNER'])

// Signup validation
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: nameSchema,
    phone: phoneSchema.optional(),
    role: userRoleSchema.optional().default('USER'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Refresh token validation
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

// Change password validation
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Reset password validation
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Update profile validation
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
})

// Type exports for TypeScript
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserRole = z.infer<typeof userRoleSchema>
