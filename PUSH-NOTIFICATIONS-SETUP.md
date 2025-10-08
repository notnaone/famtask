# Push Notifications Setup Guide

## 🚀 **What We've Implemented**

✅ **Firebase Cloud Messaging (FCM)** integration
✅ **Service Worker** for background notifications
✅ **Notification Context** for managing permissions
✅ **Settings UI** for enabling/disabling notifications
✅ **Foreground message handling**

## 🔧 **What You Need to Do**

### **Step 1: Generate VAPID Key**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `family-task-manager-ac764`
3. Go to **Project Settings** → **Cloud Messaging** tab
4. Scroll down to **Web configuration**
5. Click **Generate key pair** under **Web push certificates**
6. Copy the generated key

### **Step 2: Update VAPID Key**

Replace `YOUR_VAPID_KEY` in `services/notificationService.ts` with your actual VAPID key:

```typescript
const token = await getToken(this.messaging, {
  vapidKey: 'YOUR_ACTUAL_VAPID_KEY_HERE'
});
```

### **Step 3: Add Icons (Optional)**

Add these icon files to your `public` folder:
- `icon-192x192.png` (192x192px app icon)
- `badge-72x72.png` (72x72px notification badge)

### **Step 4: Test Notifications**

1. **Deploy your app** (notifications require HTTPS)
2. **Open the app** in your browser
3. **Go to Settings** and enable notifications
4. **Test with browser dev tools**:
   - Open DevTools → Application → Service Workers
   - Check if the service worker is registered

## 📱 **How It Works**

### **For Parents:**
- When you create a task, the child gets a push notification
- Notifications work even when the app is closed
- Clicking the notification opens the app

### **For Children:**
- When you complete a task, the parent gets a notification
- Real-time updates when app is open
- Background notifications when app is closed

## 🔔 **Notification Features**

- **Smart Notifications**: Only relevant notifications (no spam)
- **Click to Open**: Notifications open the app when clicked
- **Permission Management**: Easy enable/disable in settings
- **Background Support**: Works when app is closed
- **Cross-Device**: Works on phones, tablets, and computers

## 🚨 **Important Notes**

1. **HTTPS Required**: Push notifications only work over HTTPS
2. **Browser Support**: Works in Chrome, Firefox, Safari, Edge
3. **Permission Required**: Users must grant notification permission
4. **Service Worker**: Required for background notifications

## 🧪 **Testing**

### **Local Testing:**
```bash
# Use HTTPS for local development
npm run dev -- --https
```

### **Production Testing:**
1. Deploy to Vercel/Netlify
2. Open on mobile device
3. Enable notifications in settings
4. Test task creation/completion

## 🔧 **Troubleshooting**

### **Notifications Not Working:**
1. Check if HTTPS is enabled
2. Verify VAPID key is correct
3. Check browser notification permissions
4. Look for errors in console

### **Service Worker Issues:**
1. Check if `firebase-messaging-sw.js` is accessible
2. Verify service worker registration
3. Clear browser cache and try again

## 📋 **Next Steps**

1. **Generate VAPID key** and update the code
2. **Deploy to HTTPS** (Vercel/Netlify)
3. **Test on mobile devices**
4. **Add notification icons** (optional)

Once you complete these steps, your family task app will have full push notification support! 🎉
