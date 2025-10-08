import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

const DebugInfo: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(userProfile?.familyId || null);
  const { members, loading: membersLoading } = useFamilyMembers(userProfile?.familyId || null);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>User: {user?.email || 'Not logged in'}</div>
        <div>Role: {userProfile?.role || 'Not set'}</div>
        <div>Family ID: {userProfile?.familyId || 'Not set'}</div>
        <div>Tasks: {tasks.length} (Loading: {tasksLoading ? 'Yes' : 'No'})</div>
        <div>Members: {members.size}</div>
        {tasksError && <div className="text-red-400">Error: {tasksError.message}</div>}
        {tasks.length > 0 && (
          <div>
            <div>Task IDs: {tasks.map(t => t.id).join(', ')}</div>
            <div>First task: {tasks[0]?.title}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
