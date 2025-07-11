import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const priority = Number(task.priority) || 4;

  const priorityColor = 
    task.priority === 1 ? 'bg-red-500' :
    task.priority === 2 ? 'bg-orange-500' :
    task.priority === 3 ? 'bg-blue-500' : 'bg-gray-500';
    console.log("Received task:", task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
     {/* Add priority indicator */}
     
     <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l ${priorityColor}`}>
     </div>
      <div 
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
      >
        <svg 
          className="w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 8h16M4 16h16" 
          />
        </svg>
      </div>
      <div className="flex justify-between items-start px-12">
        <div className="flex-1">
          <h3 className="font-medium">{task.title}</h3>
          {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
          {task.date && <p className="text-gray-500 text-xs mt-2">{task.date}</p>}
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag events
            onEdit(task);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 ml-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
      </div>
    </div>
  );
}