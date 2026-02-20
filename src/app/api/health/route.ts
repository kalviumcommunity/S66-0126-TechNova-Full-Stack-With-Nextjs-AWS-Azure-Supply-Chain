import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_CODES } from '@/types/api'

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

    return successResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'ParkPulse API',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      dependencies: {
        database: {
          status: 'connected',
          latency: `${dbLatency}ms`,
        },
      },
    })
  } catch (error) {
    // Database connection failed - return unhealthy status
    return errorResponse(
      ERROR_CODES.DATABASE_ERROR,
      'Service unhealthy: Database connection failed',
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      {
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
      }
    )
  }
}
