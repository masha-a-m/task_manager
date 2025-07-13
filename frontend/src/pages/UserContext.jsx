// // UserContext.js
// import { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = "https://task-manager-1-2nko.onrender.com "; // ✅ Live backend URL

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/user/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
//       setUser(response.data);
//     } catch (err) {
//       console.error('Error fetching user data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem('access_token')) {
//       fetchUserData();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const updateUser = async (updatedData) => {
//     try {
//       const response = await axios.patch(
//         `${API_URL}/api/user/`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         }
//       );
//       setUser(response.data);
//       return true;
//     } catch (error) {
//       console.error('Error updating user:', error);
//       return false;
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, loading, updateUser, fetchUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);