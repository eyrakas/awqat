import { useState, useCallback, useEffect } from 'react';

export function usePermissions() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    // Check if permissions were already granted
    const granted = localStorage.getItem('permissionsGranted') === 'true';
    setPermissionsGranted(granted);
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      // Request location permission
      const locationPromise = new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { timeout: 5000 }
        );
      });

      // Request notification permission
      const notificationPromise = new Promise<boolean>((resolve) => {
        if ('Notification' in window) {
          Notification.requestPermission().then((permission) => {
            resolve(permission === 'granted');
          });
        } else {
          resolve(false);
        }
      });

      const [locationGranted, notificationGranted] = await Promise.all([
        locationPromise,
        notificationPromise
      ]);

      const allGranted = locationGranted && notificationGranted;
      setPermissionsGranted(allGranted);

      if (allGranted) {
        localStorage.setItem('permissionsGranted', 'true');
      }

      return allGranted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, []);

  return {
    permissionsGranted,
    requestPermissions
  };
}

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
