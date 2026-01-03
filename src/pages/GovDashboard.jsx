import React, { useState, useEffect } from 'react';
import {
  Shield, LogOut, Menu, X, BarChart3, Users, Hospital,
  FileText, Moon, Sun, Database, TrendingUp, MapPin, Activity,
  Calendar, User, Droplet, Phone, Mail, MapPinned, Search,
  Filter, AlertTriangle, CheckCircle, Clock, Package
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';



function GovDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [citizens, setCitizens] = useState([]);
  const [healthInstitutes, setHealthInstitutes] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterOwnership, setFilterOwnership] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [citizensRes, institutesRes, recordsRes] = await Promise.all([
          fetch('/data/citizens.json'),
          fetch('/data/health_institutes.json'),
          fetch('/data/health_records.json')
        ]);

        const citizensData = await citizensRes.json();
        const institutesData = await institutesRes.json();
        const recordsData = await recordsRes.json();

        setCitizens(citizensData);
        setHealthInstitutes(institutesData);
        setHealthRecords(recordsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#84cc16'];

  const DashboardView = () => {
    // KPI Stats
    const totalCitizens = citizens.length;
    const totalInstitutes = healthInstitutes.length;
    const totalRecords = healthRecords.length;
    const activeInstitutes = healthInstitutes.filter(h => h.is_active).length;

    // Calculate citizens per institute by district
    const districtStats = {};
    healthInstitutes.forEach(institute => {
      const district = institute.address.split(' ').slice(-2, -1)[0];
      if (!districtStats[district]) {
        districtStats[district] = { institutes: 0, district };
      }
      districtStats[district].institutes += 1;
    });

    citizens.forEach(citizen => {
      const district = citizen.address.split(' ').slice(-2, -1)[0];
      if (districtStats[district]) {
        districtStats[district].citizens = (districtStats[district].citizens || 0) + 1;
      }
    });

    const resourceAllocation = Object.values(districtStats)
      .map(d => ({
        district: d.district,
        ratio: d.citizens && d.institutes ? Math.round(d.citizens / d.institutes) : 0
      }))
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 10);

    // Records over time data
    const recordsByMonth = healthRecords.reduce((acc, record) => {
      const month = new Date(record.issued_date).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const recordsTimeData = Object.entries(recordsByMonth)
      .sort((a, b) => new Date('20' + a[0].split(' ')[1] + '-' + a[0].split(' ')[0]) - new Date('20' + b[0].split(' ')[1] + '-' + b[0].split(' ')[0]))
      .slice(-12)
      .map(([month, records]) => ({ month, records }));

    // IPD vs OPD trend
    const recordTypeByMonth = healthRecords.reduce((acc, record) => {
      const month = new Date(record.issued_date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) acc[month] = { month, IPD: 0, OPD: 0 };
      acc[month][record.record_type] = (acc[month][record.record_type] || 0) + 1;
      return acc;
    }, {});

    const typeTimeData = Object.values(recordTypeByMonth)
      .sort((a, b) => new Date('20' + a.month.split(' ')[1] + '-' + a.month.split(' ')[0]) - new Date('20' + b.month.split(' ')[1] + '-' + b.month.split(' ')[0]))
      .slice(-12);

    // Top 5 diagnoses for quick overview
    const diagnosisData = healthRecords.reduce((acc, record) => {
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {});
    const topDiagnosesPreview = Object.entries(diagnosisData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Health coverage - citizens with records in last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentRecordNIDs = new Set(
      healthRecords
        .filter(r => new Date(r.issued_date) >= sixMonthsAgo)
        .map(r => r.nid_number)
    );
    const coverageRate = ((recentRecordNIDs.size / totalCitizens) * 100).toFixed(1);

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Citizens</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalCitizens.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Health Institutes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalInstitutes.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{activeInstitutes} active</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Hospital className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Health Records</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalRecords.toLocaleString()}</p>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Health Coverage (6mo)</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{coverageRate}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{recentRecordNIDs.size.toLocaleString()} citizens</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IPD vs OPD Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Type Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={typeTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="OPD" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="IPD" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Allocation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resource Allocation (Citizens per Institute)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceAllocation}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="district" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="ratio" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Higher ratio indicates need for more healthcare facilities</p>
          </div>
        </div>

        {/* Records Over Time and Top Diagnoses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Records Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recordsTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="records" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 5 Diagnoses</h3>
            <div className="space-y-3">
              {topDiagnosesPreview.map((diagnosis, idx) => (
                <div key={diagnosis.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                      {idx + 1}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{diagnosis.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{diagnosis.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CitizensView = () => {
    // Gender distribution
    const genderData = citizens.reduce((acc, citizen) => {
      acc[citizen.sex] = (acc[citizen.sex] || 0) + 1;
      return acc;
    }, {});
    const genderChartData = Object.entries(genderData).map(([name, value]) => ({ name, value }));

    // Blood group distribution
    const bloodGroupData = citizens.reduce((acc, citizen) => {
      acc[citizen.blood_group] = (acc[citizen.blood_group] || 0) + 1;
      return acc;
    }, {});
    const bloodGroupChartData = Object.entries(bloodGroupData)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // Age distribution (calculate from date_of_birth)
    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61+': 0
    };

    citizens.forEach(citizen => {
      const age = calculateAge(citizen.date_of_birth);
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 30) ageGroups['19-30']++;
      else if (age <= 45) ageGroups['31-45']++;
      else if (age <= 60) ageGroups['46-60']++;
      else ageGroups['61+']++;
    });

    const ageChartData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

    // District distribution
    const districtData = citizens.reduce((acc, citizen) => {
      const district = citizen.address.split(' ').slice(-2, -1)[0];
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {});
    const topDistricts = Object.entries(districtData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Health engagement stats
    const citizensWithRecords = new Set(healthRecords.map(r => r.nid_number));
    const engagementRate = ((citizensWithRecords.size / citizens.length) * 100).toFixed(1);

    // Blood donor availability
    const bloodDonorStats = Object.entries(bloodGroupData).map(([group, count]) => ({
      bloodGroup: group,
      donors: count,
      percentage: ((count / citizens.length) * 100).toFixed(1)
    })).sort((a, b) => b.donors - a.donors);

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Registered</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{citizens.length.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Health Engagement</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{engagementRate}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{citizensWithRecords.size.toLocaleString()} citizens</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Districts Covered</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{Object.keys(districtData).length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blood Group Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bloodGroupChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodGroupChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic and Blood Donor Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Districts by Population</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topDistricts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis dataKey="name" type="category" width={100} stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-red-500" />
              <span>Blood Donor Network</span>
            </h3>
            <div className="space-y-3">
              {bloodDonorStats.map((stat, idx) => (
                <div key={stat.bloodGroup} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">{stat.bloodGroup}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.donors.toLocaleString()} Donors</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{stat.percentage}% of population</p>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HospitalNetworkView = () => {
    // Hospitals by type
    const typeData = healthInstitutes.reduce((acc, institute) => {
      acc[institute.type] = (acc[institute.type] || 0) + 1;
      return acc;
    }, {});
    const typeChartData = Object.entries(typeData).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Hospitals by ownership
    const ownershipData = healthInstitutes.reduce((acc, institute) => {
      acc[institute.ownership] = (acc[institute.ownership] || 0) + 1;
      return acc;
    }, {});
    const ownershipChartData = Object.entries(ownershipData).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Hospitals by district (extract from address)
    const districtData = healthInstitutes.reduce((acc, institute) => {
      const district = institute.address.split(' ').slice(-2, -1)[0];
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {});
    const districtChartData = Object.entries(districtData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Active vs Inactive
    const activeCount = healthInstitutes.filter(h => h.is_active).length;
    const inactiveCount = healthInstitutes.length - activeCount;
    const statusData = [
      { name: 'Active', value: activeCount },
      { name: 'Inactive', value: inactiveCount }
    ];

    // Records per institute (capacity indicator)
    const recordsPerInstitute = healthRecords.reduce((acc, record) => {
      acc[record.institute_id] = (acc[record.institute_id] || 0) + 1;
      return acc;
    }, {});

    const instituteCapacity = healthInstitutes.map(institute => ({
      name: institute.name.substring(0, 20) + (institute.name.length > 20 ? '...' : ''),
      fullName: institute.name,
      records: recordsPerInstitute[institute.institute_id] || 0,
      type: institute.type
    })).sort((a, b) => b.records - a.records).slice(0, 10);

    // Filter and search logic
    const filteredInstitutes = healthInstitutes.filter(institute => {
      const matchesSearch = searchQuery === '' ||
        institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institute.license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institute.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'all' || institute.type === filterType;
      const matchesOwnership = filterOwnership === 'all' || institute.ownership === filterOwnership;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && institute.is_active) ||
        (filterStatus === 'inactive' && !institute.is_active);

      return matchesSearch && matchesType && matchesOwnership && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {typeChartData.map((type, idx) => (
            <div key={type.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{type.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{type.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                  idx === 1 ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-pink-100 dark:bg-pink-900/30'
                  }`}>
                  <Hospital className={`w-8 h-8 ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' :
                    idx === 1 ? 'text-purple-600 dark:text-purple-400' :
                      'text-pink-600 dark:text-pink-400'
                    }`} />
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {((activeCount / healthInstitutes.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ownership Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ownershipChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ownershipChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active vs Inactive</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Institutes and District Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Institutes by Patient Volume</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={instituteCapacity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="records" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Districts by Institute Count</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={districtChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis dataKey="name" type="category" width={100} stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Health Institutes</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredInstitutes.length} of {healthInstitutes.length} institutes
            </span>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, license number, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                {Object.keys(typeData).map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ownership</label>
              <select
                value={filterOwnership}
                onChange={(e) => setFilterOwnership(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Ownership</option>
                {Object.keys(ownershipData).map(ownership => (
                  <option key={ownership} value={ownership}>{ownership.charAt(0).toUpperCase() + ownership.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredInstitutes.length > 0 ? (
              filteredInstitutes.map((institute) => (
                <div key={institute.institute_id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{institute.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${institute.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                      {institute.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3 h-3" />
                      <span>{institute.license_number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hospital className="w-3 h-3" />
                      <span className="capitalize">{institute.type} • {institute.ownership}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{institute.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3" />
                      <span>{institute.phone}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {recordsPerInstitute[institute.institute_id] || 0} records
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No institutes found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };








  const HealthInsightsView = () => {
    // Top 10 diagnoses
    const diagnosisData = healthRecords.reduce((acc, record) => {
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {});
    const topDiagnoses = Object.entries(diagnosisData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Record types distribution
    const recordTypeData = healthRecords.reduce((acc, record) => {
      acc[record.record_type] = (acc[record.record_type] || 0) + 1;
      return acc;
    }, {});
    const recordTypeChartData = Object.entries(recordTypeData).map(([name, value]) => ({ name, value }));

    // District-wise health burden analysis
    const districtHealthData = {};
    healthRecords.forEach(record => {
      const citizen = citizens.find(c => c.nid_number === record.nid_number);
      if (citizen) {
        const district = citizen.address.split(' ').slice(-2, -1)[0];
        if (!districtHealthData[district]) {
          districtHealthData[district] = { district, cases: 0, citizens: 0 };
        }
        districtHealthData[district].cases++;
      }
    });

    // Count citizens per district
    citizens.forEach(citizen => {
      const district = citizen.address.split(' ').slice(-2, -1)[0];
      if (districtHealthData[district]) {
        districtHealthData[district].citizens++;
      }
    });

    const districtHealthBurden = Object.values(districtHealthData)
      .map(d => ({
        district: d.district,
        cases: d.cases,
        rate: ((d.cases / d.citizens) * 100).toFixed(1),
        citizens: d.citizens
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10);

    // Seasonal trends - diagnoses by month
    const monthlyDiagnoses = {};
    healthRecords.forEach(record => {
      const month = new Date(record.issued_date).toLocaleString('default', { month: 'short' });
      if (!monthlyDiagnoses[month]) {
        monthlyDiagnoses[month] = {};
      }
      monthlyDiagnoses[month][record.diagnosis] = (monthlyDiagnoses[month][record.diagnosis] || 0) + 1;
    });

    // Get top 5 diagnoses for trend tracking
    const top5Diagnoses = Object.entries(diagnosisData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonalTrendData = monthOrder.map(month => {
      const dataPoint = { month };
      top5Diagnoses.forEach(diagnosis => {
        dataPoint[diagnosis] = (monthlyDiagnoses[month] && monthlyDiagnoses[month][diagnosis]) || 0;
      });
      return dataPoint;
    }).filter(d => Object.keys(d).length > 1); // Remove months with no data

    // Outbreak detection - recent spikes
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentRecords = healthRecords.filter(r => new Date(r.issued_date) >= last30Days);
    const recentDiagnosisData = recentRecords.reduce((acc, record) => {
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {});

    // Calculate percentage of total for each diagnosis in recent period
    const outbreakAlerts = Object.entries(recentDiagnosisData)
      .map(([diagnosis, count]) => ({
        diagnosis,
        count,
        percentage: ((count / recentRecords.length) * 100).toFixed(1),
        totalCases: diagnosisData[diagnosis]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Treatment patterns - IPD vs OPD by diagnosis
    const treatmentPatterns = {};
    healthRecords.forEach(record => {
      if (!treatmentPatterns[record.diagnosis]) {
        treatmentPatterns[record.diagnosis] = { IPD: 0, OPD: 0, diagnosis: record.diagnosis };
      }
      treatmentPatterns[record.diagnosis][record.record_type]++;
    });

    const treatmentPatternsData = Object.values(treatmentPatterns)
      .map(d => ({
        ...d,
        total: d.IPD + d.OPD,
        ipdRate: ((d.IPD / (d.IPD + d.OPD)) * 100).toFixed(0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // Institute performance - records by institute type
    const instituteTypePerformance = {};
    healthRecords.forEach(record => {
      const institute = healthInstitutes.find(h => h.institute_id === record.institute_id);
      if (institute) {
        const type = institute.type;
        if (!instituteTypePerformance[type]) {
          instituteTypePerformance[type] = { type, records: 0, institutes: 0 };
        }
        instituteTypePerformance[type].records++;
      }
    });

    // Count institutes per type
    healthInstitutes.forEach(institute => {
      if (instituteTypePerformance[institute.type]) {
        instituteTypePerformance[institute.type].institutes++;
      }
    });

    const institutePerformanceData = Object.values(instituteTypePerformance)
      .map(d => ({
        ...d,
        avgRecords: (d.records / d.institutes).toFixed(1),
        type: d.type.charAt(0).toUpperCase() + d.type.slice(1)
      }))
      .sort((a, b) => b.avgRecords - a.avgRecords);

    return (
      <div className="space-y-6">
        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Diagnoses Types</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{Object.keys(diagnosisData).length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">IPD Cases</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {recordTypeData.IPD?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {((recordTypeData.IPD / healthRecords.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">OPD Cases</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {recordTypeData.OPD?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {((recordTypeData.OPD / healthRecords.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Outbreak Alerts */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Health Trends (Last 30 Days)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {outbreakAlerts.map((alert, idx) => (
              <div key={alert.diagnosis} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${idx === 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    idx === 1 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    #{idx + 1}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{alert.count}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{alert.diagnosis}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.percentage}% of recent cases</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Diagnoses</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topDiagnoses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">District Health Burden (Cases per 100 Citizens)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={districtHealthBurden} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis
                  dataKey="district"
                  type="category"
                  width={100}
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{payload[0].payload.district}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Health Cases: {payload[0].payload.cases}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Citizens: {payload[0].payload.citizens}</p>
                          <p className="text-xs font-medium text-red-600 dark:text-red-400">Rate: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" fill="#10b981" name="Health Burden Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Districts with higher rates may need additional healthcare resources</p>
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seasonal Health Trends (Top 5 Diagnoses)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={seasonalTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Legend />
              {top5Diagnoses.map((diagnosis, idx) => (
                <Line
                  key={diagnosis}
                  type="monotone"
                  dataKey={diagnosis}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[idx % COLORS.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Treatment Patterns (IPD vs OPD)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={treatmentPatternsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis
                  dataKey="diagnosis"
                  type="category"
                  width={100}
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="OPD" stackId="a" fill="#10b981" />
                <Bar dataKey="IPD" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Institute Performance by Type</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={institutePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="type" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{payload[0].payload.type}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Records: {payload[0].value}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total Records: {payload[0].payload.records}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Institutes: {payload[0].payload.institutes}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="avgRecords" fill="#6366f1" name="Avg Records per Institute" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Record Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Record Types Distribution</h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recordTypeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {recordTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };






























  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    );
  }
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Government Portal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Ministry of Health & Population</p>
              </div>
            </div><div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
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
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('citizens')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeTab === 'citizens'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Citizens</span>
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeTab === 'hospitals'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Hospital className="w-5 h-5" />
              <span>Hospitals</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeTab === 'insights'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Health Insights</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'citizens' && <CitizensView />}
        {activeTab === 'hospitals' && <HospitalNetworkView />}
        {activeTab === 'insights' && <HealthInsightsView />}
      </div>
    </div>);
}
export default GovDashboard;
