import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'
import { UnauthorizedError } from './api-error'
import { generateTokenPair, verifyAccessToken, type TokenPayload } from './jwt'

/**
 * Authentication Helper Functions
 */

const SALT_ROUNDS = 10

/**
 * Hash password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare password with hash
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create token payload from user
 * @param user - User object from database
 * @returns Token payload
 */
export function createTokenPayload(user: User): TokenPayload {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  }
}

/**
 * Authenticate user and generate tokens
 * @param user - User object from database
 * @param password - Plain text password to verify
 * @returns Object with access and refresh tokens
 * @throws UnauthorizedError if password is incorrect
 */
export async function authenticateUser(
  user: User,
  password: string
): Promise<{
  accessToken: string
  refreshToken: string
  user: Omit<User, 'password'>
}> {
  const isValid = await comparePassword(password, user.password)

  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const payload = createTokenPayload(user)
  const tokens = generateTokenPair(payload)

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user

  return {
    ...tokens,
    user: userWithoutPassword,
  }
}

/**
 * Verify access token and return user ID
 * @param token - JWT access token
 * @returns User ID from token
 * @throws UnauthorizedError if token is invalid
 */
export function getUserIdFromToken(token: string): string {
  const decoded = verifyAccessToken(token)
  return decoded.userId
}

/**
 * Sanitize user object (remove sensitive fields)
 * @param user - User object from database
 * @returns User object without password
 */
export function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password: _, ...sanitized } = user
  return sanitized
}

/**
 * Validate password strength
 * @param password - Plain text password
 * @returns Object with isValid flag and errors array
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
