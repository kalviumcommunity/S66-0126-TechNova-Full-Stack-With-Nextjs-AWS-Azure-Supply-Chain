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

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const { error: showError, success: showSuccess } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits'
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
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      })
      showSuccess('Account created successfully!')
      router.push('/dashboard')
    } catch (err: any) {
      showError(err.message || 'Signup failed. Please try again.')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="John Doe"
                fullWidth
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                fullWidth
                required
              />

              <Input
                label="Phone (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="9876543210"
                helperText="10-digit mobile number"
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                placeholder="Minimum 6 characters"
                fullWidth
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
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
                Sign Up
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
