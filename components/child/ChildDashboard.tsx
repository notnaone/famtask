import React, { useState, useEffect } from 'react';
import { UserProfile, Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { markTasksAsSeen, setPlanTime, completeTask } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';
import ChildTaskCard from './ChildTaskCard';
import PlanTimeModal from './PlanTimeModal';
import Header from '../shared/Header';
import Button from '../shared/Button';

interface ChildDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const ChildDashboard: React.FC<ChildDashboardProps> = ({ user, onLogout }) => {
  const { tasks, loading: tasksLoading } = useTasks(user.familyId);
  const { members, loading: membersLoading } = useFamilyMembers(user.familyId);
  const [planningTask, setPlanningTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const { showToast } = useToast();
  
  const loading = tasksLoading || membersLoading;

  useEffect(() => {
      if (tasks.length > 0) {
        markTasksAsSeen(tasks, user.uid);
      }
  }, [tasks, user.uid]);

  const handleSetPlanTime = async (taskId: string, time: Date) => {
    try {
      await setPlanTime(taskId, time);
      setPlanningTask(null);
      showToast("Task planned successfully!", 'success');
    } catch (error) {
      console.error("Failed to plan task:", error);
      showToast("Could not plan task. Please try again.", 'error');
    }
  };
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      showToast("Task completed! Great job!", 'success');
    } catch (error) {
      console.error("Failed to complete task:", error);
      showToast("Could not complete task. Please try again.", 'error');
    }
  };

  const userTasks = tasks.filter(task => task.assignedTo === user.uid);
  const activeTasks = userTasks.filter(task => task.status !== 'completed').sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  const completedTasks = userTasks.filter(task => task.status === 'completed');

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <Header title="My Tasks" onLogout={onLogout} />

      <div className="p-3 sm:p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Your Tasks ({activeTasks.length})</h3>
          {loading ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : activeTasks.length > 0 ? (
            <div className="space-y-3">
              {activeTasks.map(task => (
                <ChildTaskCard 
                    key={task.id} 
                    task={task} 
                    familyMembers={members}
                    onPlan={() => setPlanningTask(task)}
                    onComplete={() => handleCompleteTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You're all caught up! No active tasks.</p>
            </div>
          )}
        </div>

        {!loading && completedTasks.length > 0 && (
          <div>
            <Button variant="secondary" onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? 'Hide' : 'View'} Completed Tasks
            </Button>
            {showCompleted && (
              <div className="mt-4 space-y-3">
                {completedTasks.map(task => (
                  <ChildTaskCard 
                      key={task.id} 
                      task={task} 
                      familyMembers={members}
                      onPlan={() => {}}
                      onComplete={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {planningTask && (
        <PlanTimeModal 
          task={planningTask} 
          onClose={() => setPlanningTask(null)} 
          onSave={handleSetPlanTime}
        />
      )}
    </div>
  );
};

export default ChildDashboard;