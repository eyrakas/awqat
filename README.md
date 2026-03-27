# Awqat - Islamic Prayer Times & Masjid Finder PWA

> A modern Progressive Web App for finding accurate prayer times and locating nearby masjids.

![Built with React](https://img.shields.io/badge/Built%20with-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![PWA](https://img.shields.io/badge/Type-PWA-green)
![License MIT](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🕌 **Prayer Times** - Real-time prayer times via Aladhan API
- 📍 **Find Masjids** - Search or find masjids near your location
- 🗺️ **Interactive Maps** - View masjid locations with Leaflet maps
- 🔔 **Notifications** - Get prayer time reminders (when enabled)
- 📱 **Install App** - Add to homescreen on any device
- ⚡ **Offline Ready** - Works offline with service worker caching
- 🎨 **Material Design** - Modern, responsive UI
- 🚀 **Fast & Lightweight** - Optimized with Vite

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### GitHub Pages (Recommended)

1. **Setup repository**
   ```bash
   git clone https://github.com/yourusername/awqat.git
   cd awqat
   npm install
   git push
   ```

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

3. **Deploy automatically**
   ```bash
   npm run deploy
   ```

   OR let GitHub Actions do it automatically on push to `main`

4. **Access your app**
   - `https://yourusername.github.io/awqat`

### Other Hosting

Deploy the `dist/` folder to any static host:
- Vercel
- Netlify
- AWS S3
- Azure Static Web Apps
- Firebase Hosting

## 📱 Install on Homescreen

### iOS (Safari)
1. Open the app
2. Tap Share → Add to Home Screen
3. Tap Add

### Android (Chrome)
1. Open the app
2. Tap ⋮ → Install app
3. Tap Install

### Desktop (PWA)
1. Open in Chrome/Edge/Opera
2. Click install icon in address bar
3. Click Install

## 🔧 Configuration

### Add Your Masjids

Edit `src/hooks/useMasjidFinder.ts`:

```typescript
const SAMPLE_MASJIDS: Masjid[] = [
  {
    id: 'id1',
    name: 'Your Masjid',
    lat: 40.7128,
    lng: -74.0060,
    address: 'Your Address',
    phone: '+1-555-0000'
  }
]
```

### Customize App Name & Colors

Edit `vite.config.ts`:
```typescript
theme_color: '#667eea'      // Header color
background_color: '#ffffff' // Background
```

Update `public/manifest.json` for app name and description.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── PrayerTimes.tsx  # Prayer times display
│   ├── MasjidMap.tsx    # Interactive map
│   └── MasjidList.tsx   # Masjid list
├── hooks/               # Custom hooks
│   ├── usePermissions.ts    # Permission handling
│   ├── usePrayerTimes.ts    # Fetch prayer times
│   └── useMasjidFinder.ts   # Search & location
├── App.tsx              # Main component
└── main.tsx             # Entry point
```

## 🔐 Permissions

The app requests two permissions on first load:

1. **Location** - Find masjids near you
2. **Notifications** - Prayer time reminders

Users can grant or deny both at once via the "Enable All Features" button.

## 🌐 APIs Used

- **Aladhan API** - Prayer times calculation (no auth required)
- **OpenStreetMap** - Map tiles via Leaflet
- **Browser Geolocation API** - User location
- **Web Push API** - Notifications

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+
- ✅ Edge 90+
- ✅ Opera 76+

## 🎯 Prayer Times Calculation

- **Method**: ISNA (Islamic Society of North America)
- **School**: Hanafi
- **Source**: Aladhan API v1

Modify in `src/hooks/usePrayerTimes.ts` to use different methods.

## 🔄 Offline Support

Service worker automatically caches:
- All app files (JS, CSS, HTML)
- Prayer times (24 hours)
- Map tiles (7 days)

App works offline after first load.

## 🚀 Optional: Enable PWA Notifications

To send prayer time notifications, implement a backend service or use Firebase Cloud Messaging:

```typescript
// Send notification example
new Notification('Dhuhr Prayer', {
  body: 'Dhuhr prayer time is 12:30 PM',
  icon: '/icon-192.png'
})
```

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run deploy       # Deploy to GitHub Pages
```

## 📝 Customization Ideas

- Add multiple language support
- Implement backend database for masjids
- Add prayer reminders with sound
- Create admin panel for managing masjids
- Add Dark mode theme
- Calendar view for prayer times
- Share prayer times on social media
- Integration with mosque apps

## 🐛 Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Service worker not working:**
- Check manifest.json is accessible at `/manifest.json`
- Ensure HTTPS (or localhost for development)
- Clear browser cache

**Map not displaying:**
- Verify OpenStreetMap is accessible
- Check browser console for errors
- Ensure Leaflet CSS is loaded

**Geolocation disabled:**
- Enable location access in browser settings
- Use HTTPS (or localhost)
- Check OS location settings

## 📄 License

MIT License - Free to use, modify, and distribute

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing discussions
- See troubleshooting section above

---

**Made with ❤️ for the Muslim community**

Find prayer times • Locate masjids • Connect with community
