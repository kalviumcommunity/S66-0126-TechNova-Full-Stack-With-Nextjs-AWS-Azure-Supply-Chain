'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function LoginPage() {
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
            <p className="text-gray-600 text-center mb-4">
              Login form with React Hook Form coming soon...
            </p>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
