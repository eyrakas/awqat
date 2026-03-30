import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'
import './App.css'
import PrayerTimes from './components/PrayerTimes'
import MasjidMap from './components/MasjidMap'
import MasjidList from './components/MasjidList'
import { PermissionRequest } from './hooks/usePermissions'
import { usePrayerTimes } from './hooks/usePrayerTimes'
import { useMasjidFinder } from './hooks/useMasjidFinder'

interface Masjid {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  phone?: string
}

function App() {
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null)
  const [showMasjidDialog, setShowMasjidDialog] = useState(false)
  const [showPermissionRequest, setShowPermissionRequest] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'warning' | 'error' })
  const { prayerTimes, loading: loadingPrayerTimes } = usePrayerTimes(selectedMasjid)
  const { masjids, nearbyMasjids, searchMasjids } = useMasjidFinder()

  // Load saved masjid from localStorage on mount
  useEffect(() => {
    const permissionShown = localStorage.getItem('permissionShown')
    if (!permissionShown) {
      setShowPermissionRequest(true)
    } else {
      setShowPermissionRequest(false)
    }

    const saved = localStorage.getItem('selectedMasjid')
    if (saved) {
      try {
        setSelectedMasjid(JSON.parse(saved))
        setShowMasjidDialog(false)
      } catch (e) {
        console.error('Failed to load saved masjid:', e)
        setShowMasjidDialog(true)
      }
    } else {
      setShowMasjidDialog(true)
    }
  }, [])

  // Save selected masjid to localStorage
  useEffect(() => {
    if (selectedMasjid) {
      localStorage.setItem('selectedMasjid', JSON.stringify(selectedMasjid))
    }
  }, [selectedMasjid])

  const handleFindNearby = async () => {
    setLoading(true)
    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          reject
        )
      })
      
      const nearby = await nearbyMasjids(position.latitude, position.longitude, 5) // 5km radius
      
      if (nearby.length > 0) {
        setSelectedMasjid(nearby[0])
        setShowMasjidDialog(false)
        setSnackbar({ open: true, message: `Found ${nearby.length} nearby masjids`, severity: 'success' })
      } else {
        setSnackbar({ open: true, message: 'No masjids found nearby', severity: 'warning' })
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Could not get location', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const results = await searchMasjids(searchQuery)
      if (results.length > 0) {
        setSelectedMasjid(results[0])
        setShowMasjidDialog(false)
        setSearchQuery('')
        setSnackbar({ open: true, message: `Selected: ${results[0].name}`, severity: 'success' })
      } else {
        setSnackbar({ open: true, message: 'No masjids found', severity: 'warning' })
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Search failed', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeMasjid = () => {
    setShowMasjidDialog(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🕌 Awqat
          </Typography>
          {selectedMasjid && (
            <Button color="inherit" onClick={handleChangeMasjid} size="small">
              Change Masjid
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flexGrow: 1, py: 4, overflow: 'auto' }}>
        {showPermissionRequest ? (
          <Box sx={{ mt: 4 }}>
            <PermissionRequest
              onComplete={() => {
                setShowPermissionRequest(false)
                localStorage.setItem('permissionShown', 'true')
              }}
            />
          </Box>
        ) : selectedMasjid ? (
          <Box>
            <PrayerTimes masjid={selectedMasjid} loading={loadingPrayerTimes} />
            <Box sx={{ mt: 4 }}>
              <MasjidMap masjid={selectedMasjid} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              Select a Masjid to Get Prayer Times
            </Typography>
          </Box>
        )}
      </Container>

      {/* Masjid Selection Dialog */}
      <Dialog open={showMasjidDialog} onClose={() => setShowMasjidDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Masjid</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for a masjid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              fullWidth
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={handleFindNearby}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Nearby'}
            </Button>
          </Box>
          {!searchQuery && (
            <MasjidList
              masjids={masjids.slice(0, 10)}
              onSelectMasjid={(m) => {
                setSelectedMasjid(m)
                setShowMasjidDialog(false)
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMasjidDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default App
