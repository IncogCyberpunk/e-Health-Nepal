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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center flex-col p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center mb-12 relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-2xl ring-4 ring-white dark:ring-gray-700">
              <img
                src="/logo.png"
                alt="E-Governance Nepal Logo"
                className="w-50 h-50 object-contain"
              />
            </div>
          </div>
        </div>


        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
          e-Health Nepal
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Centralized Health Records System
        </p>
      </div>

      <div className="max-w-6xl w-full flex justify-center relative z-10">
        <div className="flex gap-8">
          {/* Citizen Portal Card */}
          <div
            onClick={() => navigate('/citizen')}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 cursor-pointer hover:shadow-3xl transition-all transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 w-80 group"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Citizen Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Access your personal health records
            </p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Login as Citizen
            </button>
          </div>

          {/* Hospital Portal Card */}
          <div
            onClick={() => navigate('/hospital')}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 cursor-pointer hover:shadow-3xl transition-all transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 w-80 group"
          >
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/40 dark:to-teal-800/40 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <Hospital className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Hospital Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Patient lookup and record management
            </p>
            <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Login as Hospital Staff
            </button>
          </div>

          {/* gov Portal Card */}
          <div
            onClick={() => navigate('/gov')}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 cursor-pointer hover:shadow-3xl transition-all transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 w-80 group"
          >
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Government Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Analytics and oversight dashboard
            </p>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Login as Administrator
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mt-12 font-semibold relative z-10">
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
