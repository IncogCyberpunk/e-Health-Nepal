import React, { useState } from 'react';
import { Shield, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const mockUser = {
  nid_number: '1234567890',
  full_name: 'Ram Bahadur Thapa',
  date_of_birth: '1985-05-15',
  blood_group: 'A+',
  phone: '+977-9801234567',
  email: 'ram.thapa@email.com',
  address: 'Kathmandu, Nepal'
};

function Login({ onLogin, onBack  }) {
  const [nidNumber, setNidNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (nidNumber === '1234567890') {
        onLogin(mockUser);
      } else {
        alert('Invalid NID number. Try: 1234567890');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Add Back Button */}
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
          >
            ← Back to portal selection
          </button>
        )}
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">E-Governance Nepal</h1>
          <p className="text-gray-600 dark:text-gray-300">Centralized Health Records System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Citizen Login</h2>

          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                National ID Number (NID)
              </label>
              <input
                type="text"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                placeholder="Enter your NID number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Demo NID: 1234567890</p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Access My Records'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p>Your data is secured with government-grade encryption and accessible only by you.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Ministry of Health and Population, Nepal
        </p>
      </div>
    </div>
  );
}

export default Login;
