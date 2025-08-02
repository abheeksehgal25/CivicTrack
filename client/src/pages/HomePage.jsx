import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../api/issues';
import Navigation from '../components/Navigation';
import FilterBar from '../components/FilterBar';
import IssueCard from '../components/IssueCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({});

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Continue without location
        }
      );
    }
  }, []);

  // Fetch issues when filters or location changes
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filtersWithLocation = {
          ...filters,
          ...(userLocation && {
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 5 // 5km radius
          })
        };

        const data = await issuesAPI.getIssues(filtersWithLocation);
        setIssues(data.issues || []);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setError(error.message);
        // Fallback to mock data if API fails
        setIssues(getMockIssues());
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filters, userLocation]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReportIssue = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/report');
    }
  };

  // Mock data fallback
  const getMockIssues = () => [
    {
      id: 1,
      title: 'Large Pothole on Main Street',
      description: 'There is a significant pothole on Main Street near the intersection with Oak Avenue. It has been getting worse over the past few weeks and poses a hazard to vehicles.',
      category: 'pothole',
      status: 'pending',
      distance: 0.8,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=200&fit=crop',
      createdAt: '2024-01-15T10:30:00Z',
      reporter: 'John Doe'
    },
    {
      id: 2,
      title: 'Garbage Not Collected',
      description: 'The garbage collection was missed on our street this week. Bins are overflowing and creating a mess in the neighborhood.',
      category: 'garbage',
      status: 'in-progress',
      distance: 1.2,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      createdAt: '2024-01-14T08:15:00Z',
      reporter: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Broken Street Light',
      description: 'The street light at the corner of Pine Street and Maple Avenue has been out for several days. It makes the intersection very dark at night.',
      category: 'streetlight',
      status: 'resolved',
      distance: 2.1,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
      createdAt: '2024-01-10T19:45:00Z',
      reporter: 'Mike Johnson'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CivicTrack
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Report and track local civic issues in your neighborhood
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleReportIssue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Report an Issue
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium">
              View All Issues
            </button>
          </div>
        </div>

        {/* Location Status */}
        {userLocation ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800 text-sm">
              📍 Showing issues within 5km of your location
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              📍 Location access denied. Showing all issues.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-sm">
              ⚠️ {error} (Showing sample data)
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Issues Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading issues...</p>
          </div>
        ) : (
          <>
            {issues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No issues found
                </h3>
                <p className="text-gray-600 mb-6">
                  No issues match your current filters.
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                  <IssueCard key={issue._id || issue.id} issue={issue} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {issues.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 font-medium">
              Load More Issues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 