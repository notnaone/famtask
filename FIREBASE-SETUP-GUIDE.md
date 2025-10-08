# Firebase Setup Guide - Fix Firestore 400 Error

## The Problem
You're getting a 400 Bad Request error when trying to create a family. This is because Firebase Security Rules are blocking the write operations.

## Quick Fix (Development Only)

### Step 1: Update Firestore Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `family-task-manager-ac764`
3. Go to **Firestore Database** → **Rules**
4. Replace the current rules with this **TEMPORARY** development rule:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORARY: Allow all reads and writes for development
    // WARNING: This is NOT secure for production!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish**

### Step 2: Test Your App
1. Refresh your app
2. Try creating a family again
3. The error should be gone!

## Production Security Rules (Use Later)

Once your app is working, replace the development rules with these secure rules:

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
  }
}
```

## Why This Happens

Firebase Security Rules are designed to protect your data. By default, they block all reads and writes until you explicitly allow them. The 400 error means the rules are rejecting the request.

## Testing Your Rules

1. **Test Mode**: Use the development rules above for testing
2. **Simulator**: Use Firebase Console → Rules → Simulator to test specific operations
3. **Logs**: Check Firebase Console → Functions → Logs for detailed error messages

## Next Steps

1. ✅ Apply the development rules
2. ✅ Test your app - it should work now!
3. ✅ Deploy your app
4. ⏳ Later: Replace with production rules for security

## Need Help?

If you're still getting errors:
1. Check the browser console for more details
2. Verify your Firebase project is set up correctly
3. Make sure authentication is working
4. Check that your user has the correct role assigned
