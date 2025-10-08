# Deployment Guide

## Option 1: Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Add environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
7. Click "Deploy"

### Environment Variables Setup
In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add each Firebase variable with your actual values
3. Redeploy the project

## Option 2: Netlify

### Prerequisites
- GitHub account
- Netlify account (free at netlify.com)

### Steps
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site settings → Environment variables
7. Click "Deploy site"

## Option 3: Firebase Hosting

### Prerequisites
- Firebase project set up
- Node.js installed

### Steps
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build your app: `npm run build`
5. Deploy: `firebase deploy`

## Option 4: GitHub Pages

### Prerequisites
- GitHub repository
- GitHub Pages enabled

### Steps
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Deploy: `npm run deploy`

## Environment Variables

Create a `.env` file for local development:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Post-Deployment Checklist

1. ✅ Test authentication (sign up/sign in)
2. ✅ Test family creation and joining
3. ✅ Test task creation and completion
4. ✅ Test on mobile devices
5. ✅ Verify Firebase Security Rules are active
6. ✅ Check console for any errors
7. ✅ Test offline functionality (if implemented)

## Troubleshooting

### Common Issues
- **Build fails**: Check Node.js version (use 18+)
- **Firebase errors**: Verify environment variables are set correctly
- **CORS errors**: Check Firebase Auth authorized domains
- **404 on refresh**: Ensure SPA routing is configured

### Support
- Check browser console for errors
- Verify Firebase project settings
- Test with different browsers
- Check network tab for failed requests

