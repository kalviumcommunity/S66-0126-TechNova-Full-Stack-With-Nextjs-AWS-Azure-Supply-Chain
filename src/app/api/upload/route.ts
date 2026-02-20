import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/upload
 * Upload images to S3 (for parking lot images)
 * @protected - ADMIN, PARKING_OWNER
 */
export async function POST(_request: NextRequest) {
  // TODO: Implement file upload
  // - Authenticate and authorize user
  // - Validate file type and size
  // - Generate pre-signed S3 URL or upload directly
  // - Return uploaded file URL

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Upload endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
