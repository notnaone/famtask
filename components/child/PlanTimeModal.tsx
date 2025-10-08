
import React, { useState } from 'react';
import { Task } from '../../types';
import Button from '../shared/Button';
import { CalendarIcon, TimeIcon } from '../shared/Icons';

interface PlanTimeModalProps {
  task: Task;
  onClose: () => void;
  onSave: (taskId: string, time: Date) => void;
}

const PlanTimeModal: React.FC<PlanTimeModalProps> = ({ task, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('17:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plannedTime = new Date(`${date}T${time}`);
    onSave(task.id, plannedTime);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">When will you do this?</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <p className="text-gray-600 mb-6">Task: <span className="font-semibold">{task.title}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400"/>
                </div>
                <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                />
            </div>

            <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <TimeIcon className="h-5 w-5 text-gray-400"/>
                </div>
                <input 
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                />
            </div>
            
            <div className="text-sm p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                <p>Your parent will be notified.</p>
                <p>You'll get reminders 30 & 5 minutes before.</p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Plan</Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTimeModal;
