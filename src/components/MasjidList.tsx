import { List, ListItem, ListItemButton, ListItemText, Divider, Box, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface Masjid {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  phone?: string
}

interface Props {
  masjids: Masjid[]
  onSelectMasjid: (masjid: Masjid) => void
}

export default function MasjidList({ masjids, onSelectMasjid }: Props) {
  if (masjids.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">No masjids found</Typography>
      </Box>
    )
  }

  return (
    <List sx={{ maxHeight: '400px', overflow: 'auto', background: '#f5f5f5', borderRadius: 1 }}>
      {masjids.map((masjid, index) => (
        <Box key={masjid.id}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onSelectMasjid(masjid)}>
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
  )
}
