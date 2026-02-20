import useSWR from 'swr'
import { swrConfig, api } from '@/lib/swr-config'

export interface ParkingLot {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  totalSpots: number
  availableSpots?: number
  pricePerHour: number
  amenities: string[]
  description?: string
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface UseParkingLotsParams {
  city?: string
  search?: string
  priceMin?: number
  priceMax?: number
  availableOnly?: boolean
  vehicleType?: string
}

export function useParkingLots(params?: UseParkingLotsParams) {
  const queryParams = new URLSearchParams()

  if (params?.city) queryParams.append('city', params.city)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.priceMin)
    queryParams.append('priceMin', params.priceMin.toString())
  if (params?.priceMax)
    queryParams.append('priceMax', params.priceMax.toString())
  if (params?.availableOnly) queryParams.append('availableOnly', 'true')
  if (params?.vehicleType) queryParams.append('vehicleType', params.vehicleType)

  const queryString = queryParams.toString()
  const key = queryString ? `/parking-lots?${queryString}` : '/parking-lots'

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => api.get(key) as Promise<any>,
    {
      ...swrConfig,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  return {
    parkingLots: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

export function useParkingLot(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/parking-lots/${id}` : null,
    () => api.get(`/parking-lots/${id}`) as Promise<any>,
    swrConfig
  )

  return {
    parkingLot: data?.data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

export function useParkingLotSpots(parkingLotId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    parkingLotId ? `/parking-lots/${parkingLotId}/spots` : null,
    () => api.get(`/parking-lots/${parkingLotId}/spots`) as Promise<any>,
    swrConfig
  )

  return {
    spots: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
