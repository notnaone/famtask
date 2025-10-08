import React, { useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../../services/firebase';
import { createUserProfile, getUserProfile } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { AppLogo, GoogleIcon } from '../shared/Icons';

const WelcomeScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleAuthAction = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Successfully signed in!', 'success');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        showToast('Account created successfully!', 'success');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please create an account.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const profile = await getUserProfile(user.uid);
        if (!profile) {
            await createUserProfile(user);
        }
        showToast('Successfully signed in with Google!', 'success');
    } catch (err: any) {
        let errorMessage = 'Google sign-in failed. Please try again.';
        if (err.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in cancelled. Please try again.';
        } else if (err.code === 'auth/popup-blocked') {
            errorMessage = 'Popup blocked. Please allow popups and try again.';
        }
        showToast(errorMessage, 'error');
    } finally {
        setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction();
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
      <div className="flex flex-col items-center mb-6">
        <AppLogo className="w-16 h-16 text-primary mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">Family Task Manager</h1>
        <p className="text-gray-500">Keep your family organized</p>
      </div>
      
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          id="email" 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={loading || !isFirebaseConfigured}
        />
        <Input 
          id="password" 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          disabled={loading || !isFirebaseConfigured}
        />
        <Button type="submit" disabled={loading || !isFirebaseConfigured}>
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Button>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
      </div>

      <Button variant="secondary" onClick={handleGoogleSignIn} disabled={loading || !isFirebaseConfigured}>
        <GoogleIcon />
        Continue with Google
      </Button>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-primary hover:underline"
          disabled={loading || !isFirebaseConfigured}
        >
          {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;