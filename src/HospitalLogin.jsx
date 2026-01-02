import React, { useState } from 'react';
import { Hospital, Moon, Sun } from 'lucide-react';
import { useDarkMode } from './contexts/DarkModeContext';

const mockHospitalUser = {
  id: 'hosp-001',
  hospital_name: 'Grande International Hospital',
  hospital_id: 'HOSP001',
  location: 'Kathmandu',
  license_number: 'LIC-2024-001',
  staff_name: 'Dr. Rajesh Kumar',
  role: 'doctor'
};

function HospitalLogin({ onLogin, onBack }) {
  const [hospitalId, setHospitalId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (hospitalId === 'HOSP001' && staffId === 'STAFF123') {
        onLogin(mockHospitalUser);
      } else {
        alert('Invalid credentials. Try: HOSP001 / STAFF123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
          >
            ← Back to portal selection
          </button>
        )}

        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-lg">
              <Hospital className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hospital Portal</h1>
          <p className="text-gray-600 dark:text-gray-300">Health Institution Access</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Staff Login</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hospital ID
              </label>
              <input
                type="text"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                placeholder="Enter hospital ID"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Staff ID
              </label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Enter your staff ID"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Demo: HOSP001 / STAFF123</p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-teal-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Access System'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Hospital className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p>Secure access for authorized healthcare professionals only.</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Ministry of Health and Population, Nepal
        </p>
      </div>
    </div>
  );
}

export default HospitalLogin;