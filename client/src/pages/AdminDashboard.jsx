import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for admin dashboard
  const [analytics, setAnalytics] = useState({
    totalIssues: 156,
    pendingIssues: 23,
    inProgressIssues: 45,
    resolvedIssues: 78,
    rejectedIssues: 10,
    flaggedIssues: 8,
    issuesByCategory: {
      pothole: 45,
      garbage: 32,
      streetlight: 28,
      traffic: 25,
      parks: 18,
      other: 8
    },
    recentIssues: [
      { id: 1, title: 'Broken Street Light', status: 'pending', category: 'streetlight', createdAt: '2024-01-20T10:30:00Z' },
      { id: 2, title: 'Large Pothole', status: 'in-progress', category: 'pothole', createdAt: '2024-01-19T14:20:00Z' },
      { id: 3, title: 'Garbage Not Collected', status: 'resolved', category: 'garbage', createdAt: '2024-01-18T09:15:00Z' }
    ],
    flaggedIssuesList: [
      { id: 1, title: 'Inappropriate Issue', reason: 'inappropriate', flagCount: 3, createdAt: '2024-01-20T08:30:00Z' },
      { id: 2, title: 'Duplicate Report', reason: 'duplicate', flagCount: 2, createdAt: '2024-01-19T16:45:00Z' },
      { id: 3, title: 'Spam Content', reason: 'spam', flagCount: 5, createdAt: '2024-01-18T12:20:00Z' }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'pothole':
        return '🚧';
      case 'garbage':
        return '🗑️';
      case 'streetlight':
        return '💡';
      case 'traffic':
        return '🚦';
      case 'parks':
        return '🌳';
      default:
        return '📍';
    }
  };

  const handleModerateIssue = (issueId, action) => {
    // TODO: Implement moderation API call
    console.log(`Moderating issue ${issueId} with action: ${action}`);
    alert(`Issue ${issueId} ${action} successfully`);
  };

  const handleBanUser = (userId) => {
    // TODO: Implement ban user API call
    console.log(`Banning user ${userId}`);
    alert(`User ${userId} banned successfully`);
  };

  const handleRemoveIssue = (issueId) => {
    // TODO: Implement remove issue API call
    console.log(`Removing issue ${issueId}`);
    alert(`Issue ${issueId} removed successfully`);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600">
              You need admin privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Manage issues and moderate content.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['overview', 'moderation', 'flagged', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="text-3xl text-blue-600">📊</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Issues</p>
                        <p className="text-2xl font-bold text-blue-900">{analytics.totalIssues}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="text-3xl text-yellow-600">⏳</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{analytics.pendingIssues}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="text-3xl text-green-600">✅</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Resolved</p>
                        <p className="text-2xl font-bold text-green-900">{analytics.resolvedIssues}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="text-3xl text-red-600">🚩</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Flagged</p>
                        <p className="text-2xl font-bold text-red-900">{analytics.flaggedIssues}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Issues */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Issues</h3>
                  <div className="space-y-3">
                    {analytics.recentIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{issue.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Issue Moderation</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>All Categories</option>
                      <option>Potholes</option>
                      <option>Garbage</option>
                      <option>Street Lights</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {analytics.recentIssues.map((issue) => (
                    <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{issue.title}</h4>
                            <p className="text-sm text-gray-500">
                              Reported on {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleModerateIssue(issue.id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleModerateIssue(issue.id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleModerateIssue(issue.id, 'resolve')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flagged Issues Tab */}
            {activeTab === 'flagged' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Flagged Issues</h3>
                <div className="space-y-4">
                  {analytics.flaggedIssuesList.map((issue) => (
                    <div key={issue.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{issue.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Flagged {issue.flagCount} times • {issue.reason} • {new Date(issue.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRemoveIssue(issue.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => handleBanUser(issue.id)}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            Ban User
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                
                {/* Category Distribution */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Issues by Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analytics.issuesByCategory).map(([category, count]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <span className="font-medium text-gray-900 capitalize">{category}</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">{count}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / analytics.totalIssues) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Distribution */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Status Distribution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-yellow-800">Pending</span>
                        <span className="text-2xl font-bold text-yellow-800">{analytics.pendingIssues}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-800">In Progress</span>
                        <span className="text-2xl font-bold text-blue-800">{analytics.inProgressIssues}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-800">Resolved</span>
                        <span className="text-2xl font-bold text-green-800">{analytics.resolvedIssues}</span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-red-800">Rejected</span>
                        <span className="text-2xl font-bold text-red-800">{analytics.rejectedIssues}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 