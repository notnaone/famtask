# Task Debugging Guide - Tasks Not Showing

## Quick Diagnosis

I've added debugging tools to help identify the issue. Here's what to check:

### 1. Check the Debug Panel
- Look at the bottom-right corner of your app
- You should see a black debug panel with information about:
  - User email and role
  - Family ID
  - Number of tasks
  - Any errors

### 2. Check Browser Console
- Press F12 to open developer tools
- Go to the Console tab
- Look for messages like:
  - "Creating task with data: ..."
  - "Task created with ID: ..."
  - "Tasks snapshot received: X tasks"
  - Any error messages

## Common Issues and Solutions

### Issue 1: Firebase Security Rules
**Symptoms**: Tasks created but not showing, 400 errors in console
**Solution**: Update Firebase Security Rules (see FIREBASE-SETUP-GUIDE.md)

### Issue 2: No Family ID
**Symptoms**: Debug panel shows "Family ID: Not set"
**Solution**: 
1. Make sure you've completed the family setup
2. Check that you selected a role (parent/child)
3. Try creating/joining a family again

### Issue 3: Tasks Created But Not Retrieved
**Symptoms**: Console shows "Task created with ID: ..." but "Tasks snapshot received: 0 tasks"
**Solution**: 
1. Check Firebase Security Rules
2. Verify the familyId matches between creation and retrieval
3. Check if there are any Firestore query errors

### Issue 4: Wrong User Role
**Symptoms**: Parent can't see tasks, or child sees wrong tasks
**Solution**:
1. Make sure you're logged in with the correct role
2. Check that the child has joined the family
3. Verify the family code was entered correctly

## Step-by-Step Debugging

### Step 1: Check User State
1. Open the debug panel (bottom-right)
2. Verify:
   - User email is correct
   - Role is set (parent or child)
   - Family ID is set (not "Not set")

### Step 2: Test Task Creation
1. As a parent, try creating a task
2. Check console for:
   - "Creating task with data: ..." message
   - "Task created with ID: ..." message
   - Any error messages

### Step 3: Test Task Retrieval
1. After creating a task, check console for:
   - "Setting up task listener for familyId: ..." message
   - "Tasks snapshot received: X tasks" message
   - Any error messages

### Step 4: Check Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Check if tasks are being created in the "tasks" collection
5. Check if the familyId matches

## Quick Fixes

### Fix 1: Update Firebase Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Fix 2: Clear Browser Data
1. Clear browser cache and cookies
2. Refresh the page
3. Try again

### Fix 3: Restart Development Server
1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
3. Try creating tasks

## Still Not Working?

If tasks are still not showing:

1. **Check the debug panel** - what does it show?
2. **Check the console** - are there any error messages?
3. **Check Firebase Console** - are tasks being created?
4. **Try the quick fixes** above

## Expected Behavior

When everything is working correctly:
1. Parent creates a task → Console shows "Task created with ID: ..."
2. Task appears in parent dashboard immediately
3. Task appears in child dashboard immediately
4. Debug panel shows correct task count

Let me know what the debug panel and console show, and I can help you fix the specific issue!
