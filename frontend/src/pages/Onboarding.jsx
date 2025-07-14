
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

document.title = "Onboarding – Clarity";

export default function OnboardingSteps() {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [selectedTaskMethod, setSelectedTaskMethod] = useState(null);
  const [user, setUser] = useState({
    username: '',
    email: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Fetch user data from localStorage on load
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || {});
    setUser({
      username: currentUser.username || '',
      email: currentUser.email || '',
      photo: null
    });
  }, []);

  const handleNextStep = () => {
    if (currentStep === 2 && !user.username.trim()) {
      alert("Please enter your name to continue.");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Step 1 Content - Welcome
  const Step1 = () => (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <span className="text-sm text-gray-500 font-semibold">Step 1 of 5</span>
        <h1 className="text-3xl font-bold mt-2">Welcome to Clarity</h1>
        <p className="text-gray-600 mt-2">We're excited to help you bring calm back to work and life.</p>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-pink-50">
        <div>
          <h2 className="font-bold text-lg mb-8">Clarity can help you...</h2>
        </div>
        <div className="space-y-10">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Organize the everyday chaos</span>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Focus on the right things</span>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Achieve goals and finish projects</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleNextStep}
        className="mt-12 w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
      >
        Let's go
      </button>
    </div>
  );

  // Step 2 Content - Profile Setup
  const Step2 = () => {
    const handlePhotoUpload = (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUser(prev => ({ ...prev, photo: event.target.result }));
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    const handleNameChange = (e) => {
      const newName = e.target.value;
      setUser(prev => ({ ...prev, username: newName }));
      
      const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || '{}');
      localStorage.setItem('clarity_currentUser', JSON.stringify({
        ...currentUser,
        username: newName
      }));
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <button 
            onClick={handlePreviousStep}
            className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold text-gray-500">Step 2 of 5</span>
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">What's your name?</h1>
          <p className="text-gray-600 mb-6">Complete your profile now.</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={user.username}
              onChange={handleNameChange}
              className="w-full px-6 pt-10 pb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Your name"
              required
            />
            <span className="absolute left-3 top-3 text-xs text-gray-400 pointer-events-none">
              Your name
            </span>
          </div>
        </div>

        <div 
          className="border border-gray-200 rounded-lg p-4 mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => document.getElementById('photo-upload').click()}
        >
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-lg mr-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="font-medium">Upload your photo </span>
              <span className="text-gray-400">(optional)</span>
            </div>
          </div>
          <input 
            type="file" 
            id="photo-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </div>

        <button 
          onClick={handleNextStep}
          disabled={!user.username.trim()}
          className={`w-full text-white py-3 px-6 rounded-lg font-medium transition ${
            !user.username.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Continue
        </button>
      </div>
    );
  };


  // Step 3 Content
  const Step3 = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5 flex items-start">
        <button 
          onClick={() => setCurrentStep(2)}
          className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold hover:bg-gray-100 text-gray-500 cursor-pointer">Step 3 of 4</span>
        </button>
      </div>
      <div>
        <h1 className="text-3xl font-bold mt-2">How do you plan to use Clarity?</h1>
        <p className="text-gray-600 mt-6 mb-7 text-sm">Select one to get started. You can always incorporate the other later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div 
          className={`border rounded-lg p-6 w-70 text-center cursor-pointer transition-all ${selectedUsage === 'myself' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
          onClick={() => {
            setSelectedUsage('myself');
            setTimeout(() => setCurrentStep(4), 800);
          }}
        >
          {selectedUsage === 'myself' && (
            <div className="flex justify-end">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="h-20 flex items-center justify-center">
            <img src="/images/1st.png" alt="Personal use" className="h-full object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-lg mt-4">For Myself</h3>
            <p className="text-gray-600 text-sm mt-2">I want to organize my personal tasks and projects.</p>
          </div>
        </div>

        <div 
          className={`border rounded-lg p-6 w-70 text-center cursor-pointer transition-all ${selectedUsage === 'team' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
          onClick={() => {
            setSelectedUsage('team');
            setTimeout(() => setCurrentStep(5), 800);
          }}
        >
          {selectedUsage === 'team' && (
            <div className="flex justify-end">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="h-20 flex items-center justify-center">
            <img src="/images/2nd.png" alt="Team use" className="h-full object-contain" />
          </div>
          <h3 className="font-bold text-lg mt-4">With My Team</h3>
          <p className="text-gray-600 text-sm mt-2">I want a simple yet powerful tool for my work team.</p>
        </div>
      </div>
    </div>
  );

  // Step 4 Content
  const Step4 = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5 flex items-start">
        <button 
          onClick={() => setCurrentStep(3)}
          className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold hover:bg-gray-100 text-gray-500 cursor-pointer">Step 4 of 4</span>
        </button>
      </div>
      <div>
        <h1 className="text-3xl font-bold mt-2 ml-3">How do you currently manage tasks?</h1>
        <p className="text-gray-600 mt-4 mb-7 text-sm ml-3">Pick the option that you use the most.</p>
      </div>

      <div className="space-y-4">
        {['A', 'B', 'C', 'D'].map((option, index) => (
          <div 
            key={option}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedTaskMethod === option ? 'border-red-400' : 'border-gray-200'}`}
            onClick={() => {
              setSelectedTaskMethod(option);
              setTimeout(() => setCurrentStep(5), 800);
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              {option}
            </div>
            <div className={`${selectedTaskMethod === option ? 'font-semibold' : ''}`}>
              {[
                "I write them on paper or on a digital note",
                "I use a different task management app",
                "I create events in my digital calendar",
                "I try to remember them"
              ][index]}
            </div>
            
            {selectedTaskMethod === option && (
              <div className="ml-auto text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Step 5 Content (Calendar selection)
  const Step5 = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-start">
        <button 
          onClick={() => {
            if (selectedUsage === 'team') {
              setCurrentStep(4);
            } else {
              setCurrentStep(5);
            }
          }}
          className="mr-4 p-1 rounded-full cursor-pointer hover:bg-gray-100 mt-1"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold mt-2">How do you manage events?</h1>
          <p className="text-gray-600 mt-2">See your tasks and events side-by-side to get the full picture.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
            selectedCalendar === 'google' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
          }`}
          onClick={() => {
            setSelectedCalendar('google');
            setTimeout(completeOnboarding, 800);
          }}
        >
          {selectedCalendar === 'google' && (
            <div className="flex justify-end">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="h-20 flex items-center justify-center">
            <img src="/images/google calender.png" alt="Google Calendar" className="h-full object-contain" />
          </div>
          <h3 className="font-semibold text-md mt-4">Connect Google Calendar</h3>
        </div>

        <div 
          className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
            selectedCalendar === 'outlook' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
          }`}
          onClick={() => {
            setSelectedCalendar('outlook');
            setTimeout(completeOnboarding, 800);
          }}
        >
          {selectedCalendar === 'outlook' && (
            <div className="flex justify-end">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="h-20 flex items-center justify-center">
            <img src="/images/outlook calender.png" alt="Outlook Calendar" className="h-full object-contain" />
          </div>
          <h3 className="font-semibold text-md mt-4">Connect Outlook Calendar</h3>
        </div>
      </div>

      <button 
        onClick={completeOnboarding}
        className="w-full max-w-xs mx-auto bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
      >
        Skip
      </button>
    </div>
  );

  // ✅ Complete Onboarding
  const completeOnboarding = () => {
    // Save onboarding preferences to localStorage
    const currentUser = JSON.parse(localStorage.getItem('clarity_currentUser') || {});
    
    localStorage.setItem('clarity_currentUser', JSON.stringify({
      ...currentUser,
      onboardingComplete: true,
      preferences: {
        usage: selectedUsage,
        calendar: selectedCalendar,
        taskMethod: selectedTaskMethod,
        photo: user.photo
      }
    }));
    
    // Create user tasks if they don't exist
    if (!localStorage.getItem('clarity_tasks')) {
      localStorage.setItem('clarity_tasks', JSON.stringify([]));
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-20 py-10">
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
      {currentStep === 4 && <Step4 />}
      {currentStep === 5 && <Step5 />}
    </div>
  );
}





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // ✅ Use live backend URL
// const API_URL = "https://task-manager-1-2nko.onrender.com ";

// document.title = "Onboarding – Clarity";

// export default function OnboardingSteps() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedUsage, setSelectedUsage] = useState(null);
//   const [selectedCalendar, setSelectedCalendar] = useState(null);
//   const [selectedTaskMethod, setSelectedTaskMethod] = useState(null);
//   const [user, setUser] = useState({
//     username: '',
//     email: '',
//     photo: null
//   });
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

  
//   // 🔁 Fetch user data on load
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/user/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   // 🧑‍💼 Step 2: Profile Setup
//   const Step2 = () => {
//     const handlePhotoUpload = async (e) => {
//       if (e.target.files && e.target.files[0]) {
//         const formData = new FormData();
//         formData.append('photo', e.target.files[0]);

//         try {
//           const response = await axios.patch(`${API_URL}/api/user/`, formData, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           });
//           setUser(response.data);
//         } catch (error) {
//           console.error('Error uploading photo:', error);
//         }
//       }
//     };

//     const handleNameChange = async (e) => {
//       const newName = e.target.value;
//       try {
//         const response = await axios.patch(`${API_URL}/api/user/`, { username: newName }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error('Failed to update name:', error);
//       }
//     };

//     const handleNextStep = () => {
//       if (user.username.trim()) {
//         setCurrentStep(3);
//       } else {
//         alert("Please enter your name to continue.");
//       }
//     };

//     return (
//       <div className="max-w-md mx-auto">
//         <div className="flex items-center mb-4">
//           <button
//             onClick={() => setCurrentStep(1)}
//             className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
//           >
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 2 of 4</span>
//           </button>
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-2">What's your name?</h1>
//           <p className="text-gray-600 mb-6">Complete your profile now.</p>
//         </div>

//         <div className="mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               value={user.username}
//               onChange={handleNameChange}
//               className="w-full px-6 pt-10 pb-4 border border-gray-300 rounded-lg focus:border-none focus:ring-2 focus:ring-red-300"
//               placeholder="Your name"
//             />
//             <span className="absolute left-3 top-3 text-xs text-gray-400 pointer-events-none">
//               Your name
//             </span>
//           </div>
//         </div>

//         <div
//           className="border border-gray-200 rounded-lg p-4 mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
//           onClick={() => document.getElementById('photo-upload').click()}
//         >
//           <div className="flex items-center">
//             <div className="bg-gray-100 p-3 rounded-lg mr-3">
//               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <div>
//               <span className="font-medium">Upload your photo </span>
//               <span className="text-gray-400">(optional)</span>
//             </div>
//           </div>
//           <input
//             type="file"
//             id="photo-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handlePhotoUpload}
//           />
//         </div>

//         <button
//           onClick={handleNextStep}
//           className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white py-3 px-6 rounded-lg font-medium transition-colors"
//         >
//           Continue
//         </button>
//       </div>
//     );
//   };

//   // 📅 Step 3: Calendar Setup
//   const Step3 = () => (
//     <div className="max-w-3xl mx-auto">
//       <div className="mb-5 flex items-start">
//         <button
//           onClick={() => setCurrentStep(2)}
//           className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
//         >
//           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 3 of 4</span>
//         </button>
//       </div>

//       <div>
//         <h1 className="text-3xl font-bold mt-2">How do you manage events?</h1>
//         <p className="text-gray-600 mt-2">See your tasks and events side-by-side to get the full picture.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
//         <div
//           className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
//             selectedCalendar === 'google' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedCalendar('google');
//             setTimeout(() => setCurrentStep(4), 800);
//           }}
//         >
//           {selectedCalendar === 'google' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <img src="/images/google-calendar.png" alt="Google Calendar" className="h-full object-contain" />
//           </div>
//           <h3 className="font-semibold text-md mt-4">Connect Google Calendar</h3>
//         </div>

//         <div
//           className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
//             selectedCalendar === 'outlook' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedCalendar('outlook');
//             setTimeout(() => setCurrentStep(4), 800);
//           }}
//         >
//           {selectedCalendar === 'outlook' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <img src="/images/outlook-calendar.png" alt="Outlook Calendar" className="h-full object-contain" />
//           </div>
//           <h3 className="font-semibold text-md mt-4">Connect Outlook Calendar</h3>
//         </div>
//       </div>

//       <button
//         onClick={() => setCurrentStep(4)}
//         className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
//       >
//         Skip
//       </button>
//     </div>
//   );

//   // ✅ Step 4: Task Method (Optional)
//   const Step4 = () => (
//     <div className="max-w-3xl mx-auto">
//       <div className="mb-5 flex items-start">
//         <button
//           onClick={() => setCurrentStep(3)}
//           className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
//         >
//           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 4 of 4</span>
//         </button>
//       </div>

//       <div>
//         <h1 className="text-3xl font-bold mb-2">How do you like to add tasks?</h1>
//         <p className="text-gray-600 mb-6">Choose your preferred method to add tasks.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div
//           className={`border rounded-lg p-6 w-70 text-center cursor-pointer transition-all ${
//             selectedTaskMethod === 'myself' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedTaskMethod('myself');
//             setTimeout(() => setCurrentStep(5), 800);
//           }}
//         >
//           {selectedTaskMethod === 'myself' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </div>
//           <h3 className="font-semibold text-md mt-4">Add manually</h3>
//           <p className="text-sm text-gray-500 mt-2">Use the task form to add tasks yourself</p>
//         </div>

//         <div
//           className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
//             selectedTaskMethod === 'email' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedTaskMethod('email');
//             setTimeout(() => setCurrentStep(5), 800);
//           }}
//         >
//           {selectedTaskMethod === 'email' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <h3 className="font-semibold text-md mt-4">Email tasks</h3>
//           <p className="text-sm text-gray-500 mt-2">Send tasks to a special email</p>
//         </div>
//       </div>

//       <button
//         onClick={() => setCurrentStep(5)}
//         className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
//       >
//         Skip
//       </button>
//     </div>
//   );

//   // ✅ Step 5: Usage Setup
//   const Step5 = () => (
//     <div className="max-w-3xl mx-auto">
//       <div className="mb-5 flex items-start">
//         <button
//           onClick={() => setCurrentStep(4)}
//           className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
//         >
//           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 5 of 4</span>
//         </button>
//       </div>

//       <div>
//         <h1 className="text-3xl font-bold mb-2">What's your main use case?</h1>
//         <p className="text-gray-600 mb-6">Choose your main use case to personalize Clarity for you.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div
//           className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
//             selectedUsage === 'myself' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedUsage('myself');
//             setTimeout(completeOnboarding, 800);
//           }}
//         >
//           {selectedUsage === 'myself' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </div>
//           <h3 className="font-semibold text-md mt-4">For myself</h3>
//           <p className="text-sm text-gray-500 mt-2">Manage your personal tasks and goals</p>
//         </div>

//         <div
//           className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
//             selectedUsage === 'team' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
//           }`}
//           onClick={() => {
//             setSelectedUsage('team');
//             setTimeout(completeOnboarding, 800);
//           }}
//         >
//           {selectedUsage === 'team' && (
//             <div className="flex justify-end">
//               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           )}
//           <div className="h-20 flex items-center justify-center">
//             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20H7a2 2 0 01-2-2V6a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h-2a2 2 0 01-2-2v-5a2 2 0 012-2h2v9a2 2 0 01-2 2z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15h0" />
//             </svg>
//           </div>
//           <h3 className="font-semibold text-md mt-4">For my team</h3>
//           <p className="text-sm text-gray-500 mt-2">Collaborate with your team on shared goals</p>
//         </div>
//       </div>

//       <button
//         onClick={completeOnboarding}
//         className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
//       >
//         Skip
//       </button>
//     </div>
//   );

//   // ✅ Complete Onboarding
//   const completeOnboarding = async () => {
//     try {
//       await axios.post(`${API_URL}/api/complete-onboarding/`, {}, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Error completing onboarding:', error);
//       navigate('/dashboard');
//     }
//   };

//   if (loading) {
//     return <div>Loading user data...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-20 py-10">
//       {currentStep === 2 && <Step2 />}
//       {currentStep === 3 && <Step3 />}
//       {currentStep === 4 && <Step4 />}
//       {currentStep === 5 && <Step5 />}
//     </div>
//   );
// }









  return (
  //     <div className="max-w-md mx-auto">
  //       <div className="flex items-center mb-4">
  //         <button
  //           onClick={() => setCurrentStep(1)}
  //           className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
  //         >
  //           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  //           </svg>
  //           <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 2 of 4</span>
  //         </button>
  //       </div>

  //       <div>
  //         <h1 className="text-3xl font-bold mb-2">What's your name?</h1>
  //         <p className="text-gray-600 mb-6">Complete your profile now.</p>
  //       </div>

  //       <div className="mb-6">
  //         <div className="relative">
  //           <input
  //             type="text"
  //             value={user.username}
  //             onChange={handleNameChange}
  //             className="w-full px-6 pt-10 pb-4 border border-gray-300 rounded-lg focus:border-none focus:ring-2 focus:ring-red-300"
  //             placeholder="Your name"
  //           />
  //           <span className="absolute left-3 top-3 text-xs text-gray-400 pointer-events-none">
  //             Your name
  //           </span>
  //         </div>
  //       </div>

  //       <div
  //         className="border border-gray-200 rounded-lg p-4 mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
  //         onClick={() => document.getElementById('photo-upload').click()}
  //       >
  //         <div className="flex items-center">
  //           <div className="bg-gray-100 p-3 rounded-lg mr-3">
  //             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  //             </svg>
  //           </div>
  //           <div>
  //             <span className="font-medium">Upload your photo </span>
  //             <span className="text-gray-400">(optional)</span>
  //           </div>
  //         </div>
  //         <input
  //           type="file"
  //           id="photo-upload"
  //           className="hidden"
  //           accept="image/*"
  //           onChange={handlePhotoUpload}
  //         />
  //       </div>

  //       <button
  //         onClick={handleNextStep}
  //         className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white py-3 px-6 rounded-lg font-medium transition-colors"
  //       >
  //         Continue
  //       </button>
  //     </div>
  //   );
  // };

  // // 📅 Step 3: Calendar Setup
  // const Step3 = () => (
  //   <div className="max-w-3xl mx-auto">
  //     <div className="mb-5 flex items-start">
  //       <button
  //         onClick={() => setCurrentStep(2)}
  //         className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
  //       >
  //         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  //         </svg>
  //         <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 3 of 4</span>
  //       </button>
  //     </div>

  //     <div>
  //       <h1 className="text-3xl font-bold mt-2">How do you manage events?</h1>
  //       <p className="text-gray-600 mt-2">See your tasks and events side-by-side to get the full picture.</p>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
  //       <div
  //         className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
  //           selectedCalendar === 'google' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedCalendar('google');
  //           setTimeout(() => setCurrentStep(4), 800);
  //         }}
  //       >
  //         {selectedCalendar === 'google' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <img src="/images/google-calendar.png" alt="Google Calendar" className="h-full object-contain" />
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">Connect Google Calendar</h3>
  //       </div>

  //       <div
  //         className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
  //           selectedCalendar === 'outlook' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedCalendar('outlook');
  //           setTimeout(() => setCurrentStep(4), 800);
  //         }}
  //       >
  //         {selectedCalendar === 'outlook' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <img src="/images/outlook-calendar.png" alt="Outlook Calendar" className="h-full object-contain" />
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">Connect Outlook Calendar</h3>
  //       </div>
  //     </div>

  //     <button
  //       onClick={() => setCurrentStep(4)}
  //       className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
  //     >
  //       Skip
  //     </button>
  //   </div>
  // );

  // // ✅ Step 4: Task Method (Optional)
  // const Step4 = () => (
  //   <div className="max-w-3xl mx-auto">
  //     <div className="mb-5 flex items-start">
  //       <button
  //         onClick={() => setCurrentStep(3)}
  //         className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
  //       >
  //         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  //         </svg>
  //         <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 4 of 4</span>
  //       </button>
  //     </div>

  //     <div>
  //       <h1 className="text-3xl font-bold mb-2">How do you like to add tasks?</h1>
  //       <p className="text-gray-600 mb-6">Choose your preferred method to add tasks.</p>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //       <div
  //         className={`border rounded-lg p-6 w-70 text-center cursor-pointer transition-all ${
  //           selectedTaskMethod === 'myself' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedTaskMethod('myself');
  //           setTimeout(() => setCurrentStep(5), 800);
  //         }}
  //       >
  //         {selectedTaskMethod === 'myself' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  //           </svg>
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">Add manually</h3>
  //         <p className="text-sm text-gray-500 mt-2">Use the task form to add tasks yourself</p>
  //       </div>

  //       <div
  //         className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
  //           selectedTaskMethod === 'email' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedTaskMethod('email');
  //           setTimeout(() => setCurrentStep(5), 800);
  //         }}
  //       >
  //         {selectedTaskMethod === 'email' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  //           </svg>
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">Email tasks</h3>
  //         <p className="text-sm text-gray-500 mt-2">Send tasks to a special email</p>
  //       </div>
  //     </div>

  //     <button
  //       onClick={() => setCurrentStep(5)}
  //       className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
  //     >
  //       Skip
  //     </button>
  //   </div>
  // );

  // // ✅ Step 5: Usage Setup
  // const Step5 = () => (
  //   <div className="max-w-3xl mx-auto">
  //     <div className="mb-5 flex items-start">
  //       <button
  //         onClick={() => setCurrentStep(4)}
  //         className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
  //       >
  //         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  //         </svg>
  //         <span className="text-sm font-semibold text-gray-500 cursor-pointer">Step 5 of 4</span>
  //       </button>
  //     </div>

  //     <div>
  //       <h1 className="text-3xl font-bold mb-2">What's your main use case?</h1>
  //       <p className="text-gray-600 mb-6">Choose your main use case to personalize Clarity for you.</p>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //       <div
  //         className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
  //           selectedUsage === 'myself' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedUsage('myself');
  //           setTimeout(completeOnboarding, 800);
  //         }}
  //       >
  //         {selectedUsage === 'myself' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  //           </svg>
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">For myself</h3>
  //         <p className="text-sm text-gray-500 mt-2">Manage your personal tasks and goals</p>
  //       </div>

  //       <div
  //         className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
  //           selectedUsage === 'team' ? 'border-red-400 shadow-md' : 'border-gray-200 hover:shadow-md'
  //         }`}
  //         onClick={() => {
  //           setSelectedUsage('team');
  //           setTimeout(completeOnboarding, 800);
  //         }}
  //       >
  //         {selectedUsage === 'team' && (
  //           <div className="flex justify-end">
  //             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //         )}
  //         <div className="h-20 flex items-center justify-center">
  //           <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20H7a2 2 0 01-2-2V6a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2z" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h-2a2 2 0 01-2-2v-5a2 2 0 012-2h2v9a2 2 0 01-2 2z" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15h0" />
  //           </svg>
  //         </div>
  //         <h3 className="font-semibold text-md mt-4">For my team</h3>
  //         <p className="text-sm text-gray-500 mt-2">Collaborate with your team on shared goals</p>
  //       </div>
  //     </div>

  //     <button
  //       onClick={completeOnboarding}
  //       className="w-full max-w-xs mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
  //     >
  //       Skip
  //     </button>
  //   </div>
  // );