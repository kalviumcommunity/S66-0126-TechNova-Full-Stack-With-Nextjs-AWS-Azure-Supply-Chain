import { withValidation } from '@/lib/middleware/validate'
import { loginSchema } from '@/lib/validations/auth'
import { successResponse, handleApiError } from '@/lib/api-response'
import { UnauthorizedError } from '@/lib/api-error'
import { authenticateUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * POST /api/auth/login
 * User login endpoint
 * @public
 */
export const POST = withValidation(
  async ({ body }) => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: body!.email },
      })

      if (!user) {
        throw new UnauthorizedError('Invalid credentials')
      }

      // Authenticate user and generate tokens
      const {
        accessToken,
        refreshToken,
        user: sanitizedUser,
      } = await authenticateUser(user, body!.password)

      // Return tokens and user data
      return successResponse({
        user: sanitizedUser,
        accessToken,
        refreshToken,
      })
    } catch (error) {
      return handleApiError(error)
    }
  },
  {
    body: loginSchema,
  }
)
