'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function DashboardPage() {
  // Mock data
  const stats = [
    { label: 'Active Bookings', value: 1, color: 'text-blue-600' },
    { label: 'Total Bookings', value: 12, color: 'text-green-600' },
    { label: 'Saved Locations', value: 5, color: 'text-purple-600' },
    { label: 'Total Spent', value: '₹2,450', color: 'text-orange-600' },
  ]

  const recentBookings = [
    {
      id: '1',
      parkingLot: 'Phoenix Mall Parking',
      date: '2024-02-20',
      status: 'ACTIVE',
      amount: 200,
    },
    {
      id: '2',
      parkingLot: 'Bandra Station Parking',
      date: '2024-02-18',
      status: 'COMPLETED',
      amount: 360,
    },
  ]

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.parkingLot}
                    </p>
                    <p className="text-sm text-gray-600">{booking.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        booking.status === 'ACTIVE' ? 'success' : 'default'
                      }
                    >
                      {booking.status}
                    </Badge>
                    <p className="font-semibold text-gray-900">
                      ₹{booking.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
