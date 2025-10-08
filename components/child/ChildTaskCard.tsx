import React from 'react';
import { Task, UserProfile } from '../../types';
import { CheckIcon, AlertTriangleIcon, CalendarIcon } from '../shared/Icons';

interface ChildTaskCardProps {
  task: Task;
  familyMembers: Map<string, UserProfile>;
  onPlan: () => void;
  onComplete: () => void;
}

const priorityMap = {
  red: { emoji: '🔴' },
  orange: { emoji: '🟠' },
  green: { emoji: '🟢' },
};

const formatDate = (date: Date | undefined | null) => {
    if (!date) return null;
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const ChildTaskCard: React.FC<ChildTaskCardProps> = ({ task, familyMembers, onPlan, onComplete }) => {
  const isOverdue = task.status === 'overdue';
  const isCompleted = task.status === 'completed';
  const parentName = familyMembers.get(task.createdBy)?.displayName || 'Parent';

  const cardClasses = `border rounded-lg p-4 shadow-sm transition-all duration-300 ${isOverdue ? 'bg-red-50 border-red-300' : 'bg-white'} ${isCompleted ? 'opacity-60 bg-gray-50' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{priorityMap[task.priority].emoji}</span>
            <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
          </div>

          {isOverdue && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium">
              <AlertTriangleIcon className="w-5 h-5" />
              <span>This task is past due!</span>
            </div>
          )}

          {task.description && <p className="text-gray-600 mt-2">{task.description}</p>}

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <p>Assigned by: {parentName}</p>
            {task.dueDate && <p>Due: {formatDate(task.dueDate)}</p>}
            {task.plannedCompletionTime && (
              <p className="font-medium text-primary">You plan to finish: {formatDate(task.plannedCompletionTime)}</p>
            )}
            {isCompleted && task.completedAt && (
                <p className="font-semibold text-success flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Completed: {formatDate(task.completedAt)}</p>
            )}
          </div>
        </div>
      </div>
      
      {!isCompleted && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onPlan}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <CalendarIcon className="w-4 h-4" />
            {!task.plannedCompletionTime ? 'Set time' : 'Change time'}
          </button>
          <button
            onClick={onComplete}
            className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            Mark Done <CheckIcon className="w-4 h-4"/>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChildTaskCard;