'use client';

import { useParkingSpots } from '@/hooks/useParkingSpots';
import { RefreshCw } from 'lucide-react';

export default function ValetControlPanel() {
  const { spots, loading, toggleSpotStatus } = useParkingSpots();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-white">
      <header className="mb-6 rounded-xl bg-gray-900 p-4 border border-gray-800">
        <h1 className="text-xl font-bold text-amber-400">Valet Controller</h1>
        <p className="text-xs text-gray-400">Tap to toggle availability</p>
      </header>
      <main className="grid grid-cols-2 gap-4">
        {spots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => toggleSpotStatus(spot.id, spot.status)}
            className={`h-32 rounded-2xl border-2 flex flex-col items-center justify-center font-bold text-xl ${
              spot.status === 'AVAILABLE' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-red-500/50 bg-red-500/10 text-red-400'
            }`}
          >
            {spot.spot_number}
            <span className="text-xs font-normal mt-1">{spot.status}</span>
          </button>
        ))}
      </main>
    </div>
  );
}