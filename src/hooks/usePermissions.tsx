import { useState, useCallback, useEffect } from 'react'
import { Box, Button, Card, CardContent, Typography, Alert } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

interface PermissionStatus {
  location: PermissionState | null
  notification: PermissionState | null
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: null,
    notification: null
  })
  const [requested, setRequested] = useState(false)

  const checkPermissions = useCallback(async () => {
    try {
      // Check location permission
      const locationPerm = await navigator.permissions?.query?.({ name: 'geolocation' })
      // Check notification permission
      const notificationPerm = Notification.permission as PermissionState

      const nextPermissions = {
        location: locationPerm?.state || null,
        notification: notificationPerm
      }

      setPermissions(nextPermissions)

      // If permissions are already granted, mark as done (avoid repeated prompt)
      if (nextPermissions.location === 'granted' && nextPermissions.notification === 'granted') {
        localStorage.setItem('permissionShown', 'true')
      }
    } catch (err) {
      console.error('Error checking permissions:', err)
    }
  }, [])

  const requestPermissions = useCallback(async () => {
    try {
      // Request location
      await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          reject,
          { timeout: 5000 }
        )
      }).catch(() => null) // Silently fail if user denies

      // Request notification permission
      if ('Notification' in window) {
        await Notification.requestPermission()
      }

      await checkPermissions()
      setRequested(true)
      localStorage.setItem('permissionShown', 'true')
    } catch (err) {
      console.error('Error requesting permissions:', err)
      setRequested(true)
      localStorage.setItem('permissionShown', 'true')
    }
  }, [checkPermissions])

  return { permissions, requested, requestPermissions, checkPermissions }
}

interface Props {
  onComplete: () => void
}

export function PermissionRequest({ onComplete }: Props): JSX.Element {
  const { permissions, requestPermissions, checkPermissions } = usePermissions()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-complete if already granted
    if (permissions.location === 'granted' && permissions.notification === 'granted') {
      localStorage.setItem('permissionShown', 'true')
      onComplete()
    }
  }, [permissions, onComplete])

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  const handleRequestAll = async () => {
    setLoading(true)
    await requestPermissions()
    setLoading(false)
    onComplete()
  }

  return (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          📍 Enable Features
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Grant permissions once to enable all features
        </Alert>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOnIcon sx={{ mr: 2, color: '#667eea' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Location Access
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Find masjids nearby your location
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <NotificationsActiveIcon sx={{ mr: 2, color: '#667eea' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Notifications
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Get prayer time reminders
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={handleRequestAll}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textTransform: 'none'
          }}
        >
          {loading ? 'Requesting...' : 'Enable All Features'}
        </Button>
      </CardContent>
    </Card>
  )
}
