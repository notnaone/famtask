import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';

const NotificationTest: React.FC = () => {
  const { isSupported, permission, fcmToken } = useNotifications();
  const { showToast } = useToast();

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Family Task Manager!',
        icon: '/icon-192x192.png',
        tag: 'test-notification'
      });
      showToast('Test notification sent!', 'success');
    } else {
      showToast('Please enable notifications first', 'warning');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-blue-800 mb-2">🔔 Notification Test</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            permission === 'granted' ? 'bg-green-100 text-green-800' :
            permission === 'denied' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {permission === 'granted' ? '✅ Enabled' : 
             permission === 'denied' ? '❌ Blocked' : '⚠️ Not set'}
          </span>
        </div>
        {fcmToken && (
          <div>
            <strong>FCM Token:</strong> 
            <span className="text-xs text-gray-600 ml-2 break-all">
              {fcmToken.substring(0, 20)}...
            </span>
          </div>
        )}
        <button
          onClick={testNotification}
          disabled={permission !== 'granted'}
          className={`px-3 py-1 rounded text-sm ${
            permission === 'granted'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Test Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;
