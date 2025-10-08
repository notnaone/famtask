import React from 'react';
import { useAuth } from './context/AuthContext';
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
            <p className="text-gray-600 mb-6">
                Please open the file <code className="bg-gray-200 text-sm p-1 rounded">src/services/firebase.ts</code> and replace the placeholder configuration with your own Firebase project credentials.
            </p>
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                Go to Firebase Console to get your credentials
            </a>
        </div>
    </div>
);


const App: React.FC = () => {
  if (!isFirebaseConfigured) {
    return <FirebaseNotConfiguredMessage />;
  }

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

export default App;