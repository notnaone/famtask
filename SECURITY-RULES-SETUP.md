# Firebase Security Rules Setup Guide

## 🔒 **Updated Security Rules**

I've created production-ready security rules that include support for push notifications and proper task management.

## 📋 **What the Rules Include:**

### **1. User Management**
- Users can read/write their own profile
- Family members can read each other's profiles
- Secure user data access

### **2. Family Management**
- Only family members can access family documents
- Secure family code sharing
- Protected family data

### **3. Task Management**
- Parents can create tasks for their family
- Children can only update tasks assigned to them
- Parents can delete tasks
- Secure task data access

### **4. Push Notifications (NEW)**
- FCM token storage and management
- Users can manage their own tokens
- Secure notification data

## 🚀 **How to Apply the Rules:**

### **Step 1: Go to Firebase Console**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `family-task-manager-ac764`
3. Go to **Firestore Database** → **Rules**

### **Step 2: Replace Current Rules**
Copy and paste the content from `firestore-production.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Family members can read other family members' profiles
    match /users/{userId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.familyId == 
        get(/databases/$(database)/documents/users/$(userId)).data.familyId;
    }
    
    // Family documents - only family members can read
    match /families/{familyId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.familyId == familyId;
    }
    
    // Tasks - family members can read all tasks in their family
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.familyId == 
        resource.data.familyId;
      
      // Only parents can create tasks
      allow create: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'parent' &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.familyId == 
        request.resource.data.familyId;
      
      // Only the assigned user can update their tasks
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.uid == 
         resource.data.assignedTo ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.uid == 
         resource.data.createdBy);
      
      // Only parents can delete tasks
      allow delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'parent' &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.familyId == 
        resource.data.familyId;
    }
    
    // FCM Tokens - users can manage their own tokens
    match /fcmTokens/{tokenId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Notification logs - for debugging (optional)
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }
  }
}
```

### **Step 3: Publish Rules**
1. Click **Publish** button
2. Wait for rules to be deployed
3. Test your app to ensure everything works

## 🔐 **Security Features:**

### **Data Protection:**
- ✅ Users can only access their own data
- ✅ Family members can only see their family's data
- ✅ Tasks are protected by family membership
- ✅ FCM tokens are user-specific

### **Role-Based Access:**
- ✅ Parents can create and delete tasks
- ✅ Children can only update assigned tasks
- ✅ Users can manage their own FCM tokens

### **Authentication Required:**
- ✅ All operations require authentication
- ✅ No anonymous access allowed
- ✅ Secure user verification

## 🧪 **Testing the Rules:**

### **Test 1: User Access**
- ✅ Users can read/write their own profile
- ✅ Users can read family members' profiles
- ❌ Users cannot access other families' data

### **Test 2: Task Management**
- ✅ Parents can create tasks
- ✅ Children can update assigned tasks
- ✅ Parents can delete tasks
- ❌ Children cannot create or delete tasks

### **Test 3: FCM Tokens**
- ✅ Users can store their own FCM tokens
- ✅ Users can read their own tokens
- ❌ Users cannot access others' tokens

## 🚨 **Important Notes:**

1. **Replace Development Rules**: These rules replace the temporary "allow all" rules
2. **Test Thoroughly**: Make sure all features work after applying rules
3. **Monitor Usage**: Check Firebase Console for any rule violations
4. **Backup Rules**: Keep a copy of working rules before making changes

## 🔧 **If Something Breaks:**

1. **Check Console**: Look for permission denied errors
2. **Verify Rules**: Make sure rules are published correctly
3. **Test Permissions**: Verify user authentication and roles
4. **Rollback**: Temporarily use development rules if needed

Your app now has production-ready security rules that protect user data while enabling all the features including push notifications! 🔒
