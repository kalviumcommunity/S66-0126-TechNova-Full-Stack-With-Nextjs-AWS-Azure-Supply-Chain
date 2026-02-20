import jwt from 'jsonwebtoken'
import { UnauthorizedError } from './api-error'

/**
 * JWT Token Management Utilities
 */

// Get secrets from environment
const JWT_SECRET =
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  'fallback-refresh-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m' // 15 minutes
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d' // 7 days

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export interface DecodedToken extends TokenPayload {
  iat: number
  exp: number
}

/**
 * Generate access token
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'parkpulse-api',
    audience: 'parkpulse-client',
  } as jwt.SignOptions)
}

/**
 * Generate refresh token
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'parkpulse-api',
    audience: 'parkpulse-client',
  } as jwt.SignOptions)
}

/**
 * Generate both access and refresh tokens
 * @param payload - User data to encode in tokens
 * @returns Object with accessToken and refreshToken
 */
export function generateTokenPair(payload: TokenPayload): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

/**
 * Verify access token
 * @param token - JWT access token to verify
 * @returns Decoded token payload
 * @throws UnauthorizedError if token is invalid or expired
 */
export function verifyAccessToken(token: string): DecodedToken {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'parkpulse-api',
      audience: 'parkpulse-client',
    }) as DecodedToken
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token has expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid access token')
    }
    throw new UnauthorizedError('Token verification failed')
  }
}

/**
 * Verify refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload
 * @throws UnauthorizedError if token is invalid or expired
 */
export function verifyRefreshToken(token: string): DecodedToken {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'parkpulse-api',
      audience: 'parkpulse-client',
    }) as DecodedToken
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token has expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token')
    }
    throw new UnauthorizedError('Token verification failed')
  }
}

/**
 * Decode token without verification (useful for expired tokens)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken
  } catch {
    return null
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value (Bearer token)
 * @returns Extracted token or null
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Check if token is expired
 * @param token - JWT token to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  return Date.now() >= decoded.exp * 1000
}

/**
 * Get token expiration time
 * @param token - JWT token
 * @returns Expiration timestamp or null
 */
export function getTokenExpiration(token: string): number | null {
  const decoded = decodeToken(token)
  return decoded?.exp || null
}
