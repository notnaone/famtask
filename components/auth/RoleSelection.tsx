import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ParentIcon, ChildIcon } from '../shared/Icons';
import { updateUserRole } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface RoleSelectionProps {
  user: UserProfile | null;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const handleSelect = async (role: 'parent' | 'child') => {
    if (!user || loading) return;
    setLoading(true);
    try {
      await updateUserRole(user.uid, role);
      await refreshUserProfile(); // Refresh the user profile to get the updated role
      showToast(`Role set to ${role}!`, 'success');
    } catch (error) {
        console.error("Failed to update role:", error);
        showToast("Failed to update role. Please try again.", 'error');
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.displayName || 'User'}!</h2>
      <p className="text-gray-600 mb-8">Are you a parent or a child?</p>
      
      <div className="flex justify-center gap-6">
        <button 
          onClick={() => handleSelect('parent')} 
          disabled={loading}
          className="flex flex-col items-center p-6 border-2 border-transparent rounded-lg hover:bg-indigo-50 hover:border-primary transition-all duration-200 disabled:opacity-50"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <ParentIcon className="w-12 h-12" />
          </div>
          <span className="text-lg font-semibold">Parent</span>
        </button>
        <button 
          onClick={() => handleSelect('child')}
          disabled={loading}
          className="flex flex-col items-center p-6 border-2 border-transparent rounded-lg hover:bg-indigo-50 hover:border-primary transition-all duration-200 disabled:opacity-50"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <ChildIcon className="w-12 h-12" />
          </div>
          <span className="text-lg font-semibold">Child</span>
        </button>
      </div>
      {loading && <p className="mt-4 text-gray-500">Saving...</p>}
    </div>
  );
};

export default RoleSelection;
