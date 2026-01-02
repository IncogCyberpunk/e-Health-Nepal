import React, { useState } from 'react';
import { Search, FileText, Calendar, Hospital, User, LogOut, Menu, X, Activity, Shield, Bell, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const mockHealthRecords = [
  {
    id: 1,
    record_type: 'lab_report',
    title: 'Blood Test Report',
    description: 'Complete Blood Count - All parameters normal',
    issued_by: 'Grande International Hospital',
    issued_date: '2024-12-15'
  },
  {
    id: 2,
    record_type: 'vaccination',
    title: 'COVID-19 Vaccination',
    description: 'Second dose of Covishield vaccine administered',
    issued_by: 'Nepal Health Ministry',
    issued_date: '2024-11-20'
  },
  {
    id: 3,
    record_type: 'prescription',
    title: 'General Checkup Prescription',
    description: 'Prescribed paracetamol for mild fever',
    issued_by: 'Bir Hospital',
    issued_date: '2024-12-01'
  },
  {
    id: 4,
    record_type: 'hospital_visit',
    title: 'Annual Health Checkup',
    description: 'Routine checkup - All vitals normal',
    issued_by: 'Manipal Teaching Hospital',
    issued_date: '2024-11-30'
  }
];

function Dashboard({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const filteredRecords = mockHealthRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRecordIcon = (type) => {
    switch (type) {
      case 'lab_report': return <FileText className="w-5 h-5" />;
      case 'vaccination': return <Activity className="w-5 h-5" />;
      case 'prescription': return <FileText className="w-5 h-5" />;
      case 'hospital_visit': return <Hospital className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case 'lab_report': return 'bg-blue-100 text-blue-700';
      case 'vaccination': return 'bg-green-100 text-green-700';
      case 'prescription': return 'bg-purple-100 text-purple-700';
      case 'hospital_visit': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatRecordType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

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
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
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
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              <option value="lab_report">Lab Reports</option>
              <option value="vaccination">Vaccinations</option>
              <option value="prescription">Prescriptions</option>
              <option value="hospital_visit">Hospital Visits</option>
            </select>
          </div>
        </div>

        {/* Health Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getRecordColor(record.record_type)}`}>
                  {getRecordIcon(record.record_type)}
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {formatRecordType(record.record_type)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{record.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{record.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <Hospital className="w-4 h-4" />
                  <span className="truncate">{record.issued_by}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{record.issued_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No records found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-xl ${getRecordColor(selectedRecord.record_type)}`}>
                  {getRecordIcon(selectedRecord.record_type)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRecord.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatRecordType(selectedRecord.record_type)}</p>
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
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                <p className="text-gray-900 dark:text-white">{selectedRecord.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issued By</h4>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.issued_by}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issue Date</h4>
                  <p className="text-gray-900 dark:text-white">{selectedRecord.issued_date}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Document preview would appear here in production version
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Share Record
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
