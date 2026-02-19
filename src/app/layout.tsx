import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ParkPulse - Smart Parking Discovery',
  description: 'Real-time parking availability for Indian cities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
