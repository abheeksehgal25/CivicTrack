import React from 'react';
import Navigation from '../components/Navigation';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and moderate civic issues
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Admin Dashboard Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              This section will include:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li>• Issue moderation tools</li>
              <li>• Analytics and statistics</li>
              <li>• User management</li>
              <li>• Status updates and comments</li>
              <li>• Bulk operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 