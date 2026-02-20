import { withValidation } from '@/lib/middleware/validate'
import { refreshTokenSchema } from '@/lib/validations/auth'
import { successResponse, handleApiError } from '@/lib/api-response'
import { UnauthorizedError } from '@/lib/api-error'
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt'
import prisma from '@/lib/prisma'

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * @public
 */
export const POST = withValidation(
  async ({ body }) => {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(body!.refreshToken)

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      })

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return successResponse({
        accessToken,
      })
    } catch (error) {
      return handleApiError(error)
    }
  },
  {
    body: refreshTokenSchema,
  }
)
