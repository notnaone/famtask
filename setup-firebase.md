# Firebase Setup Guide

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `family-task-manager` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Enable "Google" provider
4. For Google, add your domain to authorized domains

## Step 3: Create Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll add security rules later)
3. Select a location close to your users

## Step 4: Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (`</>`)
4. Register app with nickname: "Family Task Manager"
5. Copy the Firebase configuration

## Step 5: Update Configuration
Replace the values in `services/firebase.ts` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 6: Set Up Security Rules
1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with the content from `firestore.rules` file
3. Click "Publish"

## Step 7: Test Your Setup
1. Run `npm run dev`
2. Try creating an account
3. Check if data appears in Firestore

## Optional: Environment Variables
Create a `.env` file in your project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `services/firebase.ts` to use these variables instead of hardcoded values.

