'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { City, VehicleType } from '@prisma/client'

interface SearchFilters {
  priceMin?: number
  priceMax?: number
  vehicleType?: VehicleType
  amenities?: string[]
  availableOnly?: boolean
}

interface ParkingLot {
  id: string
  name: string
  address: string
  city: City
  latitude: number
  longitude: number
  totalSpots: number
  availableSpots?: number
  pricePerHour: number
  amenities: string[]
}

interface SearchContextType {
  city: City
  setCity: (city: City) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  updateFilter: (key: keyof SearchFilters, value: any) => void
  results: ParkingLot[]
  setResults: (results: ParkingLot[]) => void
  isSearching: boolean
  search: () => Promise<void>
  clearFilters: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const DEFAULT_CITY: City = 'MUMBAI'
const DEFAULT_FILTERS: SearchFilters = {
  availableOnly: true,
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(DEFAULT_CITY)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [results, setResults] = useState<ParkingLot[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery('')
  }, [])

  const search = useCallback(async () => {
    setIsSearching(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('city', city)

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (filters.priceMin !== undefined) {
        params.append('priceMin', filters.priceMin.toString())
      }

      if (filters.priceMax !== undefined) {
        params.append('priceMax', filters.priceMax.toString())
      }

      if (filters.vehicleType) {
        params.append('vehicleType', filters.vehicleType)
      }

      if (filters.amenities && filters.amenities.length > 0) {
        params.append('amenities', filters.amenities.join(','))
      }

      if (filters.availableOnly) {
        params.append('availableOnly', 'true')
      }

      const response = await fetch(`/api/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      throw error
    } finally {
      setIsSearching(false)
    }
  }, [city, searchQuery, filters])

  const value: SearchContextType = {
    city,
    setCity,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    updateFilter,
    results,
    setResults,
    isSearching,
    search,
    clearFilters,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}
