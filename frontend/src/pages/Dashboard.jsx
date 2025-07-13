import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import OnboardingSteps from './Onboarding';
import { auth, db } from '../firebase';
import { FiPlus, FiSearch, FiCalendar, FiCheck, FiMoreVertical, FiLogOut, FiX } from 'react-icons/fi';
import { BsThreeDotsVertical, BsFlagFill } from 'react-icons/bs';

const dropAnimationConfig = {
  sideEffects: {
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  },
};

document.title = 'Clarity - Dashboard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebarCalendar, setShowSidebarCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    priority: 4
  });
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const priorities = [
    { level: 1, color: 'red', label: 'Urgent' },
    { level: 2, color: 'orange', label: 'High' },
    { level: 3, color: 'blue', label: 'Medium' },
    { level: 4, color: 'gray', label: 'Low' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const navigate = useNavigate();

  // Fetch user data and tasks
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL
        });
        await fetchTasks(user.uid);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    } catch (err) {
      console.error("Error fetching tasks: ", err);
      setError(err.message);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      if (editingTaskId) {
        const taskRef = doc(db, "tasks", editingTaskId);
        await updateDoc(taskRef, {
          title: newTask.title,
          description: newTask.description,
          date: newTask.date,
          priority: newTask.priority,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          title: newTask.title,
          description: newTask.description,
          date: newTask.date,
          priority: newTask.priority,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await fetchTasks(auth.currentUser.uid);
      resetTaskForm();
    } catch (err) {
      console.error("Error adding/updating task: ", err);
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task: ", err);
      setError(err.message);
    }
  };

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      date: '',
      priority: 4
    });
    setEditingTaskId(null);
    setShowTaskForm(false);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Update priority based on new position
      const taskRef = doc(db, "tasks", active.id);
      const newPriority = tasks.findIndex(task => task.id === over.id) + 1;
      await updateDoc(taskRef, {
        priority: newPriority,
        updatedAt: new Date()
      });
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  const filteredTasks = tasks.filter(task => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
  });

  const getTasksForSelectedDate = (tasks, selectedDate) => {
    if (!selectedDate) return tasks;
    const selectedDateStr = new Date(selectedDate).toISOString().split('T')[0];
    
    return tasks.filter(task => {
      if (!task.date) return false;
      const taskDateStr = new Date(task.date).toISOString().split('T')[0];
      return selectedDateStr === taskDateStr;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Error signing out: ", err);
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 text-center p-4">
        <p>Error loading dashboard: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* User Profile */}
        <div className="flex items-center mb-8">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col">
          <button 
            onClick={() => setShowTaskForm(true)}
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mb-6 transition-colors"
          >
            <FiPlus className="mr-2" />
            <span>Add Task</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <button 
              className="flex items-center text-gray-700 hover:text-red-500 w-full"
              onClick={() => setSelectedDate(null)}
            >
              <FiCheck className="mr-3" />
              <span>All Tasks</span>
            </button>
          </div>

          <div className="mb-6 relative">
            <button 
              className="flex items-center text-gray-700 hover:text-red-500 w-full"
              onClick={() => setShowSidebarCalendar(!showSidebarCalendar)}
            >
              <FiCalendar className="mr-3" />
              <span>Calendar</span>
            </button>
            {showSidebarCalendar && (
              <div className="absolute z-10 mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <input 
                  type="date" 
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowSidebarCalendar(false);
                  }}
                  className="p-2 border rounded w-full focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Projects</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => {
                    setSelectedDate(null);
                    setSearchTerm(task.title);
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
                <p className="text-gray-400 text-sm">No tasks yet</p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center text-gray-700 hover:text-red-500 w-full"
            >
              <FiLogOut className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {isNewUser ? (
          <OnboardingSteps onComplete={() => setIsNewUser(false)} />
        ) : (
          <>
            {showTaskForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {editingTaskId ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  <button onClick={resetTaskForm} className="text-gray-400 hover:text-gray-600">
                    <FiX />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full border-b border-gray-200 py-2 mb-4 focus:outline-none focus:border-red-500 text-lg font-medium"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />

                <textarea
                  placeholder="Description (optional)"
                  className="w-full border-b border-gray-200 py-2 mb-4 focus:outline-none focus:border-red-500 text-sm min-h-[60px]"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="relative">
                    <button 
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                      onClick={() => document.getElementById('task-date').showPicker()}
                    >
                      <FiCalendar className="mr-2" />
                      <input
                        id="task-date"
                        type="date"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                      />
                      {newTask.date ? (
                        new Date(newTask.date).toLocaleDateString()
                      ) : (
                        'Set due date'
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <button 
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                      <BsFlagFill 
                        className={`mr-2 ${
                          newTask.priority === 1 ? 'text-red-500' :
                          newTask.priority === 2 ? 'text-orange-500' :
                          newTask.priority === 3 ? 'text-blue-500' : 'text-gray-500'
                        }`} 
                      />
                      {priorities.find(p => p.level === newTask.priority)?.label || 'Priority'}
                    </button>
                    {showPriorityDropdown && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
                        {priorities.map((p) => (
                          <button
                            key={p.level}
                            className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 ${
                              newTask.priority === p.level ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => {
                              setNewTask({...newTask, priority: p.level});
                              setShowPriorityDropdown(false);
                            }}
                          >
                            <BsFlagFill className={`mr-2 text-${p.color}-500`} />
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={resetTaskForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                    className={`px-4 py-2 rounded-md text-white ${
                      !newTask.title.trim() ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {editingTaskId ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </div>
            )}

            {selectedDate && (
              <div className="mb-6 flex items-center">
                <h2 className="text-xl font-semibold">
                  Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="ml-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX />
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
                <SortableContext 
                  items={getTasksForSelectedDate(filteredTasks, selectedDate)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {getTasksForSelectedDate(filteredTasks, selectedDate).length > 0 ? (
                      getTasksForSelectedDate(filteredTasks, selectedDate).map((task) => (
                        <SortableItem 
                          key={task.id}
                          id={task.id}
                          task={task}
                          onEdit={(taskToEdit) => {
                            setNewTask(taskToEdit);
                            setEditingTaskId(taskToEdit.id);
                            setShowTaskForm(true);
                          }}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    ) : (
                      <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500 mb-4">No tasks found for this date</p>
                        <button
                          onClick={() => setShowTaskForm(true)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                          Add Task for This Date
                        </button>
                      </div>
                    )}
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                  {activeTask ? (
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 opacity-80">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{activeTask.title}</h3>
                          {activeTask.description && (
                            <p className="text-gray-600 text-sm mt-1">{activeTask.description}</p>
                          )}
                          {activeTask.date && (
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(activeTask.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className={`w-3 h-3 rounded-full ml-4 ${
                          activeTask.priority === 1 ? 'bg-red-500' :
                          activeTask.priority === 2 ? 'bg-orange-500' :
                          activeTask.priority === 3 ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-center max-w-md">
                  {searchTerm ? (
                    <>
                      <h1 className="text-2xl font-bold mb-3">No tasks found</h1>
                      <p className="text-gray-600 mb-6">
                        No tasks match your search for "{searchTerm}"
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold mb-3">Capture now, plan later</h1>
                      <p className="text-gray-600 mb-6">
                        Your tasks will appear here. Start by adding your first task.
                      </p>
                    </>
                  )}
                  <button 
                    onClick={() => setShowTaskForm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   defaultDropAnimationSideEffects,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { SortableItem } from './SortableItem';
// import OnboardingSteps from './Onboarding';



// const API_URL = "https://task-manager-12nko.onrender.com";


// const dropAnimationConfig = {
//   sideEffects: defaultDropAnimationSideEffects({
//     styles: {
//       active: {
//         opacity: '0.5',
//       },
//     },
//   }),
// };

// document.title = 'Clarity - Dashboard';

// export default function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSidebarCalendar, setShowSidebarCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     date: '',
//     priority: ''
//   });
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
//   const [activeId, setActiveId] = useState(null);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const priorities = [
//     { level: 1, color: 'red' },
//     { level: 2, color: 'orange' },
//     { level: 3, color: 'blue' },
//     { level: 4, color: 'gray' }
//   ];

//   const filteredTasks = tasks.filter(task => {
//     if (!searchTerm) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       task.title.toLowerCase().includes(term) ||
//       (task.description && task.description.toLowerCase().includes(term))
//     );
//   });

//   const getTasksForSelectedDate = (tasks, selectedDate) => {
//     if (!selectedDate) return tasks;
    
//     const selected = new Date(selectedDate);
//     const selectedDateStr = selected.toISOString().split('T')[0];

//     return tasks.filter(task => {
//       if (!task.date) return false;
      
//       try {
//         const taskDateStr = task.date.split(', ')[1];
//         const taskDate = new Date(taskDateStr);
//         const taskDateNormalized = taskDate.toISOString().split('T')[0];

//         return selectedDateStr === taskDateNormalized;
//       } catch (e) {
//         console.error('Error parsing task date:', e);
//         return false;
//       }
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showSidebarCalendar && !event.target.closest('.relative')) {
//         setShowSidebarCalendar(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showSidebarCalendar]);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDateSelect = (date) => {
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const selectedDate = new Date(date);
//     const dayName = days[selectedDate.getDay()];
//     const formattedDate = `${dayName}, ${selectedDate.toLocaleDateString('en-US', {
//       month: '2-digit',
//       day: '2-digit',
//       year: 'numeric'
//     })}`;
//     setNewTask({ ...newTask, date: formattedDate });
//     setShowCalendar(false);
//   };

//   const handleDeleteTask = (taskId) => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
//     }
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/user-status/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }  
//         });
//         setIsNewUser(response.data.is_new_user);        
//       } catch (err) {
//         console.error('Error checking user status:', err);
//       }
//     };

//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/user/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         });
//         setUser(response.data);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//     checkUserStatus();
//   }, []);


//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/tasks/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
//       setTasks(response.data);
//     } catch (err) {
//       console.error('Error fetching tasks:', err);
//     }
//   };
  
//   useEffect(() => {
//     fetchTasks();
//   }, []);


//   // useEffect(() => {
//   //   const savedTasks = localStorage.getItem('clarity-tasks');
//   //   if (savedTasks) {
//   //     setTasks(JSON.parse(savedTasks));
//   //   }
//   // }, []);
  
//   // useEffect(() => {
//   //   localStorage.setItem('clarity-tasks', JSON.stringify(tasks));
//   // }, [tasks]);

//   const handleAddTask = () => {
//     if (newTask.title.trim()) {
//       const taskToAdd = {
//         ...newTask,
//         id: editingTaskId || Date.now().toString(),
//         date: newTask.date || null,
//         priority: newTask.priority || 4
//       };
  
//       setTasks(prevTasks => {
//         const updatedTasks = editingTaskId 
//           ? prevTasks.map(task => task.id === editingTaskId ? taskToAdd : task)
//           : [...prevTasks, taskToAdd];
        
//         return updatedTasks.sort((a, b) => (a.priority || 4) - (b.priority || 4));
//       });

//       setNewTask({ title: '', description: '', date: '', priority: '' });
//       setEditingTaskId(null);
//       setShowTaskForm(false);
//     }
//   };

//   const handleDragStart = (event) => {
//     const { active } = event;
//     setActiveId(active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
    
//     if (active.id !== over.id) {
//       setTasks((items) => {
//         const oldIndex = items.findIndex(item => item.id === active.id);
//         const newIndex = items.findIndex(item => item.id === over.id);
        
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
    
//     setActiveId(null);
//   };

//   const handleDragCancel = () => {
//     setActiveId(null);
//   };

//   const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading user data: {error.message}</div>;
//   if (!user) return <div>No user data found</div>;

//   const handleOnboardingComplete = () => {
//     setIsNewUser(false);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r border-gray-200 p-6">
//         {/* User Profile */}
//         <div className="flex items-center mb-8">
//           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
//             {user.username.charAt(0).toUpperCase()}
//           </div>
//           <span className="ml-3 font-medium">{user.username}</span>
//         </div>

//         {/* Navigation */}
//         {!isNewUser && (
//           <nav className="space-y-4">
//             <button 
//               onClick={() => setShowTaskForm(true)}
//               className="flex items-center text-left bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg font-sm cursor-pointer"
//             >
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               <span>Add Task</span>
//             </button>
          
//             <div className="flex items-center text-gray-500 mt-8 mb-6">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search tasks..."
//                 className="ml-2 bg-transparent border-none focus:outline-none placeholder-gray-400"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{ caretColor: '#ef4444' }}
//               />
//             </div>

//             <div className='relative'>
//               <div className="flex items-center text-gray-500 mb-6 cursor-pointer"
//                 onClick={() => setShowSidebarCalendar(!showSidebarCalendar)}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="ml-3">Calendar</span>

//                 {showSidebarCalendar && (
//                   <div className="absolute z-50 mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
//                     <input 
//                       type="date" 
//                       onChange={(e) => {
//                         setSelectedDate(e.target.value);
//                         setShowSidebarCalendar(false);
//                       }}
//                       className="p-2 border rounded w-full"
//                       onClick={(e) => e.stopPropagation()} 
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex items-center text-gray-500 mb-6 cursor-pointer" 
//               onClick={() => {
//                 setSelectedDate(null);
//                 setSearchTerm('');
//               }} 
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               <span className="ml-3">Tasks</span>
//             </div>

//             <div className="mt-12 border-t border-gray-300 py-6">
//               <h3 className="text-sm font-semibold text-gray-500 tracking-wider">My Projects</h3>
//               <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
//                 {tasks.slice(0, 5).map(task => (
//                   <div 
//                     key={task.id} 
//                     className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
//                     onClick={() => {
//                       setSelectedDate(null);
//                       setSearchTerm(task.title);
//                     }}
//                   >
//                     <div className={`w-3 h-3 rounded-full mr-2 ${
//                       task.priority === 1 ? 'bg-red-500' :
//                       task.priority === 2 ? 'bg-orange-500' :
//                       task.priority === 3 ? 'bg-blue-500' : 'bg-gray-500'
//                     }`}></div>
//                     <span className="text-sm truncate">{task.title}</span>
//                   </div>
//                 ))}
//                 {tasks.length === 0 && (
//                   <p className="text-gray-400 text-sm">No tasks yet. Add one to get started!</p>
//                 )}
//                 {tasks.length > 5 && (
//                   <p className="text-gray-400 text-sm">+ {tasks.length - 5} more tasks</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-auto pt-6 border-t border-gray-200">
//               <button 
//                 onClick={() => setShowLogoutConfirm(true)}
//                 className="flex items-center text-gray-500 hover:text-red-500 w-full"
//               >
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span className='cursor-pointer'>Logout</span>
//               </button>
//             </div>
//           </nav>
//         )}
//       </div>

//       {/* Main Content */}
//       {isNewUser ? (
//         <OnboardingSteps 
//           user={user} 
//           setUser={setUser} 
//           onComplete={handleOnboardingComplete}
//         />
//       ) : (
//         <div>
//           {showTaskForm ? (
//             <div className="max-w-2xl mt-10 ml-10 w-200 bg-white p-6 rounded-lg shadow-md">
//               <input
//                 type="text"
//                 placeholder="My Language Lesson"
//                 className="border-gray-200 focus:outline-none focus:border-red-500 text-md"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Description"
//                 className="w-full border-gray-200 text-xs focus:outline-none focus:border-red-500 mt-4"
//                 value={newTask.description}
//                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//               />
              
//               <div className="flex items-center mt-4">
//                 <div className="relative">
//                   <button 
//                     className="flex items-center text-gray-600 cursor-pointer"
//                     onClick={() => setShowCalendar(!showCalendar)}
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <span>{newTask.date || 'Date'}</span>
//                   </button>
//                   {showCalendar && (
//                     <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
//                       <input 
//                         type="date" 
//                         onChange={(e) => handleDateSelect(e.target.value)}
//                         className="p-2 border rounded"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="relative ml-6">
//                   <button 
//                     className="flex items-center text-gray-600 cursor-pointer"
//                     onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//                     </svg>
//                     <span>{newTask.priority ? `Priority ${newTask.priority}` : 'Priority'}</span>
//                   </button>
//                   {showPriorityDropdown && (
//                     <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40">
//                       {priorities.map((p) => (
//                         <div 
//                           key={p.level}
//                           className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => {
//                             setNewTask({ ...newTask, priority: p.level });
//                             setShowPriorityDropdown(false);
//                           }}
//                         >
//                           <div className={`w-4 h-4 rounded-full mr-2 bg-${p.color}-500`}></div>
//                           <span>Priority {p.level}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 my-4"></div>

//               <div className="flex justify-end space-x-4">
//                 <button 
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
//                   onClick={() => setShowTaskForm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   className={`px-4 cursor-pointer rounded-lg ${newTask.title ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300'} text-white`}
//                   disabled={!newTask.title}
//                   onClick={handleAddTask}
//                 >
//                   {editingTaskId ? 'Update Task' : 'Add Task'}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="max-w-2xl">
//               {selectedDate && (
//                 <div className="ml-10 mt-10 mb-6 flex items-center">
//                   <h2 className="text-xl font-semibold">
//                     Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { 
//                       weekday: 'long', 
//                       month: 'long', 
//                       day: 'numeric', 
//                       year: 'numeric' 
//                     })}
//                   </h2>
//                   <button 
//                     onClick={() => setSelectedDate(null)}
//                     className="ml-4 text-gray-500 hover:text-gray-700"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               )}

//               {filteredTasks.length > 0 ? (
//                 <DndContext
//                   sensors={sensors}
//                   collisionDetection={closestCenter}
//                   onDragStart={handleDragStart}
//                   onDragEnd={handleDragEnd}
//                   onDragCancel={handleDragCancel}
//                 >
//                   <div className="min-h-screen bg-gray-50">
//                     <SortableContext 
//                       items={getTasksForSelectedDate(filteredTasks, selectedDate)}
//                       strategy={verticalListSortingStrategy}
//                     >
//                       {getTasksForSelectedDate(filteredTasks, selectedDate).length > 0 ? (
//                         <div className="space-y-4 mt-10 ml-10 w-160">
//                           {getTasksForSelectedDate(filteredTasks, selectedDate).map((task) => (
//                             <SortableItem 
//                               key={task.id}
//                               id={task.id}
//                               task={task}
//                               onEdit={(taskToEdit) => {
//                                 setNewTask(taskToEdit);
//                                 setEditingTaskId(taskToEdit.id);
//                                 setShowTaskForm(true);
//                               }}
//                               onDelete={handleDeleteTask}
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="ml-10 mt-10 text-center">
//                           <p className="text-gray-500">No tasks found for this date</p>
//                           <button
//                             onClick={() => setShowTaskForm(true)}
//                             className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
//                           >
//                             Add Task for This Date
//                           </button>
//                         </div>
//                       )}
//                     </SortableContext>
//                   </div>

//                   <DragOverlay dropAnimation={dropAnimationConfig}>
//                     {activeTask ? (
//                       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 shadow-lg opacity-80">
//                         <div className="flex justify-between items-start px-12">
//                           <div className="flex-1">
//                             <h3 className="font-medium">{activeTask.title}</h3>
//                             {activeTask.description && <p className="text-gray-600 text-sm mt-1">{activeTask.description}</p>}
//                             {activeTask.date && <p className="text-gray-500 text-xs mt-2">{activeTask.date}</p>}
//                           </div>
//                           <button className="text-gray-400 hover:text-gray-600">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     ) : null}
//                   </DragOverlay>

                  
//                 </DndContext>
//               ) : (
//                 <div className="text-center mt-20">
//                   {searchTerm ? (
//                     <div className='ml-20'>
//                       <h1 className="text-3xl font-bold mb-4">No tasks found</h1>
//                       <p className="text-gray-600 mb-8">No tasks match your search for "{searchTerm}"</p>
//                     </div>
//                   ) : (
//                     <div className='mx-auto ml-20'>
//                       <h1 className="text-3xl font-bold mb-4">Capture now, plan later</h1>
//                       <p className="text-gray-600 mb-8">Inbox is your go-to spot for quick task entry. Clear your mind now, organize when you're ready.</p>
//                     </div>
//                   )}
//                   <button 
//                     onClick={() => setShowTaskForm(true)}
//                     className="ml-20 bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-medium cursor-pointer"
//                   >
//                     Add Task
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
//             <h3 className="text-lg font-medium mb-4">Are you sure you want to logout?</h3>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   localStorage.removeItem('access_token');
//                   navigate('/login');
//                 }}
//                 className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }