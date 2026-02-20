import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/login
 * User login endpoint
 * @public
 */
export async function POST(request: NextRequest) {
  // TODO: Implement user login logic
  // - Validate credentials
  // - Compare password hash
  // - Generate JWT tokens (access + refresh)
  // - Return user data and tokens

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Login endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
