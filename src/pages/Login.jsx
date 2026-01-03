import React, { useState } from 'react';
import { Shield, Moon, Sun, Loader, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function Login({ onLogin, onBack }) {
  const [nidNumber, setNidNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogin = async () => {
    if (!nidNumber.trim()) {
      setError('Please enter your NID number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch citizen data from Supabase
      const { data: citizenData, error: citizenError } = await supabase
        .from('citizens')
        .select('*')
        .eq('nid_number', nidNumber.trim())
        .single();

      if (citizenError) {
        if (citizenError.code === 'PGRST116') {
          setError('NID number not found. Please check and try again.');
        } else {
          setError('Error: ' + citizenError.message);
        }
        setLoading(false);
        return;
      }

      // Calculate age
      const dob = new Date(citizenData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - 
        (today.getMonth() < dob.getMonth() || 
         (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);

      // Pass citizen data to parent
      onLogin({
        ...citizenData,
        age: age
      });
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
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
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">E-Governance Nepal</h1>
          <p className="text-gray-600 dark:text-gray-300">Centralized Health Records System</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Citizen Login</h2>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                National ID Number (NID)
              </label>
              <input
                type="text"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your NID number (e.g., 104-332-181-9)"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access My Records'
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p>Your data is secured with government-grade encryption and accessible only by you.</p>
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

export default Login;