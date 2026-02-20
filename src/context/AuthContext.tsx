'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { AuthUser, UserRole } from '@/types/auth'

interface SignupData {
  email: string
  password: string
  name: string
  phone?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'parkpulse_access_token'
const REFRESH_TOKEN_KEY = 'parkpulse_refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch current user from token
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      // Decode JWT to get user info (simplified - in production use proper JWT decode)
      const payload = JSON.parse(atob(token.split('.')[1]))

      // TODO: Fetch full user details from API
      // For now, use payload data
      setUser({
        id: payload.userId,
        email: payload.email,
        name: payload.name || 'User',
        role: payload.role as UserRole,
        phone: payload.phone || null,
        createdAt: new Date(payload.iat * 1000),
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-fetch user on mount
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Login failed')
      }

      const data = await response.json()

      // Store tokens
      localStorage.setItem(TOKEN_KEY, data.data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken)

      // Fetch user data
      await fetchCurrentUser()
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  // Signup function
  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Signup failed')
      }

      const result = await response.json()

      // Store tokens
      localStorage.setItem(TOKEN_KEY, result.data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken)

      // Fetch user data
      await fetchCurrentUser()
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear tokens and user state regardless of API result
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setUser(null)
    }
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()

      // Update access token
      localStorage.setItem(TOKEN_KEY, data.data.accessToken)

      // Optionally update refresh token if rotated
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken)
      }

      await fetchCurrentUser()
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens and logout on refresh failure
      await logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
