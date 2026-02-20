'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function BookingsPage() {
  // Mock data - will be replaced with real API calls
  const bookings = [
    {
      id: '1',
      parkingLot: 'Phoenix Mall Parking',
      address: 'Lower Parel, Mumbai',
      spotNumber: 'A-42',
      startTime: '2024-02-20T10:00:00',
      endTime: '2024-02-20T14:00:00',
      status: 'ACTIVE',
      totalPrice: 200,
    },
    {
      id: '2',
      parkingLot: 'Bandra Station Parking',
      address: 'Bandra West, Mumbai',
      spotNumber: 'B-15',
      startTime: '2024-02-18T09:00:00',
      endTime: '2024-02-18T18:00:00',
      status: 'COMPLETED',
      totalPrice: 360,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>
      default:
        return <Badge variant="info">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            View and manage your parking bookings
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {booking.parkingLot}
                    </CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.address}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Spot Number</p>
                      <p className="font-semibold text-gray-900">
                        {booking.spotNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-semibold text-gray-900">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatDateTime(booking.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatDateTime(booking.endTime)}
                      </p>
                    </div>
                  </div>

                  {booking.status === 'ACTIVE' && (
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="danger" size="sm">
                        Cancel Booking
                      </Button>
                    </div>
                  )}

                  {booking.status === 'COMPLETED' && (
                    <div className="mt-4">
                      <Button variant="ghost" size="sm">
                        View Receipt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by finding a parking spot near you
              </p>
              <Button variant="primary">Find Parking</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
