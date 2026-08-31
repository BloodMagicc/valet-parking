'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Spot {
  id: string;
  spot_number: string;
  floor_level: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export default function ValetDashboard() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpots();

    const channel = supabase
      .channel('spots-valet-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spots' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Spot;
            setSpots((prev) =>
              prev.map((spot) => (spot.id === updated.id ? updated : spot))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSpots = async () => {
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .order('spot_number', { ascending: true });

    if (!error && data) {
      setSpots(data);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';

    // Optimistic UI update
    setSpots((prev) =>
      prev.map((spot) => (spot.id === id ? { ...spot, status: newStatus } : spot))
    );

    const { error } = await supabase
      .from('spots')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update status:', error);
      fetchSpots(); // Rollback on error
    }
  };

  if (loading) {
    return <div className="p-8 text-white text-center">Loading Valet Dashboard...</div>;
  }

  // Group spots by floor/zone
  const zones = Array.from(new Set(spots.map((s) => s.floor_level)));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Valet Control Panel</h1>
            <p className="text-sm text-slate-400">Tap a spot to toggle between Available and Occupied</p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full">
            Live Mode
          </span>
        </header>

        {zones.map((zone) => (
          <div key={zone} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">{zone}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {spots
                .filter((spot) => spot.floor_level === zone)
                .map((spot) => {
                  const isAvailable = spot.status === 'AVAILABLE';
                  return (
                    <button
                      key={spot.id}
                      onClick={() => toggleStatus(spot.id, spot.status)}
                      className={`p-4 rounded-lg font-bold text-lg flex flex-col items-center justify-center transition-all active:scale-95 ${
                        isAvailable
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30'
                      }`}
                    >
                      <span>{spot.spot_number}</span>
                      <span className="text-xs font-normal mt-1 opacity-90">
                        {isAvailable ? 'AVAILABLE' : 'OCCUPIED'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
