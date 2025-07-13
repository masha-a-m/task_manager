import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

document.title = "Log in to Clarity";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified (optional)
      if (!user.emailVerified) {
        // Optionally send verification email or show warning
        console.warn('Email not verified');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Improved error handling
      let errorMessage = 'Login failed. Please try again.';
      
      switch(error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Account temporarily locked. Try again later or reset your password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection';
          break;
        default:
          // Handle case where error might be in different format
          if (error.non_field_errors) {
            errorMessage = error.non_field_errors[0];
          } else if (error.message) {
            errorMessage = error.message;
          }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component...
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full space-y-6">
          {/* Logo & Title */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white mr-3">
              <span className="text-xl">📝</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Clarity</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-600">Log in to your account to continue</p>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
                minLength="6"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-800">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              } transition-colors flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FcGoogle className="text-xl" />
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FaFacebook className="text-xl text-blue-600" />
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FaApple className="text-xl text-gray-800" />
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-red-600 hover:text-red-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-red-500 to-red-600 p-12">
        <div className="h-full flex flex-col justify-center items-center text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Your productivity companion</h2>
            <p className="text-lg mb-8">
              Join thousands of users who manage their tasks efficiently with Clarity
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">{item * 100}+</div>
                  <div className="text-sm">Happy users</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Import API URL (centralized or env-based)
// const API_URL = "https://task-manager-1-2nko.onrender.com "; // ✅ Replace with .env if needed

// document.title = "Log in to Clarity";

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(`${API_URL}/api/login/`, {
//         email,
//         password
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Logged in:', res.data);

//       // Store tokens
//       localStorage.setItem('access_token', res.data.access);
//       localStorage.setItem('refresh_token', res.data.refresh);

//       // Set default auth header
//       axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;

//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login failed:', err.response?.data || err.message);

//       // Improved error display
//       if (err.response?.data) {
//         if (err.response.data.email) {
//           alert(`Email error: ${err.response.data.email.join(' ')}`);
//         } else if (err.response.data.non_field_errors) {
//           alert(err.response.data.non_field_errors.join(' '));
//         } else {
//           alert('Login failed. Check console for details.');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Side – Login Form */}
//       <div className="w-full md:w-1/2 p-8 md:px-30 bg-white flex flex-col justify-center">
//         {/* Logo & Title */}
//         <div className="flex items-center mb-10">
//           <div className="w-8 h-8 rounded flex items-center justify-center text-white">📝</div>
//           <h1 className="text-xl font-bold ml-2">Clarity</h1>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleLogin} className="max-w-md mx-auto w-full space-y-6 mt-10">
//           <h2 className="text-3xl mb-10 font-bold">Log In</h2>

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

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full text-white py-2 rounded font-semibold cursor-pointer transition ${
//               isLoading
//                 ? 'opacity-50 cursor-not-allowed bg-red-800'
//                 : 'bg-red-500 hover:bg-red-600'
//             } flex items-center justify-center`}
//           >
//             {isLoading ? (
//               <>
//                 <span>Logging in...</span>
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
//               'Log in'
//             )}
//           </button>

//           {/* Forgot password? */}
//           <p className="text-xs text-red-500 hover:text-red-800 underline mb-4 cursor-pointer">
//             Forgot your password?
//           </p>

//           {/* Agreement Text */}
//           <p className="text-xs text-gray-500 mt-4">
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

//           {/* Haven't Signed Up */}
//           <p className="text-center text-sm mt-6">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-red-500 hover:text-red-800 font-semibold underline">
//               Sign up
//             </Link>
//           </p>
//         </form>
//       </div>

//       {/* Right Side – Image */}
//       <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
//         {/* Image Placeholder */}
//         <div className="h-48 md:h-64 lg:h-80 w-full max-w-lg mx-auto rounded shadow-md flex items-center justify-center text-white text-lg">
//           <img src="/images/login.png" alt="Login Illustration" className="w-full h-full object-cover rounded" />
//         </div>
//       </div>
//     </div>
//   );
// }