import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserProfile } from '../types';

export function useFamilyMembers(familyId: string | null) {
  const [members, setMembers] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!familyId) {
      setMembers(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    const membersQuery = query(
      collection(db, 'users'),
      where('familyId', '==', familyId)
    );

    const unsubscribe = onSnapshot(membersQuery,
      (snapshot) => {
        const membersMap = new Map<string, UserProfile>();
        snapshot.docs.forEach(doc => {
          membersMap.set(doc.id, doc.data() as UserProfile);
        });
        setMembers(membersMap);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching family members:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [familyId]);

  return { members, loading, error };
}
