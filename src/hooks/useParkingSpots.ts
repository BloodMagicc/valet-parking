'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Spot {
  id: string;
  spot_number: string;
  floor_level: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export function useParkingSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpots = async () => {
      const { data } = await supabase.from('spots').select('*').order('spot_number', { ascending: true });
      if (data) setSpots(data as Spot[]);
      setLoading(false);
    };

    fetchSpots();

    const channel = supabase
      .channel('realtime_spots')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'spots' }, (payload) => {
        const updated = payload.new as Spot;
        setSpots((prev) => prev.map((spot) => (spot.id === updated.id ? updated : spot)));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleSpotStatus = async (spotId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    
    setSpots((prev) => prev.map((s) => (s.id === spotId ? { ...s, status: nextStatus } : s)));

    await supabase.from('spots').update({ status: nextStatus }).eq('id', spotId);
  };

  return { spots, loading, toggleSpotStatus };
}
