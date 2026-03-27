import { Card, CardContent, Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icons for Vite
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.setIcon(DefaultIcon)

interface Masjid {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface Props {
  masjid: Masjid
}

export default function MasjidMap({ masjid }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(
        [masjid.lat, masjid.lng],
        15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current)
    } else {
      // Update map center and marker
      map.current.setView([masjid.lat, masjid.lng], 15)
    }

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer)
      }
    })

    // Add marker for masjid
    L.marker([masjid.lat, masjid.lng], { icon: DefaultIcon })
      .bindPopup(
        `<div>
          <strong>${masjid.name}</strong><br/>
          ${masjid.address}
        </div>`
      )
      .addTo(map.current)
      .openPopup()

    return () => {
      // Cleanup if needed
    }
  }, [masjid])

  return (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
      <CardContent>
        <Box
          ref={mapContainer}
          sx={{
            height: '400px',
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
      </CardContent>
    </Card>
  )
}
