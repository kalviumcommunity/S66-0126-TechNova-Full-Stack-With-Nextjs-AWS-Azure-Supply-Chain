/**
 * Cache Key Management
 * Module 2.23 - Caching Layer with Redis
 *
 * Centralized cache key generation for consistency
 */

export const CACHE_PREFIXES = {
  PARKING_LOT: 'parking_lot',
  PARKING_SPOTS: 'parking_spots',
  USER: 'user',
  BOOKING: 'booking',
  SEARCH: 'search',
  AVAILABILITY: 'availability',
  REPORTS: 'reports',
  SENSORS: 'sensors',
} as const

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const

/**
 * Generate cache key for parking lot
 */
export function parkingLotKey(id: string): string {
  return `${CACHE_PREFIXES.PARKING_LOT}:${id}`
}

/**
 * Generate cache key for parking lot list by city
 */
export function parkingLotsByCityKey(city: string): string {
  return `${CACHE_PREFIXES.PARKING_LOT}:city:${city}`
}

/**
 * Generate cache key for parking spots by lot
 */
export function parkingSpotsKey(parkingLotId: string): string {
  return `${CACHE_PREFIXES.PARKING_SPOTS}:lot:${parkingLotId}`
}

/**
 * Generate cache key for parking spot availability
 */
export function spotAvailabilityKey(parkingLotId: string): string {
  return `${CACHE_PREFIXES.AVAILABILITY}:lot:${parkingLotId}`
}

/**
 * Generate cache key for user data
 */
export function userKey(userId: string): string {
  return `${CACHE_PREFIXES.USER}:${userId}`
}

/**
 * Generate cache key for user bookings
 */
export function userBookingsKey(userId: string): string {
  return `${CACHE_PREFIXES.BOOKING}:user:${userId}`
}

/**
 * Generate cache key for booking
 */
export function bookingKey(bookingId: string): string {
  return `${CACHE_PREFIXES.BOOKING}:${bookingId}`
}

/**
 * Generate cache key for search results
 */
export function searchKey(
  query: string,
  filters?: Record<string, unknown>
): string {
  const filterStr = filters ? JSON.stringify(filters) : ''
  const hash = Buffer.from(`${query}:${filterStr}`).toString('base64')
  return `${CACHE_PREFIXES.SEARCH}:${hash}`
}

/**
 * Generate cache key for reports by parking lot
 */
export function reportsKey(parkingLotId: string): string {
  return `${CACHE_PREFIXES.REPORTS}:lot:${parkingLotId}`
}

/**
 * Generate cache key for sensor data
 */
export function sensorKey(sensorId: string): string {
  return `${CACHE_PREFIXES.SENSORS}:${sensorId}`
}

/**
 * Generate cache key pattern for invalidation
 */
export function parkingLotPattern(): string {
  return `${CACHE_PREFIXES.PARKING_LOT}:*`
}

/**
 * Generate cache key pattern for availability by lot
 */
export function availabilityPatternByLot(parkingLotId: string): string {
  return `${CACHE_PREFIXES.AVAILABILITY}:lot:${parkingLotId}:*`
}
