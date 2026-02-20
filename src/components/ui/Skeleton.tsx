'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-300'

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width,
        height: height,
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Skeleton variant="rectangular" height={20} className="mb-3 w-3/4" />
      <Skeleton variant="rectangular" height={16} className="mb-2" />
      <Skeleton variant="rectangular" height={16} className="mb-4 w-1/2" />
      <div className="flex justify-between">
        <Skeleton variant="rectangular" height={24} className="w-20" />
        <Skeleton variant="rectangular" height={24} className="w-16" />
      </div>
    </div>
  )
}

export function ParkingLotCardSkeleton() {
  return <CardSkeleton />
}

export function ParkingLotsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ParkingLotCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton variant="rectangular" height={20} className="w-1/2" />
        <Skeleton variant="rectangular" height={24} className="w-16" />
      </div>
      <Skeleton variant="rectangular" height={16} className="mb-2" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton variant="rectangular" height={16} />
        <Skeleton variant="rectangular" height={16} />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rectangular" height={32} className="w-24" />
        <Skeleton variant="rectangular" height={32} className="w-24" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={48} className="mt-4" />
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton variant="rectangular" height={32} className="w-2/3 mb-2" />
        <Skeleton variant="rectangular" height={20} className="w-1/2" />
      </div>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={100} />
    </div>
  )
}
