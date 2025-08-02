import React from 'react';

const IssuesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Local Issues
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          View and track civic issues in your neighborhood
        </p>
        {/* TODO: Add issues list and map */}
      </div>
    </div>
  );
};

export default IssuesPage; 