import { Card, CardContent, Typography, Box, Grid, CircularProgress, Button } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { useEffect, useState } from 'react'

interface Masjid {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface PrayerTimesData {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
}

interface Props {
  masjid: Masjid
  loading: boolean
}

export default function PrayerTimes({ masjid, loading }: Props) {
  const [times, setTimes] = useState<PrayerTimesData | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    fetchPrayerTimes()
    const interval = setInterval(fetchPrayerTimes, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [masjid])

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Date.now().toString().slice(0, -3)}?latitude=${masjid.lat}&longitude=${masjid.lng}&method=2&school=1`
      )
      const data = await response.json()
      if (data.data && data.data.timings) {
        setTimes(data.data.timings)
      }
    } catch (error) {
      console.error('Failed to fetch prayer times:', error)
    }
  }

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Notifications not supported')
      return
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true)
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
      }
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )
  }

  if (!times) {
    return (
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', mb: 3 }}>
        <CardContent>
          <Typography color="error">Failed to load prayer times</Typography>
        </CardContent>
      </Card>
    )
  }

  const prayerList = [
    { name: 'Fajr', time: times.Fajr },
    { name: 'Sunrise', time: times.Sunrise },
    { name: 'Dhuhr', time: times.Dhuhr },
    { name: 'Asr', time: times.Asr },
    { name: 'Sunset', time: times.Sunset },
    { name: 'Maghrib', time: times.Maghrib },
    { name: 'Isha', time: times.Isha }
  ]

  return (
    <Box>
      <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">{masjid.name}</Typography>
            <Button
              variant="outlined"
              startIcon={<NotificationsActiveIcon />}
              onClick={enableNotifications}
              size="small"
              color={notificationsEnabled ? 'success' : 'inherit'}
            >
              {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
            </Button>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {masjid.address}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {prayerList.map((prayer) => (
          <Grid item xs={6} sm={4} md={3} key={prayer.name}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {prayer.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {prayer.time}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
