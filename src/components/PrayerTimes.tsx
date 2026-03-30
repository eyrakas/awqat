import React from '@mui/material';
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from '@mui/material';

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

interface Props {
  prayerTimes: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  selectedMasjid: Masjid | null;
}

export default function PrayerTimes({ prayerTimes, loading, error, selectedMasjid }: Props) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            Error loading prayer times: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!prayerTimes || !selectedMasjid) {
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="textSecondary">
            Select a masjid to view prayer times
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const prayerNames = [
    { key: 'Fajr', name: 'Fajr' },
    { key: 'Sunrise', name: 'Sunrise' },
    { key: 'Dhuhr', name: 'Dhuhr' },
    { key: 'Asr', name: 'Asr' },
    { key: 'Sunset', name: 'Sunset' },
    { key: 'Maghrib', name: 'Maghrib' },
    { key: 'Isha', name: 'Isha' }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Prayer Times
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          {selectedMasjid.name}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {prayerNames.map(({ key, name }) => (
            <Grid item xs={6} key={key}>
              <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {name}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {prayerTimes[key as keyof PrayerTimesData]}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
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
