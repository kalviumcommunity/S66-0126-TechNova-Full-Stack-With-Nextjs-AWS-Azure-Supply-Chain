'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AdminPage() {
  const stats = [
    { label: 'Total Parking Lots', value: 58 },
    { label: 'Total Spots', value: 4247 },
    { label: 'Active Bookings', value: 342 },
    { label: 'Revenue (Today)', value: '₹45,230' },
  ]

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Manage Parking Lots
                </h3>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove parking locations
                </p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  View Reports
                </h3>
                <p className="text-sm text-gray-600">
                  Access analytics and usage reports
                </p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  User Management
                </h3>
                <p className="text-sm text-gray-600">
                  Manage user accounts and permissions
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
