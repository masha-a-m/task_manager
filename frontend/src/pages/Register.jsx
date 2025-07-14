import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

document.title = "Sign Up – Clarity";

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleRegister = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // Check if user already exists
  //     const users = JSON.parse(localStorage.getItem('clarity_users') || {});
  //     if (users[email]) {
  //       throw new Error('Email already registered');
  //     }
    

  //     // Create new user (Note: In production, never store plain passwords!)
  //     const newUser = {
  //       username,
  //       email,
  //       password, // Warning: This is insecure for production
  //       createdAt: new Date().toISOString()
  //     };

  //     // Save to localStorage
  //     users[email] = newUser;
  //     localStorage.setItem('clarity_users', JSON.stringify(users));
      
  //     // Set current user session
  //     localStorage.setItem('clarity_currentUser', JSON.stringify({
  //       email,
  //       username,
  //       authToken: `fake-token-${Date.now()}`
  //     }));

  //     // Redirect to onboarding
  //     navigate('/onboarding', {
  //       state: {
  //         isNewUser: true,
  //         currentStep: 1
  //       }
  //     });

  //   } catch (err) {
  //     console.error('Registration failed:', err.message);
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };




  const handleRegister = (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    // Check if user already exists
    const usersStr = localStorage.getItem('clarity_users');
    const users = usersStr ? JSON.parse(usersStr) : {}; // Initialize as empty object if null
    
    if (users[email]) {
      throw new Error('Email already registered');
    }

    // Create new user (Note: In production, never store plain passwords!)
    const newUser = {
      username,
      email,
      password, // Warning: This is insecure for production
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    users[email] = newUser;
    localStorage.setItem('clarity_users', JSON.stringify(users));
    
    // Set current user session
    localStorage.setItem('clarity_currentUser', JSON.stringify({
      email,
      username,
      authToken: `fake-token-${Date.now()}`
    }));

    // Redirect to onboarding
    navigate('/onboarding', {
      state: {
        isNewUser: true,
        currentStep: 1
      }
    });

  } catch (err) {
    console.error('Registration failed:', err.message);
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleSocialRegister = (provider) => {
    alert(`In a real app, this would connect to ${provider} authentication`);
    // For demo purposes, create a temporary user
    const tempUser = {
      email: `temp-${Date.now()}@example.com`,
      username: 'Social User',
      authToken: `social-token-${Date.now()}`
    };
    
    localStorage.setItem('clarity_currentUser', JSON.stringify(tempUser));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side – Sign Up Form */}
      <div className="w-full md:w-1/2 p-8 md:px-30 bg-white flex flex-col justify-center">
        {/* Logo & Title */}
        <div className="flex items-center mb-10">
          <div className="w-8 h-8 rounded flex items-center justify-center text-white">📝</div>
          <h1 className="text-xl font-bold ml-2">Clarity</h1>
        </div>

        {/* Form Content */}
        <form onSubmit={handleRegister} className="max-w-md mx-auto w-full space-y-6 mt-10">
          <h2 className="text-3xl mb-10 font-bold">Sign Up</h2>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-500 uppercase">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-500 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work or personal email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-500 uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white px-4 py-2 rounded font-semibold cursor-pointer transition ${
              isLoading
                ? 'opacity-50 cursor-not-allowed bg-red-800'
                : 'bg-red-500 hover:bg-red-700'
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <span>Signing Up...</span>
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              'Sign Up with Email'
            )}
          </button>

          {/* Social Buttons */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleSocialRegister('Google')}
              className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
            >
              <span>🌐</span>
              <span className="ml-2">Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialRegister('Facebook')}
              className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
            >
              <span>📘</span>
              <span className="ml-2">Continue with Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialRegister('Apple')}
              className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
            >
              <span>🍎</span>
              <span className="ml-2">Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <hr className="border-t border-gray-300" />
            <span className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-3 bg-white px-2 text-sm text-gray-500">
              or
            </span>
          </div>

          {/* Agreement Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing with Google, Apple, or Email, you agree to Clarity's{' '}
            <a href="/terms" className="text-red-600 underline hover:text-red-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://www.google.com/policies/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline hover:text-red-800"
            >
              Privacy Policy
            </a>.
          </p>

          {/* Already Signed Up */}
          <p className="text-center text-sm mt-6">
            Already signed up?{' '}
            <Link to="/login" className="text-red-500 hover:text-red-700 font-semibold">
              Go to login
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side – Video Placeholder & Testimonial */}
      <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center relative">
        {/* Video Placeholder */}
        <div className="h-48 md:h-64 lg:h-80 w-full max-w-lg mx-auto flex items-center justify-center text-white text-lg">
          <video className="w-full h-full object-cover" controls>
            <source src="/images/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-8">
          <p className="italic text-gray-700">
            "Before Clarity, my to-do lists were scattered all around! Now, everything is in order and in one place."
          </p>
          <p className="mt-4 font-semibold text-gray-900">– Matt M.</p>
        </div>
      </div>
    </div>
  );
}



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // const API_URL = process.env.REACT_APP_API_URL;
// // const API_BASE_URL = "https://task-manager-1-2nko.onrender.com/api";

// const API_URL = "https://task-manager-1-2nko.onrender.com";



// document.title = "Sign Up – Clarity";

// export default function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // 1. Register the user
//       const response = await axios.post(`${API_URL}/api/register/`, {
//         username,
//         email,
//         password
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         timeout: 10000
//       });

//       // 2. Store tokens
//       const { access, refresh } = response.data;
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);

//       // 3. Set default Authorization header
//       axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

//       // 4. Redirect to onboarding
//       navigate('/onboarding', {
//         state: {
//           isNewUser: true,
//           currentStep: 1
//         }
//       });
//     } catch (err) {
//       console.error('Registration failed:', err.response?.data || err.message);

//       if (err.response && err.response.data) {
//         if (err.response.data.email) {
//           alert(`Email error: ${err.response.data.email.join(' ')}`);
//         } else if (err.response.data.password) {
//           alert(`Password error: ${err.response.data.password.join(' ')}`);
//         } else if (err.response.data.username) {
//           alert(`Username error: ${err.response.data.username.join(' ')}`);
//         } else {
//           alert('Registration failed. Please try again.');
//         }
//       } else {
//         alert('Network error. Check connection and try again.');
//       }
//     } finally {
//       setIsLoading(false); // Stop loading whether success or fail
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Side – Sign Up Form */}
//       <div className="w-full md:w-1/2 p-8 md:px-30 bg-white flex flex-col justify-center">
//         {/* Logo & Title */}
//         <div className="flex items-center mb-10">
//           <div className="w-8 h-8 rounded flex items-center justify-center text-white">📝</div>
//           <h1 className="text-xl font-bold ml-2">Clarity</h1>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleRegister} className="max-w-md mx-auto w-full space-y-6 mt-10">
//           <h2 className="text-3xl mb-10 font-bold">Sign Up</h2>

//           {/* Username Field */}
//           <div className="space-y-1">
//             <label className="block text-xs text-gray-500 uppercase">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Email Field */}
//           <div className="space-y-1">
//             <label className="block text-xs text-gray-500 uppercase">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your work or personal email"
//               className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Password Field with Toggle */}
//           <div className="space-y-1">
//             <label className="block text-xs text-gray-500 uppercase">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full border border-gray-300 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? '👁️' : '👁️‍🗨️'}
//               </button>
//             </div>
//           </div>

//           {/* Sign Up Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full text-white px-4 py-2 rounded font-semibold cursor-pointer transition ${
//               isLoading
//                 ? 'opacity-50 cursor-not-allowed bg-red-800'
//                 : 'bg-red-500 hover:bg-red-700'
//             } flex items-center justify-center`}
//           >
//             {isLoading ? (
//               <>
//                 <span>Signing Up...</span>
//                 <svg
//                   className="animate-spin ml-2 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               </>
//             ) : (
//               'Sign Up with Email'
//             )}
//           </button>

//           {/* Social Buttons */}
//           <div className="space-y-4">
//             <button
//               type="button"
//               className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
//             >
//               <span>🌐</span>
//               <span className="ml-2">Continue with Google</span>
//             </button>
//             <button
//               type="button"
//               className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
//             >
//               <span>📘</span>
//               <span className="ml-2">Continue with Facebook</span>
//             </button>
//             <button
//               type="button"
//               className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-100 transition px-4 cursor-pointer"
//             >
//               <span>🍎</span>
//               <span className="ml-2">Continue with Apple</span>
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="relative my-6">
//             <hr className="border-t border-gray-300" />
//             <span className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-3 bg-white px-2 text-sm text-gray-500">
//               or
//             </span>
//           </div>

//           {/* Agreement Text */}
//           <p className="text-xs text-gray-500 text-center mt-4">
//             By continuing with Google, Apple, or Email, you agree to Clarity’s{' '}
//             <a href="/terms" className="text-red-600 underline hover:text-red-800">
//               Terms of Service
//             </a>{' '}
//             and{' '}
//             <a
//               href="https://www.google.com/policies/terms/ "
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-red-600 underline hover:text-red-800"
//             >
//               Privacy Policy
//             </a>.
//           </p>

//           {/* Already Signed Up */}
//           <p className="text-center text-sm mt-6">
//             Already signed up?{' '}
//             <Link to="/login" className="text-red-500 hover:text-red-700 font-semibold">
//               Go to login
//             </Link>
//           </p>
//         </form>
//       </div>

//       {/* Right Side – Video Placeholder & Testimonial */}
//       <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center relative">
//         {/* Video Placeholder */}
//         <div className="h-48 md:h-64 lg:h-80 w-full max-w-lg mx-auto flex items-center justify-center text-white text-lg">
//           <video className="w-full h-full object-cover" controls>
//             <source src="/images/video.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>

//         {/* Testimonial Card */}
//         <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-8">
//           <p className="italic text-gray-700">
//             “Before Clarity, my to-do lists were scattered all around! Now, everything is in order and in one place.”
//           </p>
//           <p className="mt-4 font-semibold text-gray-900">– Matt M.</p>
//         </div>
//       </div>
//     </div>
//   );
// }