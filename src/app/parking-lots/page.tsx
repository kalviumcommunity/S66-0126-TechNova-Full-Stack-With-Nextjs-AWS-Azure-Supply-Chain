'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function ParkingLotsPage() {
  // Mock data - will be replaced with real API calls
  const parkingLots = [
    {
      id: '1',
      name: 'Phoenix Mall Parking',
      address: 'Lower Parel, Mumbai',
      city: 'MUMBAI',
      pricePerHour: 50,
      availableSpots: 45,
      totalSpots: 100,
      distance: '1.2 km',
    },
    {
      id: '2',
      name: 'Bandra Station Parking',
      address: 'Bandra West, Mumbai',
      city: 'MUMBAI',
      pricePerHour: 40,
      availableSpots: 12,
      totalSpots: 80,
      distance: '2.5 km',
    },
    {
      id: '3',
      name: 'Andheri Metro Parking',
      address: 'Andheri East, Mumbai',
      city: 'MUMBAI',
      pricePerHour: 30,
      availableSpots: 0,
      totalSpots: 60,
      distance: '3.8 km',
    },
  ]

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage === 0) return <Badge variant="occupied">Full</Badge>
    if (percentage < 20) return <Badge variant="reserved">Limited</Badge>
    return <Badge variant="available">Available</Badge>
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

        {/* TODO: Add search and filter controls */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Search and filter controls coming soon...
          </p>
        </div>

        {/* Parking Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((lot) => (
            <Card
              key={lot.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{lot.name}</CardTitle>
                  {getAvailabilityBadge(lot.availableSpots, lot.totalSpots)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    <span>{lot.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {lot.availableSpots}/{lot.totalSpots} spots
                    </span>
                    <span className="font-semibold text-blue-600">
                      ₹{lot.pricePerHour}/hr
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    {lot.distance} away
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {parkingLots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No parking lots found</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
