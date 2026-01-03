import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, Hospital, User, LogOut, Menu, X, Activity, Shield, Bell, Moon, Sun, Loader, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function Dashboard({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Fetch health records on component mount
  useEffect(() => {
    fetchHealthRecords();
  }, [user.nid_number]);

  const fetchHealthRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('health_records')
        .select('*')
        .eq('nid_number', user.nid_number)
        .order('issued_date', { ascending: false });

      if (fetchError) {
        setError('Error fetching health records: ' + fetchError.message);
        console.error('Fetch error:', fetchError);
      } else {
        setHealthRecords(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRecordIcon = (type) => {
    switch (type) {
      case 'Lab Report': return <FileText className="w-5 h-5" />;
      case 'Vaccination': return <Activity className="w-5 h-5" />;
      case 'Prescription': return <FileText className="w-5 h-5" />;
      case 'IPD': return <Hospital className="w-5 h-5" />;
      case 'OPD': return <Hospital className="w-5 h-5" />;
      case 'Consultation': return <User className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case 'Lab Report': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Vaccination': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Prescription': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'IPD': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'OPD': return 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300';
      case 'Consultation': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Get unique record types for filter dropdown
  const recordTypes = ['all', ...new Set(healthRecords.map(r => r.record_type))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">E-Governance Nepal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Health Records Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button */}
              {/*   onClick={toggleDarkMode} */}
              {/*   className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition" */}
              {/* > */}
              {/*   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} */}
              {/* </button> */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">NID: {user.nid_number}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Blood Group:</span>
                    <span className="ml-2 font-semibold text-red-600 dark:text-red-400">{user.blood_group}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">DOB:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.date_of_birth}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Age:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.age} years</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search health records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Records</option>
              {recordTypes.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading health records...</span>
          </div>
        )}

        {/* Health Records Grid */}
        {!loading && filteredRecords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map(record => (
              <div
                key={record.record_id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getRecordColor(record.record_type)}`}>
                    {getRecordIcon(record.record_type)}
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {record.record_type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{record.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {record.description || record.diagnosis}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{record.issued_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No records found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {healthRecords.length === 0
                ? 'You don\'t have any health records yet'
                : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-xl ${getRecordColor(selectedRecord.record_type)}`}>
                  {getRecordIcon(selectedRecord.record_type)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRecord.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedRecord.record_type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedRecord.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Diagnosis</h4>
                <p className="text-gray-900 dark:text-white">{selectedRecord.diagnosis}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prescription/Treatment</h4>
                <p className="text-gray-900 dark:text-white">{selectedRecord.prescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issue Date</h4>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.issued_date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Institute ID</h4>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.institute_id}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
