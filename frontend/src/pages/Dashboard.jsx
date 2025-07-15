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
import OnboardingSteps from './OnboardingSteps';

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    priority: 4
  });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const filteredTasks = tasks.filter(task => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
  });

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* User Profile */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="ml-3 font-medium">{user.username || 'User'}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <button 
            onClick={() => setShowTaskForm(true)}
            className="flex items-center w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mb-6"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>

          <div className="flex items-center text-gray-500 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              className="ml-2 bg-transparent border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center text-gray-500 mb-6 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">All Tasks</span>
          </div>
        </nav>

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.removeItem('clarity_currentUser');
            navigate('/login');
          }}
          className="flex items-center text-gray-500 hover:text-red-500 mt-auto"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <TaskForm
                task={newTask}
                setTask={setNewTask}
                onSave={handleAddTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTaskId(null);
                }}
              />
            ) : (
              <div className="max-w-4xl mx-auto">
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
                        filteredTasks.map(task => (
                          <SortableItem
                            key={task.id}
                            id={task.id}
                            task={task}
                            onEdit={(task) => {
                              setNewTask(task);
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
                              : 'No tasks yet. Add your first task!'}
                          </p>
                          <button
                            onClick={() => setShowTaskForm(true)}
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