import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';

import HospitalLogin from './pages/HospitalLogin';
import HospitalDashboard from './pages/HospitalDashboard';

import GovLogin from './pages/GovLogin';
import GovDashboard from './pages/GovDashboard';

import { DarkModeProvider } from './contexts/DarkModeContext';
import { Shield, Users, Hospital } from 'lucide-react';

function PortalSelection() {
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-col p-4 dark:bg-gradient-to-br dark:from-indigo-950 dark:via-slate-900 dark:to-gray-900 ">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          E-Governance Nepal
        </h1>
        <p className="text-3xl text-white">
          Centralized Health Records System
        </p>
      </div>

      <div className="max-w-6xl w-full flex justify-center">
        <div className="flex md:grid-cols-3 gap-6 ">
          {/* Citizen Portal Card */}
          <div
            onClick={() => navigate('/citizen')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1 border rounded-2xl"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Citizen Portal
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Access your personal health records
            </p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Login as Citizen
            </button>
          </div>

          {/* Hospital Portal Card */}
          <div
            onClick={() => navigate('/hospital')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1 border rounded-2xl"
          >
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Hospital className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Hospital Portal
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Patient lookup and record management
            </p>
            <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
              Login as Hospital Staff
            </button>
          </div>

          {/* gov Portal Card */}
          {/* <div */}
          {/*   onClick={() => navigate('/gov')} */}
          {/*   className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1" */}
          {/* > */}
          {/*   <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"> */}
          {/*     <Shield className="w-8 h-8 text-indigo-600" /> */}
          {/*   </div> */}
          {/*   <h2 className="text-2xl font-bold text-gray-900 text-center mb-2"> */}
          {/*     Government Portal */}
          {/*   </h2> */}
          {/*   <p className="text-gray-600 text-center mb-6"> */}
          {/*     Analytics and oversight dashboard */}
          {/*   </p> */}
          {/*   <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"> */}
          {/*     Login as Administrator */}
          {/*   </button> */}
          {/* </div> */}
        </div>
      </div>

      <p className="text-center text-2xl text-white mt-8 font-extrabold">
        Ministry of Health and Population, Nepal
      </p>
    </div>
  );
}

function ProtectedRoute({ children, isLoggedIn, redirectTo }) {
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

export default function App() {
  // Load user from localStorage on initial render
  const [citizenUser, setCitizenUser] = useState(() => {
    const saved = localStorage.getItem('citizenUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [govUser, setGovUser] = useState(() => {
    const saved = localStorage.getItem('govUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [hospitalUser, setHospitalUser] = useState(() => {
    const saved = localStorage.getItem('hospitalUser');
    return saved ? JSON.parse(saved) : null;
  });

  const handleCitizenLogin = (userData) => {
    setCitizenUser(userData);
    localStorage.setItem('citizenUser', JSON.stringify(userData));
  };

  const handleGovLogin = (userData) => {
    setGovUser(userData);
    localStorage.setItem('govUser', JSON.stringify(userData));
  };

  const handleHospitalLogin = (userData) => {
    setHospitalUser(userData);
    localStorage.setItem('hospitalUser', JSON.stringify(userData));
  };

  const handleCitizenLogout = () => {
    setCitizenUser(null);
    localStorage.removeItem('citizenUser');
  };

  const handleGovLogout = () => {
    setGovUser(null);
    localStorage.removeItem('govUser');
  };

  const handleHospitalLogout = () => {
    setHospitalUser(null);
    localStorage.removeItem('hospitalUser');
  };

  return (
    <Routes>
      {/* Home - Portal Selection */}
      <Route path="/" element={<PortalSelection />} />

      {/* Citizen Routes */}
      <Route
        path="/citizen"
        element={
          citizenUser ? (
            <Navigate to="/citizen/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleCitizenLogin} />
          )
        }
      />
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute isLoggedIn={citizenUser} redirectTo="/citizen">
            <Dashboard user={citizenUser} onLogout={handleCitizenLogout} />
          </ProtectedRoute>
        }
      />

      {/* Hospital Routes */}
      <Route
        path="/hospital"
        element={
          hospitalUser ? (
            <Navigate to="/hospital/dashboard" replace />
          ) : (
            <HospitalLogin onLogin={handleHospitalLogin} />
          )
        }
      />
      <Route
        path="/hospital/dashboard"
        element={
          <ProtectedRoute isLoggedIn={hospitalUser} redirectTo="/hospital">
            <HospitalDashboard user={hospitalUser} onLogout={handleHospitalLogout} />
          </ProtectedRoute>
        }
      />

      {/* Government Routes */}
      <Route
        path="/gov"
        element={
          govUser ? (
            <Navigate to="/gov/dashboard" replace />
          ) : (
            <GovLogin onLogin={handleGovLogin} />
          )
        }
      />
      <Route
        path="/gov/dashboard"
        element={
          <ProtectedRoute isLoggedIn={govUser} redirectTo="/gov">
            <GovDashboard user={govUser} onLogout={handleGovLogout} />
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
