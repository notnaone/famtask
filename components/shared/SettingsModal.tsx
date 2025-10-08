import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { getFamilyInviteCode } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationTest from './NotificationTest';
import { SettingsIcon, LogoutIcon } from './Icons';

interface SettingsModalProps {
  user: UserProfile;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onLogout }) => {
  const [familyCode, setFamilyCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isSupported, permission, requestPermission } = useNotifications();

  useEffect(() => {
    const loadFamilyCode = async () => {
      if (user.familyId) {
        setLoading(true);
        try {
          const code = await getFamilyInviteCode(user.familyId);
          setFamilyCode(code);
        } catch (error) {
          console.error('Failed to load family code:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadFamilyCode();
  }, [user.familyId]);

  const copyToClipboard = async () => {
    if (familyCode) {
      try {
        await navigator.clipboard.writeText(familyCode);
        showToast('Family code copied to clipboard!', 'success');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        showToast('Failed to copy to clipboard', 'error');
      }
    }
  };

  const handleNotificationPermission = async () => {
    if (permission === 'granted') {
      showToast('Notifications are already enabled!', 'info');
      return;
    }

    const granted = await requestPermission();
    if (granted) {
      showToast('Notifications enabled! You\'ll receive task updates.', 'success');
    } else {
      showToast('Notifications blocked. You can enable them in browser settings.', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Account Info</h3>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-600">Email:</span> {user.email}</div>
              <div><span className="text-gray-600">Role:</span> <span className="capitalize">{user.role}</span></div>
              <div><span className="text-gray-600">Family ID:</span> {user.familyId?.substring(0, 8)}...</div>
            </div>
          </div>

          {/* Family Code Section */}
          {user.role === 'parent' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Family Code</h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading...</p>
                </div>
              ) : familyCode ? (
                <div className="text-center">
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                    <p className="text-2xl font-bold tracking-widest text-primary">
                      {familyCode}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-primary hover:underline"
                  >
                    Copy to Clipboard
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    Share this code with your child so they can join the family
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center">No family code available</p>
              )}
            </div>
          )}

          {/* Notifications Section */}
          {isSupported && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Notifications</h3>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">
                    {permission === 'granted' ? '✅ Enabled' : 
                     permission === 'denied' ? '❌ Blocked' : '⚠️ Not set'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Get notified about new tasks and updates
                  </p>
                </div>
                <button
                  onClick={handleNotificationPermission}
                  disabled={permission === 'granted'}
                  className={`px-3 py-1 rounded text-sm ${
                    permission === 'granted' 
                      ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-indigo-700'
                  }`}
                >
                  {permission === 'granted' ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <NotificationTest />
            </div>
          )}

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogoutIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
