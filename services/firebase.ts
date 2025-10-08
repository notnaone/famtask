import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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

// Check if the config is still the placeholder
export const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { app, auth, db, googleProvider };