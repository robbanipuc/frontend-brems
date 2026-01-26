import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Preloader from './components/ui/Preloader';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageOffices from './pages/ManageOffices';
import ManageDesignations from './pages/ManageDesignations';
import AdminInbox from './pages/AdminInbox';
import EmployeePortal from './pages/EmployeePortal';
import EmployeeDetails from './pages/EmployeeDetails';
import EmployeeDirectory from './pages/EmployeeDirectory'; 
import EmployeeEditProfile from './pages/EmployeeEditProfile';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ---------------------------------------------------------
    // 1. THE WAKE-UP CALL
    // This fires immediately when the app opens.
    // It pings your backend root to trigger the "Cold Start".
    // ---------------------------------------------------------
    fetch('https://brems-backend.onrender.com/')
      .then(() => console.log('Backend is awake or waking up...'))
      .catch((err) => console.log('Backend wake-up signal sent.'));

    // ---------------------------------------------------------
    // 2. YOUR EXISTING PRELOADER LOGIC
    // ---------------------------------------------------------
    const timer = setTimeout(() => setLoading(false), 1500);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Employee Self-Service */}
          <Route path="/portal" element={<EmployeePortal />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/offices" element={<ManageOffices />} />
          <Route path="/designations" element={<ManageDesignations />} />
          <Route path="/inbox" element={<AdminInbox />} />
          
          {/* Employee Management */}
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          
          {/* Catch-all (Redirects unknown pages to Login) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/profile/edit" element={<EmployeeEditProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;