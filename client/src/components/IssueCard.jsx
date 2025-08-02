import React from 'react';
import { Link } from 'react-router-dom';

const IssueCard = ({ issue }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={issue.image || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={issue.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
            <span className="text-sm text-gray-500 capitalize">{issue.category}</span>
          </div>
          <span className="text-sm text-gray-500">{issue.distance}km away</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {issue.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {issue.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
            {issue.reporter && (
              <span>by {issue.reporter}</span>
            )}
          </div>
          
          <Link
            to={`/issue/${issue.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard; 