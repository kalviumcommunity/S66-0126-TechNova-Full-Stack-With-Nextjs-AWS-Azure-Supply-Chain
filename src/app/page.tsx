export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          ParkPulse
        </h1>
        <p className="text-center text-lg mb-4">
          Smart Parking Discovery Platform for Indian Cities
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Real-time Availability</h2>
            <p>Find available parking spots in real-time across Mumbai, Delhi, Bangalore, Pune, and Chennai</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">IoT Sensors</h2>
            <p>Live data from IoT sensors for accurate parking spot detection</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Crowd-sourced Reports</h2>
            <p>Community-driven parking availability updates</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Smart Predictions</h2>
            <p>AI-powered predictions for parking availability</p>
          </div>
        </div>
      </div>
    </main>
  )
}
