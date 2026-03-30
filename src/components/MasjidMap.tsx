import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icons for Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.setIcon(DefaultIcon);

interface Masjid {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
}

interface Props {
  masjids: Masjid[];
  selectedMasjid: Masjid | null;
  onSelectMasjid: (masjid: Masjid) => void;
}

export default function MasjidMap({ masjids, selectedMasjid, onSelectMasjid }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([40.7128, -74.0060], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => map.current!.removeLayer(marker));
    markersRef.current = [];

    // Add markers for all masjids
    masjids.forEach(masjid => {
      const marker = L.marker([masjid.lat, masjid.lng])
        .addTo(map.current!)
        .bindPopup(`<b>${masjid.name}</b><br>${masjid.address}`)
        .on('click', () => onSelectMasjid(masjid));

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (masjids.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [masjids, onSelectMasjid]);

  useEffect(() => {
    if (!map.current || !selectedMasjid) return;

    // Center map on selected masjid
    map.current.setView([selectedMasjid.lat, selectedMasjid.lng], 15);
  }, [selectedMasjid]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Masjid Locations
        </Typography>
        <div
          ref={mapContainer}
          style={{
            height: '400px',
            width: '100%',
            borderRadius: '8px'
          }}
        />
      </CardContent>
    </Card>
  );
}
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
