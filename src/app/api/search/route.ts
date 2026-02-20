import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/search
 * Search parking lots by location, name, or filters
 * @public
 */
export async function GET(_request: NextRequest) {
  // TODO: Implement parking lot search
  // - Parse search query and filters
  // - Perform text search on name and address
  // - Support geospatial search (latitude/longitude + radius)
  // - Filter by city, price, availability
  // - Return paginated results

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Search endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
