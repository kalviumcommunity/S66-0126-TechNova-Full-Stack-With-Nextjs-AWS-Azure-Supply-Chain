import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Returns the health status of the API and its dependencies
 * This endpoint is public and does not require authentication
 */
export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    const dbLatency = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'ParkPulse API',
          version: '1.0.0',
          uptime: process.uptime(),
          dependencies: {
            database: {
              status: 'connected',
              latency: `${dbLatency}ms`,
            },
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    // Database connection failed
    return NextResponse.json(
      {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          service: 'ParkPulse API',
          version: '1.0.0',
          dependencies: {
            database: {
              status: 'disconnected',
              error: 'Unable to connect to database',
            },
          },
        },
      },
      { status: 503 }
    )
  }
}
