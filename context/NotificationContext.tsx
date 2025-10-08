import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { storeFCMToken } from '../services/fcmTokenService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  fcmToken: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (isSupported && user) {
      initializeNotifications();
    }
  }, [isSupported, user]);

  const initializeNotifications = async () => {
    try {
      // Only request permission if not already denied
      if (Notification.permission === 'default') {
        const granted = await notificationService.requestPermission();
        setPermission(granted ? 'granted' : 'denied');
      } else {
        setPermission(Notification.permission);
      }

      // If permission is granted, get token
      if (Notification.permission === 'granted') {
        // Get FCM token
        const token = await notificationService.getToken();
        if (token) {
          setFcmToken(token);
          console.log('FCM Token obtained successfully');
          
          // Store FCM token in Firestore
          try {
            await storeFCMToken(user.uid, token);
            console.log('FCM token stored successfully');
          } catch (error) {
            console.error('Failed to store FCM token:', error);
          }
        }

        // Listen for foreground messages
        notificationService.onMessage((payload) => {
          console.log('Foreground message received:', payload);
          showToast(payload.notification?.body || 'You have a new notification', 'info');
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  };

  const value = {
    isSupported,
    permission,
    requestPermission,
    fcmToken
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
