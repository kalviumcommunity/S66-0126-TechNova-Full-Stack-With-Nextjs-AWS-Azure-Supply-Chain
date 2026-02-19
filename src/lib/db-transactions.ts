import { PrismaClient } from '@prisma/client'
import prisma from './prisma'

export interface TransactionOptions {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  isolationLevel?:
    | 'ReadUncommitted'
    | 'ReadCommitted'
    | 'RepeatableRead'
    | 'Serializable'
}

const DEFAULT_OPTIONS: Required<TransactionOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  isolationLevel: 'ReadCommitted',
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly retryAttempt?: number
  ) {
    super(message)
    this.name = 'TransactionError'
  }
}

function calculateBackoffDelay(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt - 1)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function executeTransaction<T>(
  callback: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await prisma.$transaction(callback, {
        maxWait: 5000,
        timeout: config.timeout,
        isolationLevel: config.isolationLevel,
      })
      return result
    } catch (error) {
      lastError = error as Error

      const isRetryable = isRetryableError(error as Error)

      if (!isRetryable || attempt === config.maxRetries) {
        throw new TransactionError(
          `Transaction failed after ${attempt} attempt(s): ${(error as Error).message}`,
          error as Error,
          attempt
        )
      }

      const delay = calculateBackoffDelay(attempt, config.retryDelay)
      console.warn(
        `Transaction attempt ${attempt} failed. Retrying in ${delay}ms...`,
        (error as Error).message
      )

      await sleep(delay)
    }
  }

  throw new TransactionError(
    `Transaction failed after ${config.maxRetries} retries`,
    lastError,
    config.maxRetries
  )
}

function isRetryableError(error: Error): boolean {
  const retryablePatterns = [
    'deadlock',
    'lock timeout',
    'connection',
    'ECONNRESET',
    'ETIMEDOUT',
    'serialization failure',
  ]

  const errorMessage = error.message.toLowerCase()
  return retryablePatterns.some((pattern) => errorMessage.includes(pattern))
}

export async function batchOperation<T, R>(
  items: T[],
  batchSize: number,
  operation: (
    batch: T[],
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<R>,
  options: TransactionOptions = {}
): Promise<R[]> {
  const results: R[] = []
  const batches: T[][] = []

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }

  await executeTransaction(async (tx) => {
    for (const batch of batches) {
      const result = await operation(batch, tx)
      results.push(result)
    }
    return results
  }, options)

  return results
}

export async function atomicOperation<T = unknown>(
  operations: Array<
    (
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >
    ) => Promise<T>
  >,
  options: TransactionOptions = {}
): Promise<T[]> {
  return executeTransaction(async (tx) => {
    const results: T[] = []
    for (const operation of operations) {
      const result = await operation(tx)
      results.push(result)
    }
    return results
  }, options)
}

export async function createBookingTransaction(data: {
  spotId: string
  userId: string
  startTime: Date
  endTime: Date
  totalPrice: number
}) {
  return executeTransaction(async (tx) => {
    const spot = await tx.parkingSpot.findUnique({
      where: { id: data.spotId },
      select: { status: true, parkingLotId: true },
    })

    if (!spot) {
      throw new Error('Parking spot not found')
    }

    if (spot.status !== 'AVAILABLE') {
      throw new Error('Parking spot is not available')
    }

    await tx.parkingSpot.update({
      where: { id: data.spotId },
      data: {
        status: 'RESERVED',
        lastUpdated: new Date(),
      },
    })

    const booking = await tx.booking.create({
      data: {
        userId: data.userId,
        parkingSpotId: data.spotId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: 'CONFIRMED',
        totalPrice: data.totalPrice,
      },
      include: {
        parkingSpot: {
          include: {
            parkingLot: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    return booking
  })
}

export async function updateSpotsFromSensors(
  updates: Array<{
    spotId: string
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
    sensorId: string
  }>
) {
  return executeTransaction(async (tx) => {
    const results = []

    for (const update of updates) {
      const spot = await tx.parkingSpot.update({
        where: { id: update.spotId },
        data: {
          status: update.status,
          lastUpdated: new Date(),
        },
      })

      await tx.sensor.update({
        where: { id: update.sensorId },
        data: {
          lastPing: new Date(),
        },
      })

      results.push(spot)
    }

    return results
  })
}

export async function createReportTransaction(data: {
  userId: string
  parkingLotId: string
  reportType: 'AVAILABILITY' | 'ISSUE'
  description: string
  updateSpotStatus?: boolean
}) {
  return executeTransaction(async (tx) => {
    const report = await tx.report.create({
      data: {
        userId: data.userId,
        parkingLotId: data.parkingLotId,
        reportType: data.reportType,
        description: data.description,
      },
    })

    if (data.updateSpotStatus && data.reportType === 'AVAILABILITY') {
      const spotsToUpdate = await tx.parkingSpot.findMany({
        where: {
          parkingLotId: data.parkingLotId,
          status: 'AVAILABLE',
        },
        take: 5,
      })

      await tx.parkingSpot.updateMany({
        where: {
          id: { in: spotsToUpdate.map((s) => s.id) },
        },
        data: {
          status: 'OCCUPIED',
          lastUpdated: new Date(),
        },
      })
    }

    return report
  })
}
