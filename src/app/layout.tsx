import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { UIProvider } from '@/context/UIContext'
import { SearchProvider } from '@/context/SearchContext'

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
      <body>
        <AuthProvider>
          <UIProvider>
            <SearchProvider>{children}</SearchProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
