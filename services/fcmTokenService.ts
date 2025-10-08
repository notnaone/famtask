import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const ensureDb = () => {
    if (!db) {
        throw new Error("Firebase is not configured. Please check your services/firebase.ts file.");
    }
    return db;
}

// Store FCM token for a user
export const storeFCMToken = async (userId: string, token: string): Promise<void> => {
    const db = ensureDb();
    const tokenDocRef = doc(db, 'fcmTokens', token);
    
    await setDoc(tokenDocRef, {
        userId,
        token,
        createdAt: new Date(),
        lastUsed: new Date()
    });
};

// Get FCM token for a user
export const getFCMToken = async (userId: string): Promise<string | null> => {
    const db = ensureDb();
    const tokenDocRef = doc(db, 'fcmTokens', userId);
    const tokenDoc = await getDoc(tokenDocRef);
    
    if (tokenDoc.exists()) {
        return tokenDoc.data().token;
    }
    return null;
};

// Get all FCM tokens for a family
export const getFamilyFCMTokens = async (familyId: string): Promise<string[]> => {
    const db = ensureDb();
    // This would require a query, but for now we'll return empty array
    // In a real implementation, you'd query all users in the family and get their tokens
    return [];
};

// Remove FCM token when user logs out
export const removeFCMToken = async (token: string): Promise<void> => {
    const db = ensureDb();
    const tokenDocRef = doc(db, 'fcmTokens', token);
    await deleteDoc(tokenDocRef);
};
