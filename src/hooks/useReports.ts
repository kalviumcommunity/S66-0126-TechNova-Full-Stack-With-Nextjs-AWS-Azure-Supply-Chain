import useSWR from 'swr'
import { swrConfig, api } from '@/lib/swr-config'

export interface Report {
  id: string
  userId: string
  parkingLotId: string
  reportType: 'AVAILABILITY' | 'ISSUE' | 'SUGGESTION'
  description: string
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'REJECTED'
  createdAt: string
  updatedAt?: string
  parkingLotName?: string
}

export interface CreateReportData {
  parkingLotId: string
  reportType: 'AVAILABILITY' | 'ISSUE' | 'SUGGESTION'
  description: string
}

export function useReports(params?: {
  parkingLotId?: string
  status?: string
}) {
  const queryParams = new URLSearchParams()
  if (params?.parkingLotId)
    queryParams.append('parkingLotId', params.parkingLotId)
  if (params?.status) queryParams.append('status', params.status)
  const queryString = queryParams.toString()
  const key = queryString ? `/reports?${queryString}` : '/reports'

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => api.get(key) as Promise<any>,
    swrConfig
  )

  return {
    reports: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

export function useCreateReport() {
  const createReport = async (reportData: CreateReportData) => {
    const response = (await api.post('/reports', reportData)) as any
    return response.data
  }

  return { createReport }
}
