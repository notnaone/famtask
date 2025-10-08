
import React from 'react';
import { Task } from '../../types';
import { CheckIcon } from '../shared/Icons';

interface ParentTaskCardProps {
  task: Task;
}

const priorityMap = {
  red: { color: 'text-danger', emoji: '🔴', label: 'High' },
  orange: { color: 'text-warning', emoji: '🟠', label: 'Medium' },
  green: { color: 'text-success', emoji: '🟢', label: 'Low' },
};

const formatDate = (date: Date | undefined | null) => {
    if (!date) return null;
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const ParentTaskCard: React.FC<ParentTaskCardProps> = ({ task }) => {
  const statusIndicator = task.status === 'created' 
    ? <div className="w-3 h-3 bg-red-500 rounded-full" title="Not yet seen" />
    : task.status === 'completed'
    ? <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center text-white" title="Completed"><CheckIcon className="w-3 h-3"/></div>
    : <div className="w-3 h-3 bg-green-500 rounded-full" title="Seen by child" />;
  
  const priorityInfo = priorityMap[task.priority];

  return (
    <div className={`border rounded-lg p-4 bg-white shadow-sm transition-all ${task.status === 'completed' ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {statusIndicator}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          
          <p className={`text-sm ${priorityInfo.color}`}>
            Priority: {priorityInfo.emoji} {priorityInfo.label}
          </p>
          
          {task.plannedCompletionTime ? (
            <p className="text-sm text-gray-600 mt-1">
              Planned: {formatDate(task.plannedCompletionTime)}
            </p>
          ) : task.status !== 'completed' ? (
            <p className="text-sm text-gray-500 italic mt-1">Not yet planned</p>
          ) : null }

          {task.completedAt && (
             <p className="text-sm text-green-700 font-medium mt-1">
              Completed: {formatDate(task.completedAt)}
            </p>
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            Created {task.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentTaskCard;
