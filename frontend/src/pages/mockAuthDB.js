// mockAuthDB.js
let mockUsers = [
  {
    email: "user@example.com",
    password: "password123",
    username: "testuser"
  }
];

export const getMockUsers = () => mockUsers;
export const addMockUser = (user) => {
  mockUsers.push(user);
  return mockUsers;
};