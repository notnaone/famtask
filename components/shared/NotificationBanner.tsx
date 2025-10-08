import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBanner: React.FC = () => {
  const { isSupported, permission, requestPermission, fcmToken } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if dismissed or permission already handled
  if (dismissed || !isSupported || permission === 'granted' || permission === 'denied') {
    return null;
  }

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (!granted) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">🔔</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Enable Notifications
          </h3>
          <p className="text-xs text-blue-700 mb-2">
            Get notified when new tasks are assigned or completed.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnableNotifications}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;

