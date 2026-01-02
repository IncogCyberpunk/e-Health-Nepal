import React, { useState } from 'react';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import GovLogin from './pages/GovLogin';
import GovDashboard from './pages/GovDashboard';
import HospitalLogin from './pages/HospitalLogin';
import HospitalDashboard from './pages/HospitalDashboard';

import { DarkModeProvider } from './contexts/DarkModeContext';
import { Shield, Users, Hospital } from 'lucide-react';

export default function App() {
  const [userType, setUserType] = useState(null); // 'citizen', 'government', or 'hospital'
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCitizenLogin = (userData) => {
    setUser(userData);
    setUserType('citizen');
    setIsLoggedIn(true);
  };

  const handleGovLogin = (userData) => {
    setUser(userData);
    setUserType('government');
    setIsLoggedIn(true);
  };

  const handleHospitalLogin = (userData) => {
    setUser(userData);
    setUserType('hospital');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
  };

  const handleBackToSelection = () => {
    setUserType(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <DarkModeProvider>
      {/* Portal Selection Screen */}
      {!userType && !isLoggedIn && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-col p-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              E-Governance Nepal
            </h1>
            <p className="text-xl text-gray-600">
              Centralized Health Records System
            </p>
          </div>

          <div className="max-w-6xl w-full flex justify-center">
            <div className=" md:grid-cols-3 gap-6 flex justify-center">
              {/* Citizen Portal Card */}
              <div
                onClick={() => setUserType('citizen')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
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
                onClick={() => setUserType('hospital')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
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

              {/* Government Portal Card */}
              <div
                onClick={() => setUserType('government')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Government Portal
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Analytics and oversight dashboard
                </p>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Login as Administrator
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-2xl text-gray-600 mt-8 font-bold ">
            Ministry of Health and Population, Nepal
          </p>

        </div>
      )}

      {/* Citizen Portal */}
      {userType === 'citizen' && !isLoggedIn && (
        <LoginPage onLogin={handleCitizenLogin} onBack={handleBackToSelection} />
      )}
      {userType === 'citizen' && isLoggedIn && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}

      {/* Hospital Portal */}
      {userType === 'hospital' && !isLoggedIn && (
        <HospitalLogin onLogin={handleHospitalLogin} onBack={handleBackToSelection} />
      )}
      {userType === 'hospital' && isLoggedIn && (
        <HospitalDashboard user={user} onLogout={handleLogout} />
      )}

      {/* Government Portal */}
      {userType === 'government' && !isLoggedIn && (
        <GovLogin onLogin={handleGovLogin} onBack={handleBackToSelection} />
      )}
      {userType === 'government' && isLoggedIn && (
        <GovDashboard user={user} onLogout={handleLogout} />
      )}
    </DarkModeProvider>
  );
}
