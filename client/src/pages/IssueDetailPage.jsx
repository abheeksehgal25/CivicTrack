import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../api/issues';
import Navigation from '../components/Navigation';

const IssueDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [issue, setIssue] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagData, setFlagData] = useState({
    reason: '',
    description: ''
  });
  const [flagging, setFlagging] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await issuesAPI.getIssue(id);
        setIssue(data.issue);
        setTimeline(data.timeline || []);
      } catch (error) {
        console.error('Error fetching issue:', error);
        setError(error.message);
        // Fallback to mock data
        setIssue(getMockIssue());
        setTimeline(getMockTimeline());
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  // Mock data fallback
  const getMockIssue = () => ({
    _id: id,
    title: 'Large Pothole on Main Street',
    description: 'There is a significant pothole on Main Street near the intersection with Oak Avenue. It has been getting worse over the past few weeks and poses a hazard to vehicles. The pothole is approximately 2 feet in diameter and 6 inches deep. It is located in the right lane heading northbound.',
    category: 'pothole',
    status: 'in-progress',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Main Street & Oak Avenue, Downtown'
    },
    photos: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=400&fit=crop'],
    anonymous: false,
    createdBy: {
      _id: 'user123',
      name: 'John Doe'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    distance: 0.8
  });

  const getMockTimeline = () => [
    {
      _id: '1',
      status: 'pending',
      comment: 'Issue reported by citizen',
      updatedBy: { name: 'John Doe' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      status: 'in-progress',
      comment: 'Issue assigned to road maintenance team',
      updatedBy: { name: 'Admin User' },
      createdAt: '2024-01-16T14:20:00Z'
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

  const handleFlagIssue = async (e) => {
    e.preventDefault();
    if (!flagData.reason) return;

    try {
      setFlagging(true);
      await issuesAPI.flagIssue(id, flagData);
      setShowFlagModal(false);
      setFlagData({ reason: '', description: '' });
      alert('Issue flagged successfully');
    } catch (error) {
      console.error('Error flagging issue:', error);
      alert('Failed to flag issue: ' + error.message);
    } finally {
      setFlagging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading issue details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading issue
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Issues
          </Link>
        </div>

        {/* Issue Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)} {issue.status}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{issue.category}</span>
                  {issue.distance && (
                    <span className="text-sm text-gray-500">📍 {issue.distance}km away</span>
                  )}
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setShowFlagModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
              >
                🚩 Flag Issue
              </button>
            )}
          </div>

          {/* Issue Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="mb-6">
              <img
                src={issue.photos[0]}
                alt={issue.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['details', 'timeline', 'map'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
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

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-700">📍 {issue.location.address}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {issue.location.lat.toFixed(6)}, {issue.location.lng.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Reporter</h3>
                    {issue.anonymous ? (
                      <p className="text-gray-700">Anonymous Report</p>
                    ) : (
                      <p className="text-gray-700">{issue.createdBy?.name || 'Unknown'}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Reported on {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
                {timeline.length === 0 ? (
                  <p className="text-gray-500">No status updates yet.</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((entry, index) => (
                      <div key={entry._id || index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStatusColor(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {entry.comment && (
                            <p className="text-gray-700 mt-1">{entry.comment}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Updated by {entry.updatedBy?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Map</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">Map integration coming soon</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Location: {issue.location.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flag Issue</h3>
            <form onSubmit={handleFlagIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <select
                  value={flagData.reason}
                  onChange={(e) => setFlagData({ ...flagData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="spam">Spam</option>
                  <option value="duplicate">Duplicate issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={flagData.description}
                  onChange={(e) => setFlagData({ ...flagData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide additional details..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFlagModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={flagging || !flagData.reason}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {flagging ? 'Flagging...' : 'Flag Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetailPage; 