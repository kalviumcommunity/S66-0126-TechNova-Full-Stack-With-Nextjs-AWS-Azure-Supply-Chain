import useSWR from 'swr'
import { useState } from 'react'
import { swrConfig, api } from '@/lib/swr-config'

export interface Booking {
  id: string
  userId: string
  parkingLotId: string
  parkingSpotId: string
  startTime: string
  endTime: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING'
  totalPrice: number
  spotNumber?: string
  parkingLotName?: string
  parkingLotAddress?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateBookingData {
  parkingLotId: string
  parkingSpotId: string
  startTime: string
  endTime: string
}

export function useBookings(params?: { status?: string }) {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  const queryString = queryParams.toString()
  const key = queryString ? `/bookings?${queryString}` : '/bookings'

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => api.get(key) as Promise<any>,
    {
      ...swrConfig,
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  )

  return {
    bookings: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

export function useBooking(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/bookings/${id}` : null,
    () => api.get(`/bookings/${id}`) as Promise<any>,
    swrConfig
  )

  return {
    booking: data?.data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false)

  const createBooking = async (bookingData: CreateBookingData) => {
    setIsLoading(true)
    try {
      const response = (await api.post('/bookings', bookingData)) as any
      return response.data
    } finally {
      setIsLoading(false)
    }
  }

  return { createBooking, isLoading }
}

export function useCancelBooking() {
  const cancelBooking = async (id: string) => {
    const response = (await api.put(`/bookings/${id}`, {
      status: 'CANCELLED',
    })) as any
    return response.data
  }

  return { cancelBooking }
}
