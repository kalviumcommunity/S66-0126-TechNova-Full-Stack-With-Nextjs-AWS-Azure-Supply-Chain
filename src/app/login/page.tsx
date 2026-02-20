'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { error: showError, success: showSuccess } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await login(email, password)
      showSuccess('Login successful!')
      router.push('/dashboard')
    } catch (err: any) {
      showError(err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Login to ParkPulse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                fullWidth
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Login
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
