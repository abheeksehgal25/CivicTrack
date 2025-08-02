import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IssueCard = ({ issue }) => {
  const { isAuthenticated } = useAuth();

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

  const handleFlagClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement flag functionality
    alert('Flag functionality coming soon!');
  };

  return (
    <Link to={`/issue/${issue._id || issue.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Issue Image */}
        <div className="relative">
          <img
            src={issue.image || issue.photos?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={issue.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {getStatusIcon(issue.status)} {issue.status}
            </span>
            {isAuthenticated && (
              <button
                onClick={handleFlagClick}
                className="px-2 py-1 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 transition-colors"
                title="Flag Issue"
              >
                🚩
              </button>
            )}
          </div>
        </div>

        {/* Issue Content */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
            <span className="text-sm text-gray-500 capitalize">{issue.category}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {issue.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {issue.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>📍 {issue.location?.address || issue.location}</span>
              {issue.distance && (
                <span>📏 {issue.distance}km away</span>
              )}
            </div>
            <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Reporter Info */}
          {!issue.anonymous && issue.createdBy && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Reported by {issue.createdBy.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IssueCard; 