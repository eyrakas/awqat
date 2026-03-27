# Awqat PWA - Development & Deployment Guide

## Project Overview

**Awqat** is a Progressive Web App (PWA) for finding Islamic prayer times and locating nearby masjids. It features:

- ✨ Real-time prayer times via Aladhan API
- 📍 Geolocation-based masjid finder
- 🗺️ Interactive Leaflet maps
- 🔔 Push notifications for prayer times
- 📱 Native app installation (iOS, Android, Desktop)
- ⚡ Offline support via service workers
- 🚀 GitHub Pages deployment ready

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **UI Components**: Material-UI v5
- **Maps**: Leaflet + React-Leaflet
- **PWA**: vite-plugin-pwa
- **APIs**: Aladhan (prayer times), OpenStreetMap (maps)

## Project Structure

```
awqat/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml          # Auto-deploy to GitHub Pages
│   │   └── ci.yml              # TypeScript & build checks
│   └── copilot-instructions.md # This file
├── public/
│   ├── manifest.json           # PWA manifest & permissions
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── PrayerTimes.tsx      # Prayer times display
│   │   ├── MasjidMap.tsx        # Leaflet map integration
│   │   └── MasjidList.tsx       # Masjid list view
│   ├── hooks/
│   │   ├── usePermissions.ts    # Permission request handler
│   │   ├── usePrayerTimes.ts    # Fetch prayer times
│   │   └── useMasjidFinder.ts   # Masjid search & geolocation
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.ts               # Vite & PWA config
├── tsconfig.json                # TypeScript config
├── package.json
└── README.md
```

## Permissions & SKILLs

The app consolidates all permission requests into a single "Enable All Features" dialog that appears on first load:

1. **Geolocation** - For finding nearby masjids
2. **Notifications** - For prayer time reminders

These are declared in:
- `public/manifest.json` - PWA manifest permissions
- `src/hooks/usePermissions.ts` - Permission request UI
- `src/App.tsx` - Permission request flow

### How It Works

1. On first load, users see the `PermissionRequest` component
2. Clicking "Enable All Features" requests both geolocation and notifications at once
3. A flag is stored in localStorage to not show the dialog again
4. All subsequent permission prompts are eliminated from the app flow

## Development Setup

### Prerequisites

- Node.js 18+ with npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/awqat.git
cd awqat

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Output is in the `dist/` directory.

## Deployment to GitHub Pages

### Initial Setup

1. Create a GitHub repository named `awqat`
2. Update `package.json` homepage (if using a subdirectory):
   ```json
   "homepage": "https://yourusername.github.io/awqat"
   ```
3. Update `vite.config.ts` base if needed:
   ```typescript
   base: '/awqat/' // if deploying to subdirectory
   ```

### Manual Deploy

```bash
npm run deploy
```

### Automatic Deploy

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Builds the project on push to `main`
- Runs TypeScript checks
- Deploys to GitHub Pages

Just push to `main` and the app is live!

## Customization

### Adding Masjids

Edit `src/hooks/useMasjidFinder.ts`:

```typescript
const SAMPLE_MASJIDS: Masjid[] = [
  {
    id: 'unique-id',
    name: 'Masjid Name',
    lat: 40.7128,
    lng: -74.0060,
    address: 'Location',
    phone: '+1-555-0000'
  },
  // Add more...
]
```

### Customizing Colors & Theme

Update `vite.config.ts` manifest colors and Material-UI theme in components:

```typescript
theme_color: '#667eea'        // PWA header color
background_color: '#ffffff'   // PWA background
```

### Prayer Times Calculation Method

In `src/hooks/usePrayerTimes.ts`, the API endpoint uses:
- Method: 2 (ISNA - Islamic Society of North America)
- School: 1 (Hanafi)

Change these parameters for different calculation methods.

## Features

### Prayer Times

- Fetches from Aladhan API
- Displays: Fajr, Sunrise, Dhuhr, Asr, Sunset, Maghrib, Isha
- Auto-refreshes every minute
- Caches results for offline access (1 day via workbox)

### Masjid Finder

- **Search**: Find masjids by name or location
- **Nearby**: Uses geolocation to find masjids within 5km radius
- **Haversine formula**: Distance calculation
- **Map Integration**: View masjid location on interactive map

### Notifications

- Users can enable push notifications
- Integrated with browser's Web Push API
- Can be extended to send prayer time reminders

### Offline Support

Service worker caches:
- All app files (JS, CSS, HTML)
- Prayer times (1 day)
- Map tiles (1 week)

Works offline after initial load.

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Service Worker Not Registering
- Open DevTools → Application → Manifest
- Check that manifest.json is valid
- Ensure HTTPS (or localhost for dev)

### Map Not Showing
- Check that Leaflet CSS is imported in `MasjidMap.tsx`
- Verify OpenStreetMap is accessible
- Check browser console for errors

### Geolocation Not Working
- Ensure HTTPS (or localhost)
- Grant location permission when prompted
- Check system location services are enabled

## API References

### Aladhan API

```
GET https://api.aladhan.com/v1/timings/{day}-{month}-{year}
  ?latitude={lat}
  &longitude={lng}
  &method={2}
  &school={1}
```

Response includes prayer times in HH:MM format.

### OpenStreetMap / Leaflet

Open-source mapping with no API key required.

## Performance Optimizations

- ✅ Code splitting via Vite (Leaflet separate chunk)
- ✅ Lazy loading components
- ✅ Service worker caching
- ✅ Image optimization
- ✅ Runtime caching for APIs

## PWA Features

- ✅ Installable on homescreen
- ✅ Standalone mode (no browser UI)
- ✅ Offline support
- ✅ App shortcuts
- ✅ Auto-updates via service worker

## Security

- ✅ No API keys in code (Aladhan is free/public)
- ✅ HTTPS recommendations in manifest
- ✅ CSP-compatible (inline styles for Material-UI)
- ✅ No sensitive data stored locally

## License

MIT - Feel free to use and modify for your own projects.

## Support

- Fork and submit PRs for improvements
- Report issues on GitHub
- Contribute translations or features
