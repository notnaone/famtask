import React, { useState } from 'react';
import { UserProfile } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { createFamily, joinFamily } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface FamilySetupProps {
  user: UserProfile | null;
}

const FamilySetup: React.FC<FamilySetupProps> = ({ user }) => {
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateFamily, setShowCreateFamily] = useState(user?.role === 'parent');
  const [newFamilyInfo, setNewFamilyInfo] = useState<{id: string, code: string} | null>(null);
  const { refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  if (!user) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyCode) return;
    setLoading(true);
    try {
      await joinFamily(familyCode, user.uid, user.role!);
      await refreshUserProfile(); // Refresh user profile to get updated familyId
      showToast('Successfully joined family!', 'success');
    } catch (err: any) {
      console.error('Join family error:', err);
      let errorMessage = 'Failed to join family. Please try again.';
      if (err.message?.includes('Invalid family code')) {
        errorMessage = 'Invalid family code. Please check and try again.';
      } else if (err.message?.includes('permission')) {
        errorMessage = 'Permission denied. Please check your Firebase configuration.';
      }
      showToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
        const { familyId, inviteCode } = await createFamily(user.uid);
        await refreshUserProfile(); // Refresh user profile to get updated familyId
        setNewFamilyInfo({ id: familyId, code: inviteCode });
        showToast('Family created successfully!', 'success');
    } catch (err: any) {
        console.error('Create family error:', err);
        let errorMessage = 'Failed to create family. Please try again.';
        if (err.message?.includes('permission')) {
          errorMessage = 'Permission denied. Please check your Firebase Security Rules.';
        } else if (err.message?.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        }
        showToast(errorMessage, 'error');
        setLoading(false);
    }
  }

  if (newFamilyInfo) {
      return (
         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Family Created!</h2>
            <p className="text-gray-600 mb-6">Share this code with your family members to have them join.</p>
            <div className="bg-gray-100 border-2 border-dashed rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold tracking-widest text-primary">{newFamilyInfo.code}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Go to Dashboard</Button>
         </div>
      )
  }

  if (user?.role === 'parent') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Set up your family</h2>
        
        {showCreateFamily ? (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">Create New Family</h3>
            <p className="text-gray-600 my-2">Start fresh with a new family account.</p>
            <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create Family'}</Button>
            <p className="text-gray-500 text-sm my-4">OR</p>
            <button onClick={() => setShowCreateFamily(false)} className="text-primary font-semibold" disabled={loading}>Join an Existing Family</button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Join Existing Family</h3>
            <Input 
              label="Enter family code:"
              id="familyCode"
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value)}
              placeholder="e.g., ABC123"
              required
            />
            <Button type="submit" disabled={loading}>{loading ? 'Joining...' : 'Join Family'}</Button>
             <button onClick={() => setShowCreateFamily(true)} className="text-primary font-semibold w-full text-center mt-2" disabled={loading}>Create a New Family instead</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Join Your Family</h2>
      <p className="text-gray-600 mb-6 text-center">Ask your parent for the family code.</p>
      <form onSubmit={handleJoin} className="space-y-4">
        <Input
          label="Family Code"
          id="familyCode"
          value={familyCode}
          onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
          placeholder="e.g., ABC123"
          required
        />
        <Button type="submit" disabled={loading}>{loading ? 'Joining...' : 'Join Family'}</Button>
      </form>
    </div>
  );
};

export default FamilySetup;