import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpcwKO2w5Zd_2UZgQAF83bHz2eUHpk1qU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "family-task-manager-ac764.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "family-task-manager-ac764",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "family-task-manager-ac764.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "278771227567",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:278771227567:web:9f124f08c83c984ef52d5a",
  measurementId: "G-KNF9ZJBVB8"
};

// Check if the config is properly configured (not placeholder values)
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" &&
  firebaseConfig.projectId && 
  firebaseConfig.authDomain &&
  firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let messaging: Messaging | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let initializationError: Error | null = null;

if (isFirebaseConfigured) {
  try {
    console.log("Initializing Firebase...", { 
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain 
    });
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    console.log("Firebase initialized successfully");
    
    // Set up error handling for Firestore
    if (db) {
      // Suppress Firestore connection warnings in production
      if (typeof window !== 'undefined') {
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
          // Filter out Firestore connection warnings and 400 errors
          if (args[0] && typeof args[0] === 'string' && 
              (args[0].includes('WebChannelConnection') || 
               args[0].includes('transport errored') ||
               args[0].includes('@firebase/firestore'))) {
            return;
          }
          originalConsoleWarn.apply(console, args);
        };
        
        // Also suppress 400 errors from Firestore
        const originalConsoleError = console.error;
        console.error = (...args) => {
          if (args[0] && typeof args[0] === 'string' && 
              args[0].includes('400 (Bad Request)') && 
              args[0].includes('firestore.googleapis.com')) {
            return;
          }
          originalConsoleError.apply(console, args);
        };
      }
    }
    
    // Initialize messaging if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      isSupported().then((supported) => {
        if (supported) {
          messaging = getMessaging(app);
          console.log("Firebase messaging initialized");
        } else {
          console.log("Firebase messaging not supported in this environment");
        }
      }).catch((error) => {
        console.warn("Firebase messaging initialization failed:", error);
      });
    }
  } catch (error) {
    initializationError = error as Error;
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase not configured. Please check your environment variables or firebase.ts configuration.");
}

export { app, auth, db, messaging, googleProvider };