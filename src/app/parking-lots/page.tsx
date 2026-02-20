'use client'

import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useParkingLots, ParkingLot } from '@/hooks/useParkingLots'
import { ParkingLotsGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyStateSearch } from '@/components/ui/EmptyState'

export default function ParkingLotsPage() {
  const { parkingLots, isLoading, isError } = useParkingLots()

  const getAvailabilityBadge = (available: number, total: number) => {
    if (total === 0) return <Badge variant="occupied">No Data</Badge>
    const percentage = (available / total) * 100
    if (percentage === 0) return <Badge variant="occupied">Full</Badge>
    if (percentage < 20) return <Badge variant="reserved">Limited</Badge>
    return <Badge variant="available">Available</Badge>
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find Parking</h1>
            <p className="text-gray-600 mt-2">
              Discover available parking spots near you
            </p>
          </div>
          <ParkingLotsGridSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find Parking</h1>
            <p className="text-gray-600 mt-2">
              Discover available parking spots near you
            </p>
          </div>
          <EmptyStateSearch />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Parking</h1>
          <p className="text-gray-600 mt-2">
            Discover available parking spots near you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((lot: ParkingLot) => (
            <Link key={lot.id} href={`/parking-lots/${lot.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{lot.name}</CardTitle>
                    {getAvailabilityBadge(
                      lot.availableSpots || 0,
                      lot.totalSpots
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{lot.address}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {lot.availableSpots || 0}/{lot.totalSpots} spots
                      </span>
                      <span className="font-semibold text-blue-600">
                        ₹{lot.pricePerHour}/hr
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {parkingLots.length === 0 && <EmptyStateSearch />}
      </div>
    </MainLayout>
  )
}
