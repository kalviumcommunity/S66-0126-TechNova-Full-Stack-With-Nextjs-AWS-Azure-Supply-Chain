import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/sensors
 * List all sensors
 * @protected - ADMIN, PARKING_OWNER
 */
export async function GET(request: NextRequest) {
  // TODO: Implement get sensors
  // - Authenticate and authorize user
  // - Fetch sensors with status and battery level
  // - Support filtering by status, parking lot

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Get sensors endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
