# Deployment Guide for Awqat

This guide will help you deploy Awqat to GitHub Pages so you can access it anywhere and install it as an app on your homescreen.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js 18+ and npm

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `awqat`
3. Set it to **Public** (for GitHub Pages)
4. Click "Create repository"

## Step 2: Connect Your Local Repository

In the project directory, run:

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
git remote add origin https://github.com/YOUR_USERNAME/awqat.git
git branch -M main
git add .
git commit -m "Initial commit: Awqat PWA"
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/(root)**
4. Click **Save**

## Step 4: Deploy Your App

### Option A: Automatic Deployment (Recommended)

GitHub Actions workflows are already set up. Just push to `main`:

```bash
git add .
git commit -m "Deploy: Ready for production"
git push origin main
```

The app will build and deploy automatically in 2-3 minutes.

### Option B: Manual Deployment

Generate the gh-pages branch and deploy:

```bash
npm run deploy
```

## Step 5: Access Your App

After deployment, your app will be available at:

```
https://YOUR_USERNAME.github.io/awqat
```

Example: `https://saynashe.github.io/awqat`

## Step 6: Install on Your Device

### iOS (Safari)

1. Open `https://YOUR_USERNAME.github.io/awqat` in Safari
2. Tap the **Share** button (bottom center)
3. Scroll down and tap **Add to Home Screen**
4. Enter name (e.g., "Awqat") and tap **Add**

### Android (Chrome)

1. Open `https://YOUR_USERNAME.github.io/awqat` in Chrome
2. Tap the menu (⋮) → **Install app**
3. Tap **Install** in the popup
4. The app will appear on your home screen

### Desktop (Windows/Mac/Linux)

1. Open `https://YOUR_USERNAME.github.io/awqat` in Chrome, Edge, or Opera
2. Click the **install icon** in the address bar (slight ⬇️ arrow)
3. Click **Install**
4. The app appears in your Start Menu/Applications

## Step 7: Configure Your App

### Add Your Masjids

Edit `src/hooks/useMasjidFinder.ts` and add your masjids:

```typescript
const SAMPLE_MASJIDS: Masjid[] = [
  {
    id: 'masjid1',
    name: 'Islamic Center',
    lat: 40.7128,
    lng: -74.0060,
    address: 'New York, NY',
    phone: '+1-555-0123'
  },
  // Add more masjids...
]
```

### Customize Colors

Edit `vite.config.ts` to change the app theme:

```typescript
theme_color: '#667eea'        // Header color
background_color: '#ffffff'   // Background
```

Then redeploy:

```bash
git add .
git commit -m "Update masjids"
git push origin main
```

## Step 8: Verify Deployment

Check your deployment status:

1. Go to your GitHub repository
2. Click **Actions** tab
3. See the latest workflow run
4. Wait for the green checkmark ✅

## Troubleshooting

### GitHub Pages not showing up

- Wait 5-10 minutes after enabling Pages
- Check that the branch is set to `gh-pages`
- Ensure the repository is Public (not Private)

### App won't install on phone

- Make sure you're using HTTPS (GitHub Pages provides this)
- Check that manifest.json is accessible
- Try opening in Chrome/Samsung Internet on Android
- Try opening in Safari on iOS

### Build fails

Check the GitHub Actions logs:

```bash
# Or build locally to test
npm run build
```

### Map not showing

- Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify OpenStreetMap is accessible

## Making Updates

Every time you make changes:

```bash
# Make sure you're in the awqat directory
git add .
git commit -m "Description of changes"
git push origin main
```

The CI/CD will automatically build and deploy your changes.

## Custom Domain (Optional)

To use your own domain (e.g., awqat.yoursite.com):

1. Get a domain and DNS provider
2. Add DNS records pointing to GitHub Pages IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Go to repository **Settings → Pages → Custom domain**
4. Enter your domain and click **Save**

## Monitoring

### GitHub Actions

Check build status at: `github.com/YOUR_USERNAME/awqat/actions`

### Performance

Use Lighthouse to test your app:

1. Open DevTools (F12) in Chrome
2. Go to **Lighthouse** tab
3. Click **Analyze page load**

## Next Steps

1. ✅ Deploy to GitHub Pages
2. ✅ Install on your homescreen
3. 🎯 Add your own masjids
4. 🎨 Customize colors and branding
5. 📲 Share with your community
6. 🌍 Consider deploying on other services (Vercel, Netlify)

## Getting Help

- Check `.github/copilot-instructions.md` for detailed setup
- Review `README.md` for features and customization
- Check browser console (F12) for error messages
- Open an issue on GitHub

## Support

For problems with:
- **Deployment**: Check GitHub Actions logs
- **App features**: See README.md troubleshooting
- **PWA installation**: Check browser settings
- **Masjid data**: Edit `src/hooks/useMasjidFinder.ts`

---

**Congratulations! Your Awqat app is now live at:**
```
https://YOUR_USERNAME.github.io/awqat
```

🎉 Share it with your community!
