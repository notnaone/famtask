# 📱 Push Notifications Guide

## How Notifications Work

Your Family Task Manager app has **automatic push notifications** that work on both desktop and mobile devices.

## 🔔 What You'll Receive Notifications For

- **New Tasks** - When a parent assigns a new task to a child
- **Task Updates** - When task details are changed
- **Task Completions** - When a child completes a task

## 📱 Mobile Setup (iPhone & Android)

### For Best Results on Mobile:

1. **Open the app in your mobile browser** (Chrome, Safari, etc.)
2. **Look for the blue notification banner** at the top of your dashboard
3. **Tap "Enable"** on the banner to turn on notifications
4. **Allow notifications** when your browser asks for permission
5. **Add to Home Screen** (optional but recommended):
   - **iPhone**: Tap Share → Add to Home Screen
   - **Android**: Tap Menu (⋮) → Add to Home Screen

### Important Notes for Mobile:

- **Notifications work in the browser** - You don't need to install anything
- **Background notifications** - You'll receive notifications even when the app is closed
- **Permission is saved** - You only need to allow once per device
- **Works offline** - Notifications will be delivered when you're back online

## 💻 Desktop Setup (PC/Mac)

1. **Open the app in your browser** (Chrome, Edge, Firefox, etc.)
2. **Look for the blue notification banner** at the top of your dashboard
3. **Click "Enable"** on the banner
4. **Click "Allow"** when your browser asks for permission
5. **You're done!** - Notifications will appear on your desktop

## 🔧 Troubleshooting

### Not Receiving Notifications?

1. **Check browser permissions**:
   - **Chrome/Edge**: Settings → Privacy and security → Site settings → Notifications
   - **Safari**: Preferences → Websites → Notifications
   - Make sure the app URL is allowed

2. **Check device settings**:
   - **iPhone**: Settings → Safari → Advanced → Experimental Features → Enable "Push API"
   - **Android**: Settings → Apps → [Your Browser] → Notifications → Allow

3. **Try clearing and re-granting permission**:
   - Remove the app permission in browser settings
   - Reload the app
   - Allow notifications when prompted

### Still Not Working?

- **Service Worker Error**: The app uses a service worker for notifications. If you see errors about service workers in the console, try:
  1. Clear your browser cache
  2. Reload the app (Ctrl+Shift+R or Cmd+Shift+R)
  3. Allow notifications again

- **Mobile Browser Compatibility**:
  - **Best on Android**: Chrome, Firefox, Edge
  - **Best on iPhone**: Safari (iOS 16.4+)
  - Some older browsers may not support push notifications

## 🎯 How to Send Notifications

**For Parents:**
1. Create a new task
2. Assign it to a child
3. The child will automatically receive a push notification!

**For Children:**
- You'll receive notifications automatically when tasks are assigned to you
- You don't need to do anything - just make sure notifications are allowed

## 🔒 Privacy & Security

- Notifications are sent only to family members
- Each device has a unique token stored securely in Firebase
- Only authenticated users can receive notifications
- Notification permissions are controlled by your device

## 📊 Testing Notifications

To test if notifications are working:
1. **Parent account**: Create a new task for a child
2. **Child account**: Check if you receive the notification on your device
3. If you don't see it, check the troubleshooting section above

---

**Note**: Push notifications require an active internet connection. If you're offline, notifications will be queued and delivered when you're back online.

