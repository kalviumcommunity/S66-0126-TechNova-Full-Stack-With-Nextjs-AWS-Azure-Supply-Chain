import { api } from './swr-config'
import { ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return api.get<ApiResponse<T>>(this.getUrl(endpoint))
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return api.post<ApiResponse<T>>(this.getUrl(endpoint), data)
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return api.put<ApiResponse<T>>(this.getUrl(endpoint), data)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return api.delete<ApiResponse<T>>(this.getUrl(endpoint))
  }
}

export const apiClient = new ApiClient()

export const parkingLotsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return api.get<any[]>(`/parking-lots${queryString}`)
  },

  getById: (id: string) => api.get<any>(`/parking-lots/${id}`),

  create: (data: any) => api.post<any>('/parking-lots', data),

  update: (id: string, data: any) => api.put<any>(`/parking-lots/${id}`, data),

  delete: (id: string) => api.delete<any>(`/parking-lots/${id}`),

  getSpots: (id: string) => api.get<any[]>(`/parking-lots/${id}/spots`),
}

export const bookingsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return api.get<any[]>(`/bookings${queryString}`)
  },

  getById: (id: string) => api.get<any>(`/bookings/${id}`),

  create: (data: any) => api.post<any>('/bookings', data),

  update: (id: string, data: any) => api.put<any>(`/bookings/${id}`, data),

  cancel: (id: string) =>
    api.put<any>(`/bookings/${id}`, { status: 'CANCELLED' }),
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password,
    }),

  signup: (data: {
    email: string
    password: string
    name: string
    phone?: string
  }) =>
    api.post<{ accessToken: string; refreshToken: string }>(
      '/auth/signup',
      data
    ),

  logout: (refreshToken: string) =>
    api.post<{ message: string }>('/auth/logout', { refreshToken }),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken?: string }>('/auth/refresh', {
      refreshToken,
    }),
}

export const reportsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return api.get<any[]>(`/reports${queryString}`)
  },

  create: (data: any) => api.post<any>('/reports', data),
}

export const searchApi = {
  search: (params: Record<string, string>) => {
    const queryString = '?' + new URLSearchParams(params).toString()
    return api.get<any[]>(`/search${queryString}`)
  },
}
