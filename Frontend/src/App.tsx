import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import WelcomePage from './components/WelcomePage';
import AddJob from './components/AddJob';
import EditJob from './components/EditJob';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-job" element={<AddJob />} />
      <Route path="/edit-job/:id" element={<EditJob />} />
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
