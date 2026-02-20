import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/reports
 * List reports with optional filters
 * @public
 */
export async function GET(request: NextRequest) {
  // TODO: Implement get reports
  // - Support filtering by parking lot, report type
  // - Support pagination
  // - Include user and parking lot details

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Get reports endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}

/**
 * POST /api/reports
 * Submit a new crowd-sourced report
 * @protected
 */
export async function POST(request: NextRequest) {
  // TODO: Implement report submission
  // - Authenticate user
  // - Validate report data
  // - Create report transaction
  // - Optionally update parking spot status based on report

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Submit report endpoint not yet implemented',
      },
    },
    { status: 501 }
  )
}
