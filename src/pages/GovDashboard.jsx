import React, { useState } from 'react';
import { 
  Shield, LogOut, Menu, X, BarChart3, Users, Hospital, 
  FileText, TrendingUp, MapPin, Activity, Search, Calendar,
  AlertCircle, CheckCircle, Download, Filter, ChevronDown,
  Eye, Clock, ArrowUp, ArrowDown, Moon, Sun
} from 'lucide-react';

// Mock data for analytics
const dashboardStats = {
  totalCitizens: 125840,
  totalRecords: 456789,
  activeHospitals: 234,
  monthlyVisits: 45231,
  citizenGrowth: 2.3,
  recordGrowth: 8.7,
  hospitalGrowth: 1.2,
  visitGrowth: 5.4
};

const diseaseData = [
  { name: 'Hypertension', cases: 8234, trend: 'up', change: 12 },
  { name: 'Diabetes', cases: 6789, trend: 'up', change: 8 },
  { name: 'Respiratory Infections', cases: 5432, trend: 'down', change: -5 },
  { name: 'COVID-19', cases: 1234, trend: 'down', change: -23 },
  { name: 'Dengue', cases: 890, trend: 'up', change: 45 }
];

const vaccinationData = [
  { vaccine: 'COVID-19', coverage: 87, target: 90 },
  { vaccine: 'Polio', coverage: 95, target: 95 },
  { vaccine: 'Measles', coverage: 89, target: 92 },
  { vaccine: 'Hepatitis B', coverage: 82, target: 85 }
];

const mockCitizens = [
  {
    nid: '1234567890',
    name: 'Ram Bahadur Thapa',
    age: 39,
    district: 'Kathmandu',
    lastVisit: '2024-12-15',
    totalVisits: 12,
    conditions: ['Hypertension'],
    entitlements: ['Senior Citizen Subsidy']
  },
  {
    nid: '9876543210',
    name: 'Sita Kumari Shrestha',
    age: 45,
    district: 'Lalitpur',
    lastVisit: '2024-12-20',
    totalVisits: 8,
    conditions: ['Diabetes'],
    entitlements: ['Free Medication Program']
  },
  {
    nid: '5555666677',
    name: 'Krishna Prasad Pokhrel',
    age: 62,
    district: 'Bhaktapur',
    lastVisit: '2024-12-10',
    totalVisits: 25,
    conditions: ['Diabetes', 'Hypertension'],
    entitlements: ['Senior Citizen Subsidy', 'Free Medication Program']
  }
];

const mockHospitals = [
  {
    id: 1,
    name: 'Grande International Hospital',
    district: 'Kathmandu',
    type: 'Private',
    status: 'Active',
    recordsThisMonth: 2345,
    lastActivity: '2024-12-28',
    compliance: 98
  },
  {
    id: 2,
    name: 'Bir Hospital',
    district: 'Kathmandu',
    type: 'Public',
    status: 'Active',
    recordsThisMonth: 5678,
    lastActivity: '2024-12-28',
    compliance: 95
  },
  {
    id: 3,
    name: 'Manipal Teaching Hospital',
    district: 'Kaski',
    type: 'Private',
    status: 'Active',
    recordsThisMonth: 1890,
    lastActivity: '2024-12-27',
    compliance: 92
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'record_added',
    hospital: 'Grande International Hospital',
    details: 'Added 45 new health records',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'hospital_registered',
    hospital: 'New Life Hospital',
    details: 'New hospital registered in Pokhara',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'alert',
    hospital: 'Multiple Districts',
    details: 'Dengue cases increased by 45% this week',
    timestamp: '1 day ago'
  }
];

function GovDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const filteredCitizens = mockCitizens.filter(citizen => {
    const matchesSearch = citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.nid.includes(searchTerm);
    const matchesDistrict = districtFilter === 'all' || citizen.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</h3>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Citizens" 
          value={dashboardStats.totalCitizens} 
          change={dashboardStats.citizenGrowth}
          trend="up"
          icon={Users} 
        />
        <StatCard 
          title="Health Records" 
          value={dashboardStats.totalRecords} 
          change={dashboardStats.recordGrowth}
          trend="up"
          icon={FileText} 
        />
        <StatCard 
          title="Active Hospitals" 
          value={dashboardStats.activeHospitals} 
          change={dashboardStats.hospitalGrowth}
          trend="up"
          icon={Hospital} 
        />
        <StatCard 
          title="Monthly Visits" 
          value={dashboardStats.monthlyVisits} 
          change={dashboardStats.visitGrowth}
          trend="up"
          icon={Activity} 
        />
      </div>

      {/* Disease Trends & Vaccination Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Health Conditions</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {diseaseData.map((disease, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{disease.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{disease.cases.toLocaleString()} cases</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(disease.cases / 10000) * 100}%` }}
                    />
                  </div>
                </div>
                <div className={`ml-4 flex items-center text-sm ${disease.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                  {disease.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span className="ml-1">{Math.abs(disease.change)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination Coverage */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccination Coverage</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {vaccinationData.map((vaccine, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{vaccine.vaccine}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{vaccine.coverage}% / {vaccine.target}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${vaccine.coverage >= vaccine.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(vaccine.coverage / vaccine.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <div className={`p-2 rounded-lg ${
                activity.type === 'alert' ? 'bg-red-100 text-red-600' :
                activity.type === 'hospital_registered' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {activity.type === 'alert' ? <AlertCircle className="w-5 h-5" /> :
                 activity.type === 'hospital_registered' ? <CheckCircle className="w-5 h-5" /> :
                 <FileText className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.hospital}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  

  const HospitalNetworkView = () => (
    <div className="space-y-6">
      {/* Hospital Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Hospitals</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">234</h3>
            </div>
            <Hospital className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Compliance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">95%</h3>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Records Today</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1,234</h3>
            </div>
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hospital Network</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Records/Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockHospitals.map(hospital => (
                <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Hospital className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{hospital.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{hospital.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      hospital.type === 'Public' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {hospital.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{hospital.recordsThisMonth.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{hospital.lastActivity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            hospital.compliance >= 95 ? 'bg-green-500' : 
                            hospital.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${hospital.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{hospital.compliance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">
                      {hospital.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
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
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Government Portal</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Ministry of Health & Population</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name || 'Admin User'}</span>
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
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              {/* <button
                onClick={() => setActiveTab('citizens')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === 'citizens'
                    ? 'bg-indigo-600 text-white': 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Citizens</span>
          </button> */}
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'hospitals'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Hospital className="w-5 h-5" />
            <span>Hospitals</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'hospitals' && <HospitalNetworkView />}
    </div>

    {/* Citizen Detail Modal */}
    {selectedCitizen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCitizen(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCitizen.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">NID: {selectedCitizen.nid}</p>
            </div>
            <button
              onClick={() => setSelectedCitizen(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age</h4>
                <p className="text-gray-900 dark:text-white">{selectedCitizen.age} years</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">District</h4>
                <p className="text-gray-900 dark:text-white">{selectedCitizen.district}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Visit</h4>
                <p className="text-gray-900 dark:text-white">{selectedCitizen.lastVisit}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Visits</h4>
                <p className="text-gray-900 dark:text-white">{selectedCitizen.totalVisits}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Health Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCitizen.conditions.map((condition, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Entitlements</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCitizen.entitlements.map((entitlement, idx) => (
                  <span key={idx} className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                    {entitlement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>);
}

export default GovDashboard;