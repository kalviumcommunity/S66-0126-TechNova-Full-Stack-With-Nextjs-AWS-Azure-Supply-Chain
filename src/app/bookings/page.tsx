'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useBookings, Booking } from '@/hooks/useBookings'
import { BookingCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyStateBookings } from '@/components/ui/EmptyState'

export default function BookingsPage() {
  const { bookings, isLoading } = useBookings()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              View and manage your parking bookings
            </p>
          </div>
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        </div>
      </MainLayout>
    )
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
            {bookings.map((booking: Booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {booking.parkingLotName || 'Parking Lot'}
                    </CardTitle>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Spot Number</p>
                      <p className="font-semibold text-gray-900">
                        {booking.spotNumber || 'N/A'}
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
          <EmptyStateBookings />
        )}
      </div>
    </MainLayout>
  )
}
