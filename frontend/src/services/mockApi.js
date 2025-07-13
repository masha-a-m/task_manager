// src/services/mockApi.js
import { mockUsers, mockTasks } from '../mockData';

const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, 500));

const STORAGE_KEY = "task_manager_mock_db";

// Initialize or load from localStorage
const initializeDB = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  
  const initialDB = {
    users: [...mockUsers],
    tasks: [...mockTasks],
    lastUserId: Math.max(...mockUsers.map(u => u.id)),
    lastTaskId: Math.max(...mockTasks.map(t => t.id))
  };
  
  saveToStorage(initialDB);
  return initialDB;
};

const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const mockApi = {
  // Auth
  register: async (userData) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    
    const newUser = {
      ...userData,
      id: db.lastUserId + 1,
      token: `mock_token_${Math.random().toString(36).slice(2)}`
    };
    
    db.users.push(newUser);
    db.lastUserId = newUser.id;
    saveToStorage(db);
    
    return { 
      user: { 
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      token: newUser.token 
    };
  },

  login: async ({ email, password }) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    
    const user = db.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!user) throw new Error("Invalid credentials");
    
    return { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: user.token 
    };
  },

  // Tasks
  getTasks: async (userId) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    return db.tasks
      .filter(task => task.userId === userId)
      .map(({ id, title, description, completed, due_date, order }) => ({
        id, title, description, completed, due_date, order
      }));
  },

  createTask: async (taskData) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    
    const newTask = {
      ...taskData,
      id: db.lastTaskId + 1,
      userId: taskData.userId || 1 // Default to demo user if not specified
    };
    
    db.tasks.push(newTask);
    db.lastTaskId = newTask.id;
    saveToStorage(db);
    
    return {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      completed: newTask.completed,
      due_date: newTask.due_date,
      order: newTask.order
    };
  },

  updateTask: async (taskId, updates) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) throw new Error("Task not found");
    
    db.tasks[taskIndex] = { 
      ...db.tasks[taskIndex], 
      ...updates 
    };
    
    saveToStorage(db);
    return db.tasks[taskIndex];
  },

  deleteTask: async (taskId) => {
    await simulateNetworkDelay();
    const db = initializeDB();
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    saveToStorage(db);
    return { success: true };
  }
};