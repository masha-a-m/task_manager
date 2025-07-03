// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

document.title = 'Clarity - Dashboard';


export default function Dashboard() {
  const [tasks, setTasks] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [selectedTaskMethod, setSelectedTaskMethod] = useState(null);
  const [teamSelected, setTeamSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is new (you'll need to implement this logic)
    const checkUserStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user-status/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setIsNewUser(response.data.is_new_user);
      } catch (err) {
        console.error('Error checking user status:', err);
      }
    };

    // Fetch user data
    const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    console.log('User data response:', response.data); // Add this line
    setUser(response.data);
  } catch (err) {
    console.error('Error fetching user data:', err);
    setError(err); // Make sure to set the error state
  } finally {
    setLoading(false); // Make sure to set loading to false
  }
};
        

    fetchUserData();
    checkUserStatus();
  }, []);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      axios.post('http://localhost:8000/api/complete-onboarding/', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setIsNewUser(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data: {error.message}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        {/* User Profile */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="ml-3 font-medium">{user.username}</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="ml-3">Search</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="ml-3">Calendar</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3">Tasks</span>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider">My Projects</h3>
            <p className="mt-2 text-gray-400 text-sm">Your projects will appear here</p>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12">
  {isNewUser ? (
    <div className="max-w-2xl">
      {/* Step 1 Content */}
      {currentStep === 1 && (
        <>
          <div className="mb-8">
            <span className="text-sm text-gray-500 font-semibold">Step {currentStep} of 4</span>
            <h1 className="text-3xl font-bold mt-2">Welcome to Clarity</h1>
            <p className="text-gray-600 mt-2">We're excited to help you bring calm back to work and life.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 bg-pink-50">
            <h2 className="font-bold text-lg mb-8">Clarity can help you...</h2>
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
            className="mt-12 bg-red-500 hover:bg-red-600 text-white py-3 px-40 rounded-md font-medium transition-colors cursor-pointer"
          >
            Let's go
          </button>
        </>
      )}

      {/* Step 2 Content */}
      {currentStep === 2 && (
        <div className="max-w-md">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setCurrentStep(1)}
              className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            <span onClick={() => setCurrentStep(1)} className="text-sm font-semibold hover:bg-gray-100 text-gray-500 cursor-pointer">Step 2 of 4</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-2">What's your name?</h1>
          <p className="text-gray-600 mb-6">Complete your profile now.</p>

          {/* Editable Name Field */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={user.username}
                onChange={(e) => {
                  setUser({...user, username: e.target.value});
                }}
                className="w-full px-6 pt-10 pb-4 border border-gray-300 rounded-lg focus:border-none"
                placeholder="Your name"
              />
              <span className="absolute left-3 top-3 text-xs text-gray-400 pointer-events-none">
                Your name
              </span>
            </div>
            {/* <p className="mt-6 text-xs text-gray-500">This will be displayed on your profile</p> */}
          </div>

          {/* Photo Upload Card */}
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
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setUser({...user, photo: event.target.result});
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>

          <button 
            onClick={handleNextStep}
            className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      )}


      {/* Step 3 Content */}
      {currentStep === 3 && (
  <div className="max-w-3xl mx-auto">
    <div className="mb-5 flex items-start">
    <button 
              onClick={() => setCurrentStep(2)}
              className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            <span onClick={() => setCurrentStep(1)} className="text-sm font-semibold hover:bg-gray-100 text-gray-500 cursor-pointer">Step 3 of 4</span>
            </button>
    </div>
      <div>
        <h1 className="text-3xl font-bold mt-2">How do you plan to use Clarity?</h1>
        <p className="text-gray-600 mt-6 mb-7 text-sm">Select one to get started. You can always incorporate the other later.</p>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      {/* For Myself Card */}
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
        <h3 className="font-bold text-lg mt-4">For Myself</h3>
        <p className="text-gray-600 text-sm mt-2">I want to organize my personal tasks and projects.</p>
      </div>

      {/* With My Team Card */}
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
)}


      {/* Step 4 Content */}
      {currentStep === 4 && !teamSelected && (
  <div className="max-w-3xl mx-auto">
  <div className="mb-5 flex items-start">
    <button 
              onClick={() => setCurrentStep(3)}
              className="mr-2 p-1 rounded hover:bg-gray-100 py-2 px-2 cursor-pointer flex space-x-4"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            <span onClick={() => setCurrentStep(1)} className="text-sm font-semibold hover:bg-gray-100 text-gray-500 cursor-pointer">Step 4 of 4</span>
            </button>
    </div>
      <div>
        <h1 className="text-3xl font-bold mt-2 ml-3">How do you currently manage tasks?</h1>
        <p className="text-gray-600 mt-4 mb-7 text-sm ml-3">Pick the option that you use the most.
</p>
      </div>

      <div className="space-y-4">
      {['A', 'B', 'C', 'D'].map((option, index) => (
        <div 
          key={option}
          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedTaskMethod === option ? 'border-red-400' : 'border-gray-200'}`}
          onClick={() => {
            setSelectedTaskMethod(option);
            setTimeout(() => setCurrentStep(5), 800); // Goes to calendar selection
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
  )}




    {/* // Step 5 Content (Calendar selection - same for both paths) */}
    {currentStep === 5 && (
  <div className="max-w-3xl mx-auto">
    {/* Header with back button */}
    <div className="mb-8 flex items-start">
      <button 
        onClick={() => {
          if (selectedUsage === 'team') {
            // If came from "With My Team", go back to Step 3
            setCurrentStep(3);
          } else {
            // Otherwise go back to Step 4 (task management)
            setCurrentStep(4);
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

    {/* Calendar options */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Google Calendar Card */}
      <div 
        className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
          selectedCalendar === 'google' 
            ? 'border-red-400 shadow-md' 
            : 'border-gray-200 hover:shadow-md'
        }`}
        onClick={() => {
  setSelectedCalendar('google'); // or 'outlook'
  setTimeout(() => {
    setIsNewUser(false);
    navigate('/dashboard');
  }, 800);
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

      {/* Outlook Calendar Card */}
      <div 
        className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
          selectedCalendar === 'outlook' 
            ? 'border-red-400 shadow-md' 
            : 'border-gray-200 hover:shadow-md'
        }`}
        onClick={() => {
  setSelectedCalendar('outlook'); // or 'outlook'
  setTimeout(() => {
    setIsNewUser(false);
    navigate('/dashboard');
  }, 800);
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

    {/* Skip button */}
    <button 
       onClick={async () => {
    try {
      // Only make the API call if the endpoint exists
      await axios.post('http://localhost:8000/api/complete-onboarding/', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
    } catch (error) {
      console.log('Onboarding completion not required or endpoint not available');
    } finally {
      setIsNewUser(false);
      navigate('/dashboard');
    }
      }}
      className="w-full max-w-xs mx-auto bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
    >
      Skip
    </button>
  </div>
)}
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
    </div>
  )}
</div>
    </div>
  );
};
























