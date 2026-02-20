'use client'

import { SWRConfiguration } from 'swr'

const TOKEN_KEY = 'parkpulse_access_token'

const fetcher = async (url: string, options?: RequestInit) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = new Error('API request failed')

    try {
      const data = await response.json()
      ;(error as any).status = response.status
      ;(error as any).data = data
    } catch {
      ;(error as any).status = response.status
      ;(error as any).data = { error: { message: response.statusText } }
    }

    throw error
  }

  return response.json()
}

export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  loadingTimeout: 3000,
}

export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    fetcher(url, { ...options, method: 'GET' }) as Promise<T>,

  post: <T>(url: string, body: any, options?: RequestInit) =>
    fetcher(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }) as Promise<T>,

  put: <T>(url: string, body: any, options?: RequestInit) =>
    fetcher(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }) as Promise<T>,

  delete: <T>(url: string, options?: RequestInit) =>
    fetcher(url, { ...options, method: 'DELETE' }) as Promise<T>,
}

export default fetcher
