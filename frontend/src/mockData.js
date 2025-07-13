// src/mockData.js
export const mockUsers = [
  {
    id: 1,
    username: "demo_user",
    email: "user@example.com",
    password: "Password123", // Note: In real apps, never store passwords in frontend
    token: "mock_token_abc123"
  }
];

export const mockTasks = [
  {
    id: 1,
    userId: 1,
    title: "Complete project",
    description: "Finish the task manager app",
    completed: false,
    due_date: "2025-07-20T12:00:00",
    order: 1
  }
];