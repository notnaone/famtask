import { Timestamp } from 'firebase/firestore';

export type UserRole = 'parent' | 'child';
export type TaskPriority = 'red' | 'orange' | 'green';
export type TaskStatus = 'created' | 'seen' | 'planned' | 'completed' | 'overdue';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole | null;
  familyId: string | null;
}

// Raw task data from Firestore
export interface TaskDocument {
  familyId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  createdBy: string;
  assignedTo: string;
  status: TaskStatus;
  createdAt: Timestamp;
  seenAt?: Timestamp | null;
  plannedCompletionTime?: Timestamp | null;
  completedAt?: Timestamp | null;
  dueDate?: Timestamp | null;
  lastModified: Timestamp;
}

// Task data converted for use in the client
export interface Task extends Omit<TaskDocument, 'createdAt' | 'seenAt' | 'plannedCompletionTime' | 'completedAt' | 'dueDate' | 'lastModified'> {
  id: string;
  createdAt: Date;
  seenAt?: Date | null;
  plannedCompletionTime?: Date | null;
  completedAt?: Date | null;
  dueDate?: Date | null;
  lastModified: Date;
}