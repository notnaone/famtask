import React, { useState } from 'react';
import { TaskPriority } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';

interface TaskCreationModalProps {
  onClose: () => void;
  onCreateTask: (taskData: { title: string; description: string; priority: TaskPriority }) => void;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ onClose, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('green');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setLoading(true);
      await onCreateTask({ title, description, priority });
      setLoading(false);
    }
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string; emoji: string; }[] = [
    { value: 'green', label: 'Low', color: 'bg-success', emoji: '🟢' },
    { value: 'orange', label: 'Medium', color: 'bg-warning', emoji: '🟠' },
    { value: 'red', label: 'High', color: 'bg-danger', emoji: '🔴' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Task Title *"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Clean your room"
            required
          />
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Vacuum, make bed, put clothes away"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level *</label>
            <div className="flex justify-between gap-2">
              {priorityOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${priority === opt.value ? 'border-primary bg-indigo-50' : 'border-gray-200 bg-white'}`}
                >
                  <span>{opt.emoji}</span>
                  <span className="font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;