# 📋 Awqat Project - Complete SKILLs & Permissions Guide

## Overview

Your Awqat PWA is fully set up with **consolidated permission requests**. Instead of multiple permission dialogs, the app shows ONE unified dialog on first load asking for:

1. **📍 Location Access** - For finding nearby masjids
2. **🔔 Notifications** - For prayer time reminders

Once accepted, the app never asks for permissions again.

---

## 🎯 SKILLs & Permission Implementation

### 1. **usePermissions Hook** (`src/hooks/usePermissions.ts`)

**Purpose**: Manages all permission requests and state

**What it does**:
- `PermissionRequest` component - Shows the unified permission dialog
- `usePermissions` hook - Tracks permission status
- Consolidates geolocation + notifications into one request
- Stores permission state in localStorage

**Key Features**:
```typescript
// Requests BOTH permissions at once
const handleRequestAll = async () => {
  // Geolocation request
  navigator.geolocation.getCurrentPosition(...)
  
  // Notification request
  Notification.requestPermission()
}
```

**Files Related**:
- `src/hooks/usePermissions.ts` - Permission handler

---

### 2. **PWA Manifest Permissions** (`public/manifest.json`)

**Purpose**: Declares permissions for the PWA to the OS

**Declared permissions**:
```json
{
  "permissions": [
    "geolocation",
    "notifications"
  ]
}
```

**What it enables**:
- App requests location in background
- OS allows notification scheduling
- Presets permissions on installation

**Files Related**:
- `public/manifest.json` - PWA configuration

---

### 3. **App Initialization** (`src/App.tsx`)

**Purpose**: Manages permission dialog flow

**When it shows**:
- On first app load (localStorage flag check)
- Only shown ONCE (flag stored after completion)
- Modal dialog that blocks other UI

**How it works**:
```typescript
const [showPermissionRequest, setShowPermissionRequest] = useState(true)

useEffect(() => {
  const permissionShown = localStorage.getItem('permissionShown')
  if (!permissionShown) {
    setShowPermissionRequest(true)  // Show dialog
  }
})

// User clicks "Enable All Features"
onComplete={() => {
  setShowPermissionRequest(false)
  localStorage.setItem('permissionShown', 'true')  // Never show again
}}
```

**Files Related**:
- `src/App.tsx` - Main component with permission flow

---

## 📍 Geolocation Permission

### Where It's Used:
- **`src/App.tsx`** - "Nearby" button requests user location
- **`src/hooks/useMasjidFinder.ts`** - Calculates distance to masjids

### How It Works:
```typescript
// Request on-demand (after initial permission grant)
const handleFindNearby = async () => {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      reject
    )
  })
  
  // Use position to find nearby masjids
  const nearby = await nearbyMasjids(
    position.latitude, 
    position.longitude, 
    5 // 5km radius
  )
}
```

### Permission Status:
- ✅ Requested upfront via "Enable All Features"
- ✅ Never requested again (if denied, user must enable manually)
- ✅ Used for "Find Nearby" functionality

---

## 🔔 Notifications Permission

### Where It's Used:
- **`src/components/PrayerTimes.tsx`** - "Enable Notifications" button
- **`src/hooks/usePermissions.ts`** - Requested upfront

### How It Works:
```typescript
// Check if notifications enabled
if (Notification.permission === 'granted') {
  // Can send notifications
  new Notification('Dhuhr Prayer', {
    body: 'Prayer time: 12:30 PM',
    icon: '/icon-192.png'
  })
}
```

### Permission States:
```
granted  → User allowed notifications
denied   → User denied notifications
default  → User hasn't been asked yet
```

### Permission Status:
- ✅ Requested upfront via "Enable All Features"
- ✅ Users can enable in settings after
- ⏳ Notification sending ready (extend with backend)

---

## 🔐 How to Handle Permissions

### For Users

1. **On First Load**: See "Enable All Features" dialog
   - Location: "Find masjids nearby your location"
   - Notifications: "Get prayer time reminders"

2. **Choose to Allow or Skip**:
   - Allow: Get full features
   - Deny: App still works for basic features

3. **Stored Permissions**: Never asked again
   - `localStorage.permissionShown = 'true'`

4. **Change Permissions Later**: Via device settings
   - iOS: Settings → [App] → Notifications/Location
   - Android: App Settings → Permissions

### For Developers

**To add a new permission:**

1. Add to `src/hooks/usePermissions.ts`:
```typescript
// Request permission
const permission = await navigator.permissions.query({ name: 'permission-name' })
```

2. Add to `public/manifest.json`:
```json
"permissions": [
  "geolocation",
  "notifications",
  "your-new-permission"
]
```

3. Update `PermissionRequest` UI to show it

**To skip permission requests:**
```typescript
// Simply don't call requestPermissions()
// User can enable manually in settings
```

---

## 📁 Permission-Related Files

```
Awqat/
├── src/
│   ├── App.tsx                      # Permission flow control
│   ├── hooks/
│   │   ├── usePermissions.ts        # Permission handler (MAIN SKILL)
│   │   ├── usePrayerTimes.ts        # Uses notifications
│   │   └── useMasjidFinder.ts       # Uses geolocation
│   └── components/
│       ├── PrayerTimes.tsx          # Notification button
│       └── MasjidMap.tsx
│
├── public/
│   └── manifest.json                # Declares permissions
│
└── index.html                       # PWA meta tags
```

---

## 🚀 Testing Permissions

### Test Locally

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. See "Enable All Features" dialog
3. Click it and approve permissions
4. Refresh page - dialog won't appear again
5. Check localStorage:
   ```javascript
   localStorage.getItem('permissionShown') // 'true'
   ```

### Reset for Testing

```javascript
// In browser console
localStorage.removeItem('permissionShown')
location.reload()
```

### Test on Device

1. Deploy to GitHub Pages
2. Open on phone
3. Install as app
4. Test permission dialog
5. Test features (find nearby, notifications)

---

## ✅ Permission Status Checklist

### Implemented ✅
- [x] Geolocation permission request
- [x] Notification permission request
- [x] Consolidated into one dialog
- [x] localStorage persistence
- [x] No repeated prompts
- [x] Graceful fallback if denied
- [x] PWA manifest declarations
- [x] iOS & Android support

### Optional Enhancements 🔄
- [ ] Permission status display UI
- [ ] Manual permission reset option
- [ ] Different prompts per permission
- [ ] Background geolocation
- [ ] Service worker notifications
- [ ] Sound notifications
- [ ] Custom notification icons

### Not Implemented 🚫
- [ ] Scheduled notifications (needs backend)
- [ ] Camera/Microphone (not needed)
- [ ] Clipboard access (not needed)
- [ ] Payment request (not needed)

---

## 🔍 Troubleshooting Permissions

### Dialog Not Showing
```javascript
// Check if already shown
localStorage.permissionShown // Should be 'true'

// Reset to show again
localStorage.removeItem('permissionShown')
```

### Location Not Working
- ✅ Check browser location is enabled
- ✅ System location services enabled
- ✅ Using HTTPS or localhost
- ✅ Device has location hardware

### Notifications Not Working
- ✅ Notification permission granted
- ✅ Browser notifications enabled
- ✅ System notifications enabled
- ✅ Testing in actual PWA (not just browser)

### Permissions Denied Permanently
```javascript
// Check status
Notification.permission // 'denied'

// User must manually reset in settings
// No programmatic way to recover
```

---

## 📱 Device Installation Permissions

### iOS
```
Safari → Share → Add to Home Screen
  ↓
Once installed, has:
  ✅ Location access
  ✅ Notification permission
```

### Android
```
Chrome → Install app → Install
  ↓
Once installed, has:
  ✅ Location access
  ✅ Notification permission
```

### Desktop
```
Chrome/Edge → Install app
  ↓
Once installed, has:
  ✅ Location access
  ✅ Notification permission
```

---

## 📞 Summary

Your Awqat app has **ONE unified permission request** that covers:

1. **📍 Location** - "Find masjids nearby your location"
2. **🔔 Notifications** - "Get prayer time reminders"

**Result**: Users only see ONE dialog, click once, and grant both permissions.

**No repeated "Allow" prompts** = Better UX! ✨

---

## Next Steps

1. ✅ Permissions are set up!
2. 🔨 Deploy to GitHub
3. 📲 Install on your device
4. 🎉 Enjoy no permission popups!

---

**Questions?** Check `DEPLOYMENT.md` for setup or `README.md` for features.
