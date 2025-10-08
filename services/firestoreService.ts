import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import { UserProfile, Task, TaskPriority, TaskDocument } from '../types';

const ensureDb = () => {
    if (!db) {
        throw new Error("Firebase is not configured. Please check your services/firebase.ts file.");
    }
    return db;
}

// User Management
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const db = ensureDb();
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const createUserProfile = async (user: FirebaseUser): Promise<UserProfile> => {
  const db = ensureDb();
  const userDocRef = doc(db, 'users', user.uid);
  const newUserProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'New User',
    role: null,
    familyId: null,
  };
  await setDoc(userDocRef, newUserProfile);
  return newUserProfile;
};

// Family Management
const generateFamilyCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createFamily = async (userId: string): Promise<{ familyId: string, inviteCode: string }> => {
    const db = ensureDb();
    const inviteCode = generateFamilyCode();
    const familyRef = await addDoc(collection(db, 'families'), {
        parentIds: [userId],
        childIds: [],
        createdAt: serverTimestamp(),
        inviteCode,
    });
    
    await updateDoc(doc(db, 'users', userId), { familyId: familyRef.id });

    return { familyId: familyRef.id, inviteCode };
};

export const joinFamily = async (inviteCode: string, userId: string, role: 'parent' | 'child'): Promise<string | null> => {
    const db = ensureDb();
    const q = query(collection(db, 'families'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("Invalid family code.");
    }

    const familyDoc = querySnapshot.docs[0];
    const familyData = familyDoc.data();
    const familyId = familyDoc.id;

    const userUpdateField = role === 'parent' ? 'parentIds' : 'childIds';

    if (familyData[userUpdateField].includes(userId)) return familyId; // Already in family

    await updateDoc(doc(db, 'families', familyId), {
        [userUpdateField]: [...familyData[userUpdateField], userId]
    });

    await updateDoc(doc(db, 'users', userId), { familyId });
    return familyId;
}

export const updateUserRole = async (uid: string, role: 'parent' | 'child'): Promise<void> => {
    const db = ensureDb();
    await updateDoc(doc(db, 'users', uid), { role });
};


// Task Management
export const createTask = async (taskData: { title: string; description: string; priority: TaskPriority }, user: UserProfile, childId: string): Promise<void> => {
    const db = ensureDb();
    if (!user.familyId) throw new Error("User does not belong to a family.");
    
    await addDoc(collection(db, 'tasks'), {
        ...taskData,
        familyId: user.familyId,
        createdBy: user.uid,
        assignedTo: childId,
        status: 'created',
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        seenAt: null,
        plannedCompletionTime: null,
        completedAt: null,
        dueDate: null,
    });
};

export const updateTask = async (taskId: string, updates: Partial<TaskDocument>): Promise<void> => {
    const db = ensureDb();
    await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        lastModified: serverTimestamp(),
    });
};


export const markTasksAsSeen = async (tasks: Task[], userId: string): Promise<void> => {
    const db = ensureDb();
    const batch = writeBatch(db);
    const unseenTasks = tasks.filter(t => t.assignedTo === userId && t.status === 'created');
    if(unseenTasks.length === 0) return;

    unseenTasks.forEach(task => {
        const taskRef = doc(db, 'tasks', task.id);
        batch.update(taskRef, {
            status: 'seen',
            seenAt: serverTimestamp(),
            lastModified: serverTimestamp()
        });
    });

    await batch.commit();
};

export const completeTask = (taskId: string) => updateTask(taskId, { status: 'completed', completedAt: Timestamp.now() });

export const setPlanTime = (taskId: string, time: Date) => updateTask(taskId, { status: 'planned', plannedCompletionTime: Timestamp.fromDate(time) });

// Get family invite code
export const getFamilyInviteCode = async (familyId: string): Promise<string | null> => {
    const db = ensureDb();
    const familyDoc = await getDoc(doc(db, 'families', familyId));
    if (familyDoc.exists()) {
        return familyDoc.data().inviteCode || null;
    }
    return null;
};