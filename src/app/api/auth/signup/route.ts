import { withValidation } from '@/lib/middleware/validate'
import { signupSchema } from '@/lib/validations/auth'
import { createdResponse, handleApiError } from '@/lib/api-response'
import { ConflictError } from '@/lib/api-error'
import { hashPassword, sanitizeUser, createTokenPayload } from '@/lib/auth'
import { generateTokenPair } from '@/lib/jwt'
import prisma from '@/lib/prisma'

/**
 * POST /api/auth/signup
 * Register a new user account
 * @public
 */
export const POST = withValidation(
  async ({ body }) => {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: body!.email },
      })

      if (existingUser) {
        throw new ConflictError('User with this email already exists')
      }

      // Hash password
      const hashedPassword = await hashPassword(body!.password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: body!.email,
          password: hashedPassword,
          name: body!.name,
          phone: body!.phone || null,
          role: body!.role || 'USER',
        },
      })

      // Generate tokens
      const payload = createTokenPayload(user)
      const tokens = generateTokenPair(payload)

      // Return sanitized user and tokens
      return createdResponse({
        user: sanitizeUser(user),
        ...tokens,
      })
    } catch (error) {
      return handleApiError(error)
    }
  },
  {
    body: signupSchema,
  }
)
