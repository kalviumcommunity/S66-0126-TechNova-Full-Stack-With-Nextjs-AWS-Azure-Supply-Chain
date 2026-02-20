'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ParkingLotDetailPageProps {
  params: {
    id: string
  }
}

export default function ParkingLotDetailPage({
  params,
}: ParkingLotDetailPageProps) {
  // Mock data - will be replaced with real API call
  const parkingLot = {
    id: params.id,
    name: 'Phoenix Mall Parking',
    address: 'High Street Phoenix, 462, Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    latitude: 19.0014,
    longitude: 72.8311,
    totalSpots: 100,
    availableSpots: 45,
    pricePerHour: 50,
    amenities: [
      '24/7 Security',
      'CCTV Surveillance',
      'Covered Parking',
      'EV Charging',
    ],
    description:
      'Secure covered parking facility at Phoenix Mall with 24/7 security and CCTV surveillance.',
  }

  const getAvailabilityPercentage = () => {
    return Math.round((parkingLot.availableSpots / parkingLot.totalSpots) * 100)
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {parkingLot.name}
          </h1>
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
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
            <span>
              {parkingLot.address}, {parkingLot.city}
            </span>
          </div>
        </div>

        {/* Availability Card */}
        <Card className="mb-6" variant="elevated">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold text-blue-600">
                  {parkingLot.availableSpots}
                </div>
                <div className="text-sm text-gray-600">Available Spots</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-gray-900">
                  {parkingLot.totalSpots}
                </div>
                <div className="text-sm text-gray-600">Total Spots</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${getAvailabilityPercentage()}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge
                variant={
                  parkingLot.availableSpots > 20
                    ? 'available'
                    : parkingLot.availableSpots > 0
                      ? 'reserved'
                      : 'occupied'
                }
              >
                {parkingLot.availableSpots > 20
                  ? 'Available'
                  : parkingLot.availableSpots > 0
                    ? 'Limited'
                    : 'Full'}
              </Badge>
              <div className="text-2xl font-bold text-gray-900">
                ₹{parkingLot.pricePerHour}
                <span className="text-base text-gray-600">/hr</span>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth className="mt-6">
              Book Now
            </Button>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{parkingLot.description}</p>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parkingLot.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map integration coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
