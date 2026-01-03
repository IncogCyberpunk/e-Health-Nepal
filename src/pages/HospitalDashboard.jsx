import React, { useState } from 'react';
import {
  Hospital, LogOut, Search, User, FileText, Activity,
  AlertCircle, Calendar, Stethoscope, Plus, X, Save,
  Clock, Moon, Sun, Menu, CheckCircle, Download, Loader, UserPlus
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function HospitalDashboard({ user, onLogout, isDarkMode, toggleDarkMode }) {
  const [nidSearch, setNidSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientNotFound, setPatientNotFound] = useState(false);

  // New record form state
  const [newRecord, setNewRecord] = useState({
    nid_number: '',
    record_type: 'Prescription',
    title: '',
    description: '',
    diagnosis: '',
    prescription: ''
  });

  const handleSearchPatient = async () => {
    if (!nidSearch.trim()) {
      setError('Please enter an NID number');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedPatient(null);
    setPatientRecords([]);
    setPatientNotFound(false);

    try {
      // Fetch citizen data
      const { data: citizenData, error: citizenError } = await supabase
        .from('citizens')
        .select('*')
        .eq('nid_number', nidSearch.trim())
        .single();

      if (citizenError) {
        if (citizenError.code === 'PGRST116') {
          setPatientNotFound(true);
          setError('Patient not found. Please verify the NID number is correct.');
        } else {
          setError('Error fetching patient data: ' + citizenError.message);
        }
        setLoading(false);
        return;
      }

      // Fetch health records
      const { data: recordsData, error: recordsError } = await supabase
        .from('health_records')
        .select('*')
        .eq('nid_number', nidSearch.trim())
        .order('issued_date', { ascending: false });

      if (recordsError) {
        console.error('Error fetching records:', recordsError);
      }

      // Calculate age from date of birth
      const dob = new Date(citizenData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() -
        (today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);

      setSelectedPatient({
        ...citizenData,
        age: age
      });
      setPatientRecords(recordsData || []);
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    const nid = selectedPatient ? selectedPatient.nid_number : newRecord.nid_number;

    if (!nid) {
      setError('NID number is required');
      return;
    }

    if (!newRecord.title || !newRecord.diagnosis || !newRecord.prescription) {
      setError('Please fill in all required fields (Title, Diagnosis, Prescription)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recordData = {
        nid_number: nid,
        institute_id: user.institute_id,
        record_type: newRecord.record_type,
        title: newRecord.title,
        description: newRecord.description || null,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription,
        issued_date: new Date().toISOString().split('T')[0]
      };

      const { data, error: insertError } = await supabase
        .from('health_records')
        .insert([recordData])
        .select();

      if (insertError) {
        setError('Error adding record: ' + insertError.message);
        setLoading(false);
        return;
      }

      // If we had a selected patient, refresh their records
      if (selectedPatient) {
        const { data: updatedRecords } = await supabase
          .from('health_records')
          .select('*')
          .eq('nid_number', selectedPatient.nid_number)
          .order('issued_date', { ascending: false });

        setPatientRecords(updatedRecords || []);
      }

      setShowAddRecord(false);
      setNewRecord({
        nid_number: '',
        record_type: 'Prescription',
        title: '',
        description: '',
        diagnosis: '',
        prescription: ''
      });
      alert('Record added successfully!');

      // If patient wasn't in system, suggest searching again
      if (!selectedPatient) {
        alert('Record added for NID: ' + nid + '. The patient may now appear in the system.');
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Add record error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecordColor = (type) => {
    const colors = {
      'Prescription': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Lab Report': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Vaccination': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'IPD': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'OPD': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
      'Consultation': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
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
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{user.name || 'Healthcare Provider'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button */}
              {/*   onClick={toggleDarkMode} */}
              {/*   className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition" */}
              {/* > */}
              {/*   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} */}
              {/* </button> */}
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Stethoscope className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.name || 'Staff'}</span>
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
                className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
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
        {/* Error Alert */}
        {error && !patientNotFound && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Patient Not Found Alert */}
        {patientNotFound && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-medium">Patient Not Found</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  NID {nidSearch} is not registered in the system. Please verify the NID number and try again.
                </p>
              </div>
              <button
                onClick={() => setPatientNotFound(false)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

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
                placeholder="Enter patient NID number (e.g., 513-542-784-9)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSearchPatient()}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSearchPatient}
              disabled={loading}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Search className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Searching...' : 'Search'}
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Citizenship: {selectedPatient.citizenship_number}</p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sex</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedPatient.sex}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Phone</p>
                  <p className="text-gray-900 dark:text-white">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedPatient.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Address</p>
                  <p className="text-gray-900 dark:text-white">{selectedPatient.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Father's Name</p>
                  <p className="text-gray-900 dark:text-white">{selectedPatient.father_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Mother's Name</p>
                  <p className="text-gray-900 dark:text-white">{selectedPatient.mother_name}</p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Medical History ({patientRecords.length} records)
              </h3>

              {patientRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No medical records found for this patient</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientRecords.map((record) => (
                    <div key={record.record_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecordColor(record.record_type)}`}>
                            {record.record_type}
                          </span>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {record.issued_date}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{record.title}</p>
                        </div>
                        {record.description && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{record.description}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</p>
                          <p className="text-gray-900 dark:text-white">{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prescription</p>
                          <p className="text-gray-900 dark:text-white">{record.prescription}</p>
                        </div>
                        {record.institute_id && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                            Institute ID: {record.institute_id}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!selectedPatient && !loading && !patientNotFound && (
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Record</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedPatient ? `For: ${selectedPatient.full_name}` : `For NID: ${newRecord.nid_number}`}
                </p>
              </div>
              <button
                onClick={() => setShowAddRecord(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Record Type *
                </label>
                <select
                  value={newRecord.record_type}
                  onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                >
                  <option value="Prescription">Prescription</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="IPD">IPD (In-Patient Department)</option>
                  <option value="OPD">OPD (Out-Patient Department)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  placeholder="e.g., Routine checkup, Follow-up consultation..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  placeholder="Additional details about the visit..."
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis..."
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
                  onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
                  placeholder="Enter prescription or treatment plan..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddRecord(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecord}
                  disabled={loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Saving...' : 'Save Record'}
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
