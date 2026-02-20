import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/parking-lots/[id]/spots
 * Get all parking spots for a specific parking lot
 * @public
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Implement get parking spots
  // - Fetch all spots for the parking lot
  // - Filter by status (available, occupied, reserved)
  // - Include sensor data if available

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Get parking spots endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
