import { useState, useEffect } from 'react'

interface Masjid {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  phone?: string
}

// Sample masjid data - in production, this would come from a database
const SAMPLE_MASJIDS: Masjid[] = [
  {
    id: '1',
    name: 'Islamic Center of America',
    lat: 42.3316,
    lng: -83.0458,
    address: 'Dearborn, Michigan, USA',
    phone: '+1 313-555-0123'
  },
  {
    id: '2',
    name: 'Islamic Society of Orange County',
    lat: 33.7298,
    lng: -117.8253,
    address: 'Garden Grove, California, USA',
    phone: '+1 714-555-0456'
  },
  {
    id: '3',
    name: 'ISNA - Islamic Society of North America',
    lat: 39.9526,
    lng: -86.0623,
    address: 'Indianapolis, Indiana, USA',
    phone: '+1 317-555-0789'
  },
  {
    id: '4',
    name: 'East London Mosque',
    lat: 51.5186,
    lng: -0.0449,
    address: 'London, United Kingdom',
    phone: '+44 20-7555-0123'
  },
  {
    id: '5',
    name: 'Dubai Grand Mosque',
    lat: 25.2048,
    lng: 55.2708,
    address: 'Dubai, United Arab Emirates',
    phone: '+971 4-555-0456'
  },
  {
    id: '6',
    name: 'Al-Haramain Mosque',
    lat: 24.7136,
    lng: 46.6753,
    address: 'Riyadh, Saudi Arabia',
    phone: '+966 11-555-0789'
  }
]

export function useMasjidFinder() {
  const [masjids] = useState<Masjid[]>(SAMPLE_MASJIDS)

  const searchMasjids = async (query: string): Promise<Masjid[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = masjids.filter(
          (m) =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.address.toLowerCase().includes(query.toLowerCase())
        )
        resolve(results)
      }, 300)
    })
  }

  const nearbyMasjids = async (
    lat: number,
    lng: number,
    radiusKm: number = 5
  ): Promise<Masjid[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nearby = masjids
          .map((m) => ({
            masjid: m,
            distance: calculateDistance(lat, lng, m.lat, m.lng)
          }))
          .filter((item) => item.distance <= radiusKm)
          .sort((a, b) => a.distance - b.distance)
          .map((item) => item.masjid)

        resolve(nearby)
      }, 500)
    })
  }

  return {
    masjids,
    searchMasjids,
    nearbyMasjids
  }
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
