import React, { useState } from 'react';
import { Hospital, Moon, Sun, Lock, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

// Hardcoded institute for MVP
const HARDCODED_INSTITUTE = {
  institute_id: 2,
  name: "Proctor, Hoffman and Gonzales Private Ltd.",
  type: "clinic",
  ownership: "private",
  is_active: true,
  license_number: "MED-16822608",
  address: "Ward No.3-Gaur Rautahat, Nepal",
  phone: "01-8379213"
};

function HospitalLogin({ onLogin, onBack }) {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (licenseNumber.trim() === 'MED-16822608' && password === 'password') {
        onLogin(HARDCODED_INSTITUTE);
      } else {
        setError('Invalid credentials. Use License: MED-16822608, Password: password');
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
        >
          ← Back to portal selection
        </button>
      )}

      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-600 p-4 rounded-2xl">
              <Hospital className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Hospital Portal
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Health Institute Login
          </p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="MED-16822608"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-5 h-5 mr-2" />
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium mb-2">
              Demo Credentials (MVP)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              License: <span className="font-mono text-teal-600 dark:text-teal-400">MED-16822608</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Password: <span className="font-mono text-teal-600 dark:text-teal-400">password</span>
            </p>
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