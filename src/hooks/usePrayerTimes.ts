import { useState, useEffect } from 'react';

interface Masjid {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
}

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

export function usePrayerTimes(masjid: Masjid | null) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!masjid) {
      setPrayerTimes(null);
      return;
    }

    const fetchTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${masjid.lat}&longitude=${masjid.lng}&method=2&school=1`
        );

        if (!response.ok) throw new Error('Failed to fetch prayer times');

        const data = await response.json();
        if (data.data && data.data.timings) {
          setPrayerTimes(data.data.timings);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [masjid]);

  return {
    prayerTimes,
    loading,
    error
  };
}
        console.error('Error fetching prayer times:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimes()
  }, [masjid])

  return { prayerTimes, loading, error }
}
