import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

export class NotificationService {
  private static instance: NotificationService;
  private messaging: any = null;

  private constructor() {
    // Messaging will be loaded lazily when needed
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.messaging) {
      this.messaging = messaging;
      if (!this.messaging) return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  public async getToken(): Promise<string | null> {
    if (!this.messaging) {
      this.messaging = messaging;
      if (!this.messaging) return null;
    }

    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BNQXcDushz9xLPtdMsy-pZcIlEzcKlLyl2v9r2YWuymFBpfjmWNarDlMJN9noTJukT2TIGGsuKHzxW-29IVxnmk'
      });
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  public async onMessage(callback: (payload: any) => void) {
    if (!this.messaging) {
      this.messaging = messaging;
      if (!this.messaging) return;
    }

    onMessage(this.messaging, callback);
  }
}

export const notificationService = NotificationService.getInstance();
