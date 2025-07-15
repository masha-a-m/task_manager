import React, { useState } from 'react';
import { format } from 'date-fns';

const TaskForm = ({ task, setTask, onSave, onCancel }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorityOptions = [
    { value: 1, label: 'High', color: 'bg-red-500' },
    { value: 2, label: 'Medium', color: 'bg-orange-500' },
    { value: 3, label: 'Low', color: 'bg-blue-500' },
    { value: 4, label: 'None', color: 'bg-gray-400' }
  ];

  const selectedPriority = priorityOptions.find(opt => opt.value === task.priority) || 
                         priorityOptions[3];

  const handleDateChange = (e) => {
    if (e.target.value) {
      const formattedDate = format(new Date(e.target.value), 'EEEE, MM/dd/yyyy');
      setTask({ ...task, date: formattedDate });
    } else {
      setTask({ ...task, date: '' });
    }
  };

  const handlePrioritySelect = (priority) => {
    setTask({ ...task, priority });
    setShowPriorityDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="What needs to be done?"
          autoFocus
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Add details..."
          rows="3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={task.date ? format(new Date(task.date), 'yyyy-MM-dd') : ''}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {task.date && (
            <button
              onClick={() => setTask({...task, date: ''})}
              className="absolute right-2 top-8 text-gray-400 hover:text-red-500"
              aria-label="Clear date"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <button
            type="button"
            className={`w-full px-4 py-2 border border-gray-300 rounded-md flex items-center justify-between ${showPriorityDropdown ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
          >
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${selectedPriority.color} mr-2`}></span>
              <span>{selectedPriority.label}</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showPriorityDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
                    task.priority === option.value ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handlePrioritySelect(option.value)}
                >
                  <span className={`w-3 h-3 rounded-full ${option.color} mr-2`}></span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!task.title.trim()}
          className={`px-4 py-2 rounded-md text-white transition-colors ${
            !task.title.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {task.id ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;