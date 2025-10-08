import React, { useState } from 'react';
import { UserProfile, Task, TaskPriority } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { createTask } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';
import ParentTaskCard from './ParentTaskCard';
import TaskCreationModal from './TaskCreationModal';
import SettingsModal from '../shared/SettingsModal';
import Header from '../shared/Header';
import NotificationTest from '../shared/NotificationTest';
import { PlusIcon } from '../shared/Icons';

interface ParentDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { tasks, loading: tasksLoading } = useTasks(user.familyId);
  const { members, loading: membersLoading } = useFamilyMembers(user.familyId);
  const { showToast } = useToast();

  const child = Array.from(members.values()).find(m => m.role === 'child');

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const loading = tasksLoading || membersLoading;

  const handleCreateTask = async (taskData: { title: string; description: string; priority: TaskPriority }) => {
    if (!child) {
        showToast("Cannot create task. No child has joined the family yet.", 'warning');
        return;
    }
    try {
        await createTask(taskData, user, child.uid);
        setIsModalOpen(false);
        showToast("Task created successfully!", 'success');
    } catch (error) {
        console.error("Failed to create task:", error);
        showToast("Could not create task. Please try again.", 'error');
    }
  };
  
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <Header title="Family Tasks" onLogout={onLogout} onSettings={() => setIsSettingsOpen(true)} />
      
      <div className="p-3 sm:p-4 space-y-4">
        <NotificationTest />
        
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Child: {child?.displayName || '...'}</h2>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <PlusIcon className="w-5 h-5" />
                New Task
            </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Active Tasks ({activeTasks.length})</h3>
          {loading ? (
             <p className="text-gray-500">Loading tasks...</p>
          ) : activeTasks.length > 0 ? (
            <div className="space-y-3">
              {activeTasks.map(task => <ParentTaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No active tasks. Create one to get started!</p>
            </div>
          )}
        </div>
        
        {!loading && completedTasks.length > 0 && (
             <div>
                <h3 className="font-semibold text-lg text-gray-700 my-4">Completed Tasks ({completedTasks.length})</h3>
                 <div className="space-y-3">
                    {completedTasks.map(task => <ParentTaskCard key={task.id} task={task} />)}
                 </div>
            </div>
        )}
      </div>

      {isModalOpen && <TaskCreationModal onClose={() => setIsModalOpen(false)} onCreateTask={handleCreateTask} />}
      {isSettingsOpen && <SettingsModal user={user} onClose={() => setIsSettingsOpen(false)} onLogout={onLogout} />}
    </div>
  );
};

export default ParentDashboard;