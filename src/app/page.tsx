'use client';

import { useParkingSpots } from '@/hooks/useParkingSpots';
import { Car, RefreshCw } from 'lucide-react';

export default function EmployeeDashboard() {
  const { spots, loading } = useParkingSpots();

  const availableCount = spots.filter((s) => s.status === 'AVAILABLE').length;
  const floors = Array.from(new Set(spots.map((s) => s.floor_level)));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
        <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6">
      <header className="mx-auto max-w-4xl pb-6">
        <h1 className="text-2xl font-bold">Valet Parking Tracker</h1>
        <p className="text-xs text-gray-400">Live Availability</p>
      </header>
      <main className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Available Spots</p>
            <p className="text-4xl font-extrabold text-cyan-400">{availableCount} / {spots.length}</p>
          </div>
          <Car className="h-10 w-10 text-cyan-400" />
        </div>
        {floors.map((floor) => (
          <div key={floor} className="rounded-xl bg-gray-900 p-5 border border-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Floor {floor}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {spots.filter((s) => s.floor_level === floor).map((spot) => (
                <div key={spot.id} className={`p-4 rounded-lg flex flex-col items-center border ${spot.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  <span className="text-lg font-bold">{spot.spot_number}</span>
                  <span className="text-[10px] font-semibold">{spot.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
