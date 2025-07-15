import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const priorities = [
  { level: 1, color: 'red', label: 'High' },
  { level: 2, color: 'orange', label: 'Medium' },
  { level: 3, color: 'blue', label: 'Low' },
  { level: 4, color: 'gray', label: 'None' }
];

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showSidebarCalendar, setShowSidebarCalendar] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user and tasks from localStorage
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || '{}');
      const allTasks = JSON.parse(localStorage.getItem('clarity_tasks') || '[]');
      const savedDate = localStorage.getItem('clarity_selectedDate');
      
      if (currentUser.email) {
        setUser(currentUser);
        setTasks(allTasks);
            // Skip onboarding if coming from login or already completed
        const skipOnboarding = location.state?.fromLogin || currentUser.onboardingComplete;
        setIsNewUser(!skipOnboarding);

        if (savedDate) setSelectedDate(savedDate);
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
  }, [navigate, location.state]);

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
      priority: newTask.priority || 4,
      createdAt: new Date().toISOString()
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

  const handleOnboardingComplete = () => {
    const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || {});
    localStorage.setItem('clarity_currentUser', JSON.stringify({
      ...currentUser,
      onboardingComplete: true
    }));
    setIsNewUser(false);
  };

  const handleDateSelect = (date) => {
    setNewTask({ ...newTask, date });
    setShowCalendar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!task.title.toLowerCase().includes(term) && 
          !(task.description && task.description.toLowerCase().includes(term))) {
        return false;
      }
    }
    
    // Filter by selected date
    if (selectedDate) {
      return task.date && task.date.includes(selectedDate);
    }
    
    return true;
  });

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
    
      {/* Sidebar */}
       
      <div className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 p-6 transition-transform duration-300 ease-in-out`}>
        {/* Close button for mobile */}
        <button 
          className="md:hidden absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* User Profile */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="ml-3 font-medium">{user?.username}</span>
        </div>

        {/* Navigation */}
        {!isNewUser && (
          <nav className="space-y-4">
            <button 
              onClick={() => {
                setNewTask({
                  title: '',
                  description: '',
                  date: selectedDate || '',
                  priority: 4
                });
                setShowTaskForm(true);
                setEditingTaskId(null);
                setMobileSidebarOpen(false);
              }}
              className="flex items-center text-left bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg font-sm cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          
            <div className="flex items-center text-gray-500 mt-8 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ caretColor: '#ef4444' }}
              />
            </div>

            <div className='relative'>
              <div className="flex items-center text-gray-500 mb-6 cursor-pointer"
                onClick={() => setShowSidebarCalendar(!showSidebarCalendar)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="ml-3">Calendar</span>

                {showSidebarCalendar && (
                  <div className="absolute z-50 mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <input 
                      type="date" 
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        localStorage.setItem('clarity_selectedDate', e.target.value);
                        setShowSidebarCalendar(false);
                      }}
                      className="p-2 border rounded w-full"
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-gray-500 mb-6 cursor-pointer" 
              onClick={() => {
                setSelectedDate(null);
                localStorage.removeItem('clarity_selectedDate');
                setSearchTerm('');
                setMobileSidebarOpen(false);
              }} 
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3">Tasks</span>
            </div>

            <div className="mt-12 border-t border-gray-300 py-6">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider">My Projects</h3>
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {tasks.slice(0, 5).map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedDate(null);
                      localStorage.removeItem('clarity_selectedDate');
                      setSearchTerm(task.title);
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      task.priority === 1 ? 'bg-red-500' :
                      task.priority === 2 ? 'bg-orange-500' :
                      task.priority === 3 ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm truncate">{task.title}</span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-400 text-sm">No tasks yet. Add one to get started!</p>
                )}
                {tasks.length > 5 && (
                  <p className="text-gray-400 text-sm">+ {tasks.length - 5} more tasks</p>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center text-gray-500 hover:text-red-500 w-full"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className='cursor-pointer'>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </div>

       {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}


      {/* Main Content */}
      {isNewUser ? (
        <OnboardingSteps 
          user={user} 
          setUser={setUser} 
          onComplete={handleOnboardingComplete}
        />
      ) : (
        <div className="flex-1">
          {showTaskForm ? (
            <div className="max-w-2xl mt-10 ml-10 w-200 bg-white p-6 rounded-lg shadow-md">
              <input
                type="text"
                placeholder="My Language Lesson"
                className="border-gray-200 focus:outline-none focus:border-red-500 text-md w-full"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                autoFocus
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border-gray-200 text-xs focus:outline-none focus:border-red-500 mt-4"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              
              <div className="flex items-center mt-4">
                <div className="relative">
                  <button 
                    className="flex items-center text-gray-600 cursor-pointer"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{newTask.date || 'Date'}</span>
                  </button>
                  {showCalendar && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                      <input 
                        type="date" 
                        onChange={(e) => handleDateSelect(e.target.value)}
                        className="p-2 border rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="relative ml-6">
                  <button 
                    className="flex items-center text-gray-600 cursor-pointer"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <span>{newTask.priority ? `Priority ${newTask.priority}` : 'Priority'}</span>
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40">
                      {priorities.map((p) => (
                        <div 
                          key={p.level}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setNewTask({ ...newTask, priority: p.level });
                            setShowPriorityDropdown(false);
                          }}
                        >
                          <div className={`w-4 h-4 rounded-full mr-2 bg-${p.color}-500`}></div>
                          <span>Priority {p.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={() => setShowTaskForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 cursor-pointer rounded-lg ${newTask.title ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300'} text-white`}
                  disabled={!newTask.title}
                  onClick={handleAddTask}
                >
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              {selectedDate && (
                <div className="ml-10 mt-10 mb-6 flex items-center">
                  <h2 className="text-xl font-semibold">
                    Tasks for {formatDate(selectedDate)}
                  </h2>
                  <button 
                    onClick={() => {
                      setSelectedDate(null);
                      localStorage.removeItem('clarity_selectedDate');
                    }}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {filteredTasks.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <div className="min-h-screen bg-gray-50">
                    <SortableContext 
                      items={filteredTasks}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4 mt-10 ml-10 w-160">
                        {filteredTasks.map((task) => (
                          <SortableItem 
                            key={task.id}
                            id={task.id}
                            task={task}
                            onEdit={(taskToEdit) => {
                              setNewTask({
                                title: taskToEdit.title,
                                description: taskToEdit.description || '',
                                date: taskToEdit.date || '',
                                priority: Number(taskToEdit.priority) || 4
                              });
                              setEditingTaskId(taskToEdit.id);
                              setShowTaskForm(true);
                            }}
                            onDelete={handleDeleteTask}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>

                  <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeTask ? (
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 shadow-lg opacity-80">
                        <div className="flex justify-between items-start px-12">
                          <div className="flex-1">
                            <h3 className="font-medium">{activeTask.title}</h3>
                            {activeTask.description && <p className="text-gray-600 text-sm mt-1">{activeTask.description}</p>}
                            {activeTask.date && <p className="text-gray-500 text-xs mt-2">{activeTask.date}</p>}
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              ) : (
                <div className="text-center mt-20">
                  {searchTerm ? (
                    <div className='ml-20'>
                      <h1 className="text-3xl font-bold mb-4">No tasks found</h1>
                      <p className="text-gray-600 mb-8">No tasks match your search for "{searchTerm}"</p>
                    </div>
                  ) : (
                    <div className='mx-auto ml-20'>
                      <h1 className="text-3xl font-bold mb-4">Capture now, plan later</h1>
                      <p className="text-gray-600 mb-8">Inbox is your go-to spot for quick task entry. Clear your mind now, organize when you're ready.</p>
                    </div>
                  )}
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
                    className="ml-20 bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-medium cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('clarity_currentUser');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}