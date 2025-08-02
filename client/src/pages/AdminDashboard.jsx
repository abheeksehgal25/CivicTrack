import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api/admin';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'issues') {
      loadIssues();
    } else if (activeTab === 'flags') {
      loadFlags();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({ page: 1, limit: 10 });
      setUsers(response.data.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getIssues({ page: 1, limit: 10 });
      setIssues(response.data.issues);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFlags = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFlags({ page: 1, limit: 10 });
      setFlags(response.data.flags);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
            <p className="mt-2 text-sm text-red-700">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'users', 'issues', 'flags'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && dashboardData && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.counts.totalUsers}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">Total Issues</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.counts.totalIssues}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-900">Total Flags</h3>
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.counts.totalFlags}</p>
                </div>
              </div>

              {/* Recent Issues */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Issues</h3>
                <div className="space-y-3">
                  {dashboardData.recentIssues.map((issue) => (
                    <div key={issue._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                      <div>
                        <p className="font-medium text-gray-900">{issue.title}</p>
                        <p className="text-sm text-gray-600">by {issue.createdBy?.name || 'Anonymous'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Users Management</h2>
              {loading ? (
                <LoadingSpinner text="Loading users..." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'issues' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Issues Management</h2>
              {loading ? (
                <LoadingSpinner text="Loading issues..." />
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {issue.status}
                            </span>
                            <span className="text-sm text-gray-500">{issue.category}</span>
                            <span className="text-sm text-gray-500">by {issue.createdBy?.name || 'Anonymous'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'flags' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Flagged Issues</h2>
              {loading ? (
                <LoadingSpinner text="Loading flags..." />
              ) : (
                <div className="space-y-4">
                  {flags.map((flag) => (
                    <div key={flag._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{flag.issueId?.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Flagged by {flag.userId?.name}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              flag.issueId?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              flag.issueId?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              flag.issueId?.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {flag.issueId?.status}
                            </span>
                            <span className="text-sm text-gray-500">{flag.issueId?.category}</span>
                          </div>
                          {flag.reason && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Reason:</strong> {flag.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 