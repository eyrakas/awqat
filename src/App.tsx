import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Snackbar, Alert } from '@mui/material';
import PrayerTimes from './components/PrayerTimes';
import MasjidMap from './components/MasjidMap';
import MasjidList from './components/MasjidList';
import { usePermissions } from './hooks/usePermissions';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useMasjidFinder } from './hooks/useMasjidFinder';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

interface Masjid {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
}

function App() {
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const { permissionsGranted, requestPermissions } = usePermissions();
  const { prayerTimes, loading: prayerTimesLoading, error: prayerTimesError } = usePrayerTimes(selectedMasjid);
  const { masjids, loading: masjidsLoading, searchMasjids, findNearbyMasjids } = useMasjidFinder();

  useEffect(() => {
    if (permissionsGranted && !selectedMasjid) {
      // Auto-find nearby masjids when permissions are granted
      handleFindNearby();
    }
  }, [permissionsGranted]);

  const handleFindNearby = async () => {
    try {
      await findNearbyMasjids();
      setSnackbar({
        open: true,
        message: 'Found nearby masjids!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Could not find nearby masjids. Please check location permissions.',
        severity: 'error'
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      await searchMasjids(query);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Search failed. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!permissionsGranted) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <h1>Welcome to Awqat</h1>
            <p>To use this app, we need access to your location to find nearby masjids and send prayer time notifications.</p>
            <button
              onClick={requestPermissions}
              style={{
                padding: '12px 24px',
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Enable All Features
            </button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Awqat</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
            Prayer Times & Masjid Finder
          </p>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <PrayerTimes
              prayerTimes={prayerTimes}
              loading={prayerTimesLoading}
              error={prayerTimesError}
              selectedMasjid={selectedMasjid}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <MasjidList
              masjids={masjids}
              loading={masjidsLoading}
              selectedMasjid={selectedMasjid}
              onSelectMasjid={setSelectedMasjid}
              onSearch={handleSearch}
              onFindNearby={handleFindNearby}
              searchQuery={searchQuery}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, height: '400px' }}>
          <MasjidMap
            masjids={masjids}
            selectedMasjid={selectedMasjid}
            onSelectMasjid={setSelectedMasjid}
          />
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
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
