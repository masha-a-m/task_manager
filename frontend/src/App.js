import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingSteps from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
    console.log("✅ App component rendered"); // Check if this logs

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding"  element={
          console.log("🚦 Route matched - rendering OnboardingSteps") || 
          <OnboardingSteps />
        }  />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;