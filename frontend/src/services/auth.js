// // services/auth.js
// import axios from 'axios';

// const API_URL = "https://task-manager-1-2nko.onrender.com" || "http://localhost:8000";

// export const register = (username, email, password) => {
//   return axios.post(API_URL + 'register/', {
//     username,
//     email,
//     password
//   });
// };

// export const login = (email, password) => {
//   return axios.post(API_URL + 'login/', {
//     email,
//     password
//   }).then(response => {
//     if (response.data.access) {
//       localStorage.setItem('access_token', response.data.access);
//       localStorage.setItem('refresh_token', response.data.refresh);
//     }
//     return response.data;
//   });
// };