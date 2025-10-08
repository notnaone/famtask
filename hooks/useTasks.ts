import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Task, TaskDocument } from '../types';

const convertTimestampToDate = (docData: TaskDocument): Omit<Task, 'id'> => {
    return {
        ...docData,
        createdAt: docData.createdAt ? (docData.createdAt as Timestamp).toDate() : new Date(),
        lastModified: docData.lastModified ? (docData.lastModified as Timestamp).toDate() : new Date(),
        seenAt: docData.seenAt ? (docData.seenAt as Timestamp).toDate() : null,
        plannedCompletionTime: docData.plannedCompletionTime ? (docData.plannedCompletionTime as Timestamp).toDate() : null,
        completedAt: docData.completedAt ? (docData.completedAt as Timestamp).toDate() : null,
        dueDate: docData.dueDate ? (docData.dueDate as Timestamp).toDate() : null,
    };
};


export function useTasks(familyId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!familyId) {
        setTasks([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    
    if (!db) {
      setError(new Error("Firebase not configured"));
      setLoading(false);
      return;
    }

    const tasksQuery = query(
        collection(db, 'tasks'), 
        where('familyId', '==', familyId),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, 
        (snapshot) => {
            const taskData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestampToDate(doc.data() as TaskDocument)
            }));
            setTasks(taskData);
            setLoading(false);
        },
        (err) => {
            console.error("Error fetching tasks:", err);
            setError(err);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [familyId]);

  return { tasks, loading, error };
}
