import Redis, { RedisOptions } from 'ioredis'
import { logger } from '@/lib/logger'

/**
 * Redis Client Configuration
 * Module 2.23 - Caching Layer with Redis
 */

// Redis configuration from environment variables
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10)

// Parse Redis URL
function parseRedisUrl(url: string): RedisOptions {
  try {
    const parsedUrl = new URL(url)
    return {
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port || '6379', 10),
      password: parsedUrl.password || REDIS_PASSWORD,
      db: REDIS_DB,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000)
        logger.warn(`Redis connection retry attempt ${times}`, { delay })
        return delay
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    }
  } catch (error) {
    logger.error('Failed to parse Redis URL', error as Error)
    throw error
  }
}

// Create Redis client instance
const redisOptions = parseRedisUrl(REDIS_URL)
const redis = new Redis(redisOptions)

// Redis connection event handlers
redis.on('connect', () => {
  logger.info('Redis client connecting...')
})

redis.on('ready', () => {
  logger.info('Redis client connected and ready')
})

redis.on('error', (error: Error) => {
  logger.error('Redis client error', error)
})

redis.on('close', () => {
  logger.warn('Redis client connection closed')
})

redis.on('reconnecting', () => {
  logger.info('Redis client reconnecting...')
})

// Connect to Redis
redis.connect().catch((error) => {
  logger.error('Failed to connect to Redis', error)
})

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis {
  return redis
}

/**
 * Check if Redis is connected and ready
 */
export async function isRedisConnected(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}

/**
 * Gracefully disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit()
    logger.info('Redis client disconnected gracefully')
  } catch (error) {
    logger.error('Error disconnecting from Redis', error as Error)
  }
}

/**
 * Flush all data from Redis (use with caution!)
 */
export async function flushRedis(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot flush Redis in production')
  }

  try {
    await redis.flushdb()
    logger.warn('Redis database flushed')
  } catch (error) {
    logger.error('Error flushing Redis', error as Error)
    throw error
  }
}

// Export Redis client as default
export default redis
