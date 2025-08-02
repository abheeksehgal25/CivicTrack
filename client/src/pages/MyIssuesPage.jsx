import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../api/issues';
import Navigation from '../components/Navigation';

const MyIssuesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's issues
  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await issuesAPI.getUserIssues();
        setIssues(data.issues || []);
      } catch (error) {
        console.error('Error fetching user issues:', error);
        setError(error.message);
        // Fallback to mock data if API fails
        setIssues(getMockIssues());
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserIssues();
    }
  }, [isAuthenticated]);

  // Mock data fallback
  const getMockIssues = () => [
    {
      id: 1,
      title: 'Large Pothole on Main Street',
      description: 'There is a significant pothole on Main Street near the intersection with Oak Avenue.',
      category: 'pothole',
      status: 'pending',
      location: 'Main Street & Oak Avenue',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Garbage Not Collected',
      description: 'The garbage collection was missed on our street this week. Bins are overflowing.',
      category: 'garbage',
      status: 'in-progress',
      location: 'Willow Street',
      createdAt: '2024-01-14T08:15:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Broken Street Light',
      description: 'The street light at the corner of Pine Street and Maple Avenue has been out for several days.',
      category: 'streetlight',
      status: 'resolved',
      location: 'Pine Street & Maple Avenue',
      createdAt: '2024-01-10T19:45:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Damaged Park Bench',
      description: 'One of the benches in Central Park has broken slats and is unsafe to sit on.',
      category: 'parks',
      status: 'rejected',
      location: 'Central Park',
      createdAt: '2024-01-12T11:00:00Z',
      updatedAt: '2024-01-17T16:30:00Z',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop'
    }
  ];

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔧';
      case 'resolved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📋';
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

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'all') return true;
    return issue.status === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All Issues', count: issues.length },
    { id: 'pending', label: 'Pending', count: issues.filter(i => i.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length },
    { id: 'resolved', label: 'Resolved', count: issues.filter(i => i.status === 'resolved').length },
    { id: 'rejected', label: 'Rejected', count: issues.filter(i => i.status === 'rejected').length }
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Reported Issues
          </h1>
          <p className="text-gray-600">
            Track the status of your reported civic issues
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-sm">
              ⚠️ {error} (Showing sample data)
            </p>
          </div>
        )}

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading your issues...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No issues found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all'
                    ? "You haven't reported any issues yet."
                    : `No ${activeTab} issues found.`
                  }
                </p>
                <Link
                  to="/report"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Report Your First Issue
                </Link>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue._id || issue.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    {/* Issue Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={issue.image || issue.photos?.[0] || 'https://via.placeholder.com/96x96?text=No+Image'}
                        alt={issue.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Issue Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                          <span className="text-sm text-gray-500 capitalize">{issue.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)} {issue.status}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {issue.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>📍 {issue.location?.address || issue.location}</span>
                          <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>

                        <Link
                          to={`/issue/${issue._id || issue.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Last updated: {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}</span>
                      {issue.status === 'resolved' && (
                        <span className="text-green-600">✓ Issue has been resolved</span>
                      )}
                      {issue.status === 'rejected' && (
                        <span className="text-red-600">✗ Issue was rejected</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Report New Issue Button */}
        <div className="text-center mt-8">
          <Link
            to="/report"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Report New Issue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyIssuesPage; 