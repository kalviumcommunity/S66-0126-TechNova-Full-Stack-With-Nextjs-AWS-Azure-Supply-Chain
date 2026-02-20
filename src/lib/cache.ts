import redis, { isRedisConnected } from '@/lib/redis'
import { logger } from '@/lib/logger'
import { CACHE_TTL } from '@/lib/cache-keys'

/**
 * Cache Utility Functions
 * Module 2.23 - Caching Layer with Redis
 */

/**
 * Get value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache GET skipped', { key })
      return null
    }

    const value = await redis.get(key)
    if (!value) {
      logger.debug('Cache MISS', { key })
      return null
    }

    logger.debug('Cache HIT', { key })
    return JSON.parse(value) as T
  } catch (error) {
    logger.error('Cache GET error', error as Error, { key })
    return null
  }
}

/**
 * Set value in cache with TTL
 */
export async function cacheSet(
  key: string,
  value: unknown,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache SET skipped', { key })
      return false
    }

    const serialized = JSON.stringify(value)
    await redis.setex(key, ttl, serialized)

    logger.debug('Cache SET', { key, ttl })
    return true
  } catch (error) {
    logger.error('Cache SET error', error as Error, { key })
    return false
  }
}

/**
 * Delete value from cache
 */
export async function cacheDel(key: string): Promise<boolean> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache DEL skipped', { key })
      return false
    }

    const result = await redis.del(key)
    logger.debug('Cache DEL', { key, deleted: result > 0 })
    return result > 0
  } catch (error) {
    logger.error('Cache DEL error', error as Error, { key })
    return false
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function cacheDelPattern(pattern: string): Promise<number> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache DEL pattern skipped', { pattern })
      return 0
    }

    const keys = await redis.keys(pattern)
    if (keys.length === 0) {
      return 0
    }

    const result = await redis.del(...keys)
    logger.debug('Cache DEL pattern', { pattern, deleted: result })
    return result
  } catch (error) {
    logger.error('Cache DEL pattern error', error as Error, { pattern })
    return 0
  }
}

/**
 * Check if key exists in cache
 */
export async function cacheExists(key: string): Promise<boolean> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      return false
    }

    const result = await redis.exists(key)
    return result === 1
  } catch (error) {
    logger.error('Cache EXISTS error', error as Error, { key })
    return false
  }
}

/**
 * Get or set cache (cache-aside pattern)
 * If cache miss, execute callback and cache the result
 */
export async function cacheGetOrSet<T>(
  key: string,
  callback: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    return cached
  }

  // Cache miss - execute callback
  logger.debug('Cache miss, executing callback', { key })
  const value = await callback()

  // Cache the result (fire and forget)
  cacheSet(key, value, ttl).catch((error) => {
    logger.error('Failed to cache result', error, { key })
  })

  return value
}

/**
 * Invalidate cache for a specific resource
 * Useful when updating/deleting resources
 */
export async function invalidateCache(keys: string | string[]): Promise<void> {
  const keyArray = Array.isArray(keys) ? keys : [keys]

  for (const key of keyArray) {
    await cacheDel(key)
  }

  logger.info('Cache invalidated', { keys: keyArray })
}

/**
 * Set multiple keys at once (pipeline)
 */
export async function cacheSetMulti(
  entries: Array<{ key: string; value: unknown; ttl?: number }>
): Promise<boolean> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache SET multi skipped')
      return false
    }

    const pipeline = redis.pipeline()

    for (const entry of entries) {
      const serialized = JSON.stringify(entry.value)
      const ttl = entry.ttl || CACHE_TTL.MEDIUM
      pipeline.setex(entry.key, ttl, serialized)
    }

    await pipeline.exec()
    logger.debug('Cache SET multi', { count: entries.length })
    return true
  } catch (error) {
    logger.error('Cache SET multi error', error as Error)
    return false
  }
}

/**
 * Get multiple keys at once (pipeline)
 */
export async function cacheGetMulti<T>(
  keys: string[]
): Promise<Map<string, T>> {
  const result = new Map<string, T>()

  try {
    const connected = await isRedisConnected()
    if (!connected) {
      logger.warn('Redis not connected, cache GET multi skipped')
      return result
    }

    const values = await redis.mget(...keys)

    keys.forEach((key, index) => {
      const value = values[index]
      if (value) {
        try {
          result.set(key, JSON.parse(value) as T)
        } catch {
          logger.warn('Failed to parse cached value', { key })
        }
      }
    })

    logger.debug('Cache GET multi', {
      requested: keys.length,
      found: result.size,
    })
    return result
  } catch (error) {
    logger.error('Cache GET multi error', error as Error)
    return result
  }
}

/**
 * Increment a counter in cache (useful for rate limiting, metrics)
 */
export async function cacheIncrement(
  key: string,
  amount: number = 1,
  ttl?: number
): Promise<number> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      throw new Error('Redis not connected')
    }

    const result = await redis.incrby(key, amount)

    // Set TTL if provided and this is the first increment
    if (ttl && result === amount) {
      await redis.expire(key, ttl)
    }

    return result
  } catch (error) {
    logger.error('Cache INCREMENT error', error as Error, { key })
    throw error
  }
}

/**
 * Decrement a counter in cache
 */
export async function cacheDecrement(
  key: string,
  amount: number = 1
): Promise<number> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      throw new Error('Redis not connected')
    }

    const result = await redis.decrby(key, amount)
    return result
  } catch (error) {
    logger.error('Cache DECREMENT error', error as Error, { key })
    throw error
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean
  keysCount: number
  memoryUsed?: string
}> {
  try {
    const connected = await isRedisConnected()
    if (!connected) {
      return { connected: false, keysCount: 0 }
    }

    const info = await redis.info('memory')
    const dbSize = await redis.dbsize()

    const memoryMatch = info.match(/used_memory_human:(.+)/)
    const memoryUsed = memoryMatch ? memoryMatch[1].trim() : undefined

    return {
      connected: true,
      keysCount: dbSize,
      memoryUsed,
    }
  } catch (error) {
    logger.error('Failed to get cache stats', error as Error)
    return { connected: false, keysCount: 0 }
  }
}
