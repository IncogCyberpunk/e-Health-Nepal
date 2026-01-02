import React, { useState } from 'react';
import { 
  Hospital, LogOut, Search, User, FileText, Activity, 
  AlertCircle, Calendar, Stethoscope, Plus, X, Save,
  Clock, Moon, Sun, Menu, CheckCircle, Download
} from 'lucide-react';
import { useDarkMode } from './contexts/DarkModeContext';

// Mock patient database (in real app, this would come from Supabase)
const mockPatients = {
  '1234567890': {
    nid_number: '1234567890',
    full_name: 'Ram Bahadur Thapa',
    date_of_birth: '1985-05-15',
    age: 39,
    blood_group: 'A+',
    phone: '+977-9801234567',
    address: 'Kathmandu, Nepal',
    allergies: ['Penicillin'],
    chronic_conditions: ['Hypertension'],
    records: [
      {
        id: 1,
        date: '2024-12-15',
        type: 'lab_report',
        hospital: 'Grande International Hospital',
        diagnosis: 'Annual checkup - All parameters normal',
        prescription: 'Continue current medication',
        doctor: 'Dr. Sharma'
      },
      {
        id: 2,
        date: '2024-11-20',
        type: 'vaccination',
        hospital: 'Nepal Health Ministry',
        diagnosis: 'COVID-19 Vaccination',
        prescription: 'Second dose administered',
        doctor: 'Nurse Rani'
      }
    ]
  },
  '9876543210': {
    nid_number: '9876543210',
    full_name: 'Sita Kumari Shrestha',
    date_of_birth: '1979-08-22',
    age: 45,
    blood_group: 'B+',
    phone: '+977-9812345678',
    address: 'Lalitpur, Nepal',
    allergies: ['None'],
    chronic_conditions: ['Diabetes Type 2'],
    records: [
      {
        id: 1,
        date: '2024-12-20',
        type: 'prescription',
        hospital: 'Bir Hospital',
        diagnosis: 'Diabetes follow-up',
        prescription: 'Metformin 500mg twice daily',
        doctor: 'Dr. Pradhan'
      }
    ]
  }
};

function HospitalDashboard({ user, onLogout }) {
  const [nidSearch, setNidSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // New record form state
  const [newRecord, setNewRecord] = useState({
    type: 'prescription',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  const handleSearchPatient = () => {
    const patient = mockPatients[nidSearch];
    if (patient) {
      setSelectedPatient(patient);
    } else {
      alert('Patient not found. Try NID: 1234567890 or 9876543210');
      setSelectedPatient(null);
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.diagnosis || !newRecord.prescription) {
      alert('Please fill in all required fields');
      return;
    }

    const record = {
      id: selectedPatient.records.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type,
      hospital: user.hospital_name,
      diagnosis: newRecord.diagnosis,
      prescription: newRecord.prescription,
      doctor: user.staff_name,
      notes: newRecord.notes
    };

    // In real app, this would save to Supabase
    selectedPatient.records.unshift(record);
    
    setShowAddRecord(false);
    setNewRecord({
      type: 'prescription',
      diagnosis: '',
      prescription: '',
      notes: ''
    });
    
    alert('Record added successfully!');
  };

  const getRecordTypeLabel = (type) => {
    const labels = {
      'prescription': 'Prescription',
      'lab_report': 'Lab Report',
      'vaccination': 'Vaccination',
      'hospital_visit': 'Hospital Visit',
      'consultation': 'Consultation'
    };
    return labels[type] || type;
  };

  const getRecordColor = (type) => {
    const colors = {
      'prescription': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'lab_report': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'vaccination': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'hospital_visit': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'consultation': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Hospital className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hospital Portal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{user.hospital_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Stethoscope className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.staff_name}</span>
              </div>
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
        {/* Patient Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Patient Lookup
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={nidSearch}
                onChange={(e) => setNidSearch(e.target.value)}
                placeholder="Enter patient NID number..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Demo NIDs: 1234567890, 9876543210</p>
            </div>
            <button
              onClick={handleSearchPatient}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Patient Information */}
        {selectedPatient && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
                    <User className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPatient.full_name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">NID: {selectedPatient.nid_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddRecord(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Record</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedPatient.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blood Group</p>
                  <p className="text-red-600 dark:text-red-400 font-bold">{selectedPatient.blood_group}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedPatient.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Allergies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Chronic Conditions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.chronic_conditions.map((condition, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Medical History ({selectedPatient.records.length} records)
              </h3>

              <div className="space-y-4">
                {selectedPatient.records.map((record) => (
                  <div key={record.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecordColor(record.type)}`}>
                          {getRecordTypeLabel(record.type)}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date}
                        </div>
                      </div>
                      <button className="text-teal-600 hover:text-teal-700 dark:text-teal-400">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</p>
                        <p className="text-gray-900 dark:text-white">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prescription</p>
                        <p className="text-gray-900 dark:text-white">{record.prescription}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span>{record.hospital}</span>
                        <span>Dr. {record.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!selectedPatient && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Patient Selected</h3>
            <p className="text-gray-600 dark:text-gray-300">Enter a patient's NID number to view their medical records</p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddRecord(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Record</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For: {selectedPatient?.full_name}</p>
              </div>
              <button
                onClick={() => setShowAddRecord(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Record Type
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                >
                  <option value="prescription">Prescription</option>
                  <option value="consultation">Consultation</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="hospital_visit">Hospital Visit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  placeholder="Enter diagnosis or reason for visit..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prescription/Treatment *
                </label>
                <textarea
                  value={newRecord.prescription}
                  onChange={(e) => setNewRecord({...newRecord, prescription: e.target.value})}
                  placeholder="Enter prescription or treatment plan..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  placeholder="Any additional observations or notes..."
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddRecord(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecord}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalDashboard;