import { successResponse } from '@/lib/api-response'

/**
 * POST /api/auth/logout
 * User logout endpoint
 * @protected
 *
 * Note: Since we're using stateless JWT tokens, logout is primarily handled
 * client-side by clearing the stored tokens. This endpoint can be used for
 * future token blacklisting implementation.
 */
export async function POST() {
  // In a stateless JWT setup, logout is handled client-side
  // The client should remove the tokens from storage

  // Future: Implement token blacklisting in Redis
  // - Extract token from Authorization header
  // - Add token to Redis blacklist with TTL = token expiry time
  // - Check blacklist in auth middleware

  return successResponse({
    message: 'Logout successful. Please clear tokens from client.',
  })
}
