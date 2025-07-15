import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import TaskForm from './TaskForm';
import OnboardingSteps from './Onboarding';

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    priority: 4
  });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
const [selectedDate, setSelectedDate] = useState(
  localStorage.getItem('clarity_selectedDate') || null
);
const [showSidebarCalendar, setShowSidebarCalendar] = useState(false);
  const navigate = useNavigate();

  // Load user and tasks from localStorage
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || '{}');
      const allTasks = JSON.parse(localStorage.getItem('clarity_tasks') || '[]');
      
      if (currentUser.email) {
        setUser(currentUser);
        setTasks(allTasks);
        setIsNewUser(!currentUser.onboardingComplete);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error('Error loading data:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Update your filteredTasks calculation to include date filtering
const filteredTasks = tasks.filter(task => {
  // Search term filtering
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term));
    if (!matchesSearch) return false;
  }
  
  // Date filtering (if a date is selected)
  if (selectedDate) {
    return task.date && task.date.includes(selectedDate);
  }
  
  return true;
});

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const taskToAdd = {
      ...newTask,
      id: editingTaskId || Date.now().toString(),
      priority: newTask.priority || 4
    };

    const updatedTasks = editingTaskId
      ? tasks.map(task => task.id === editingTaskId ? taskToAdd : task)
      : [...tasks, taskToAdd];

    setTasks(updatedTasks);
    localStorage.setItem('clarity_tasks', JSON.stringify(updatedTasks));
    
    setNewTask({ title: '', description: '', date: '', priority: 4 });
    setEditingTaskId(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('clarity_tasks', JSON.stringify(updatedTasks));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const updatedTasks = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('clarity_tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };



  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full">
        {/* User Profile */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold">{user?.username || 'User'}</h2>
            <p className="text-xs text-gray-500">clarity.app</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="space-y-2 flex-1">
          <button
            onClick={() => {
              setSelectedDate(null);
              localStorage.setItem('clarity_selectedDate', '');
            }}
            className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center ${
              !selectedDate ? 'bg-gray-100' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            All Tasks
          </button>
          <button
            onClick={() => setShowSidebarCalendar(!showSidebarCalendar)}
            className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center ${
              selectedDate ? 'bg-gray-100' : ''
            }`}
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendar
          </button>
        </div>

        {/* Calendar Dropdown */}
        {showSidebarCalendar && (
          <div className="absolute z-50 mt-2 left-0 ml-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date);
                localStorage.setItem('clarity_selectedDate', date);
                setShowSidebarCalendar(false);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Add Task Button */}
        <button
          onClick={() => {
            setShowTaskForm(true);
            setEditingTaskId(null);
            setNewTask({
              title: '',
              description: '',
              date: selectedDate || '',
              priority: 4
            });
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('clarity_currentUser');
            navigate('/login');
          }}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
  {isNewUser ? (
    <OnboardingSteps onComplete={() => setIsNewUser(false)} />
  ) : (
    <>
      {showTaskForm ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <TaskForm
              task={newTask}
              setTask={setNewTask}
              onSave={handleAddTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTaskId(null);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Date Filter Indicator */}
          {selectedDate && (
            <div className="flex items-center mb-4 text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Showing tasks for: {formatDate(selectedDate)}
              <button 
                onClick={() => {
                  setSelectedDate(null);
                  localStorage.removeItem('clarity_selectedDate');
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext 
              items={filteredTasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks
                    .filter(task => 
                      !selectedDate || 
                      (task.date && task.date.includes(selectedDate))
                    )
                    .map(task => (
                      <SortableItem
                        key={task.id}
                        id={task.id}
                        task={task}
                        onEdit={(task) => {
                          setNewTask({
                            title: task.title,
                            description: task.description || '',
                            date: task.date || '',
                            priority: Number(task.priority) || 4
                          });
                          setEditingTaskId(task.id);
                          setShowTaskForm(true);
                        }}
                        onDelete={handleDeleteTask}
                      />
                    ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? `No tasks found for "${searchTerm}"`
                        : selectedDate
                          ? `No tasks scheduled for ${formatDate(selectedDate)}`
                          : 'No tasks yet. Add your first task!'}
                    </p>
                    <button
                      onClick={() => {
                        setNewTask({
                          title: '',
                          description: '',
                          date: selectedDate || '',
                          priority: 4
                        });
                        setShowTaskForm(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
                    >
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeTask && (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="font-medium">{activeTask.title}</h3>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </>
  )}
</div>
    </div>
  );
}