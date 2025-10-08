import React from 'react';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import WelcomeScreen from './components/auth/WelcomeScreen';
import RoleSelection from './components/auth/RoleSelection';
import FamilySetup from './components/auth/FamilySetup';
import ParentDashboard from './components/parent/ParentDashboard';
import ChildDashboard from './components/child/ChildDashboard';
import { auth, isFirebaseConfigured } from './services/firebase';
import { signOut } from 'firebase/auth';

const FirebaseNotConfiguredMessage: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-danger mb-4">Firebase Not Configured</h1>
            <p className="text-gray-700 mb-2">
                This application requires a connection to a Firebase project to function.
            </p>
            <p className="text-gray-600 mb-4">
                Please check your environment variables or Firebase configuration.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left text-sm">
                <p className="font-semibold mb-2">Required environment variables:</p>
                <ul className="space-y-1 text-gray-600">
                    <li>• VITE_FIREBASE_API_KEY</li>
                    <li>• VITE_FIREBASE_AUTH_DOMAIN</li>
                    <li>• VITE_FIREBASE_PROJECT_ID</li>
                    <li>• VITE_FIREBASE_APP_ID</li>
                </ul>
            </div>
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                Go to Firebase Console to get your credentials
            </a>
        </div>
    </div>
);

// This component will only be rendered when Firebase is configured and within AuthProvider
const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  const handleLogout = () => {
    if (auth) {
        signOut(auth);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (!user) {
      return <WelcomeScreen />;
    }

    if (!userProfile?.role) {
      return <RoleSelection user={userProfile} />;
    }

    if (!userProfile?.familyId) {
      return <FamilySetup user={userProfile} />;
    }

    if (userProfile.role === 'parent') {
      return <ParentDashboard user={userProfile} onLogout={handleLogout} />;
    }
    
    if (userProfile.role === 'child') {
      return <ChildDashboard user={userProfile} onLogout={handleLogout} />;
    }

    return <div className="text-center text-red-500">An unexpected error occurred. Please refresh.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-gray-800">
      <div className="w-full max-w-md mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Check Firebase configuration first
  if (!isFirebaseConfigured) {
    console.log("Firebase not configured, showing configuration message");
    return <FirebaseNotConfiguredMessage />;
  }

  console.log("Firebase configured, rendering app content");
  
  // Only render the app content when Firebase is configured
  // The AuthProvider is already wrapping this in index.tsx
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;