import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
  loading: boolean;
  selectedMasjid: Masjid | null;
  onSelectMasjid: (masjid: Masjid) => void;
  onSearch: (query: string) => void;
  onFindNearby: () => void;
  searchQuery: string;
}

export default function MasjidList({
  masjids,
  loading,
  selectedMasjid,
  onSelectMasjid,
  onSearch,
  onFindNearby,
  searchQuery
}: Props) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Masjids
        </Typography>

        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search masjids..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button type="submit" size="small">
                  <SearchIcon />
                </Button>
              ),
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={onFindNearby}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Find Nearby Masjids'}
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Box>
        ) : masjids.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">No masjids found</Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {masjids.map((masjid, index) => (
              <Box key={masjid.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => onSelectMasjid(masjid)}
                    selected={selectedMasjid?.id === masjid.id}
                  >
                    <LocationOnIcon sx={{ mr: 2, color: '#667eea' }} />
                    <ListItemText
                      primary={masjid.name}
                      secondary={masjid.address}
                    />
                  </ListItemButton>
                </ListItem>
                {index < masjids.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
