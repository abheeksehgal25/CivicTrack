import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const IssueDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  // Mock data for the specific issue
  const mockIssue = {
    id: parseInt(id),
    title: 'Large Pothole on Main Street',
    description: 'There is a significant pothole on Main Street near the intersection with Oak Avenue. It has been getting worse over the past few weeks and poses a hazard to vehicles. The pothole is approximately 2 feet in diameter and 6 inches deep. Several cars have already been damaged by this hazard.',
    category: 'pothole',
    status: 'in-progress',
    location: 'Main Street & Oak Avenue',
    latitude: 40.7128,
    longitude: -74.0060,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=400&fit=crop',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    reporter: 'John Doe',
    isAnonymous: false,
    timeline: [
      {
        id: 1,
        status: 'pending',
        date: '2024-01-15T10:30:00Z',
        description: 'Issue reported by John Doe',
        adminComment: null
      },
      {
        id: 2,
        status: 'in-progress',
        date: '2024-01-16T14:20:00Z',
        description: 'Issue assigned to maintenance crew',
        adminComment: 'Crew scheduled for inspection on Jan 17th'
      }
    ]
  };

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

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'map', label: 'Map' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Issues
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mockIssue.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📍 {mockIssue.location}</span>
            <span>📅 {new Date(mockIssue.createdAt).toLocaleDateString()}</span>
            <span>📏 {mockIssue.distance}km away</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockIssue.status)}`}>
            {getStatusIcon(mockIssue.status)} {mockIssue.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Issue Image */}
                <div>
                  <img
                    src={mockIssue.image}
                    alt={mockIssue.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Issue Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(mockIssue.category)}</span>
                        <span className="text-gray-700 capitalize">{mockIssue.category}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Description</span>
                        <p className="text-gray-900 mt-1">{mockIssue.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location</span>
                        <p className="text-gray-900 mt-1">{mockIssue.location}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporter Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Reporter</span>
                        <p className="text-gray-900 mt-1">
                          {mockIssue.isAnonymous ? 'Anonymous' : mockIssue.reporter}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Reported On</span>
                        <p className="text-gray-900 mt-1">
                          {new Date(mockIssue.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Last Updated</span>
                        <p className="text-gray-900 mt-1">
                          {new Date(mockIssue.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
                <div className="space-y-4">
                  {mockIssue.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {event.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        {event.adminComment && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            "{event.adminComment}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Map</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">Map integration coming soon</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {mockIssue.latitude}, {mockIssue.longitude}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              Share Issue
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              Report Similar Issue
            </button>
          </div>
          
          <Link
            to="/report"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Report New Issue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage; 