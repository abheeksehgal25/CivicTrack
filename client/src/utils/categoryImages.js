// Import predefined images
import potholeImage from '../assets/pothole.jpeg';
import garbageImage from '../assets/garbage.jpeg';
import streetlightImage from '../assets/streetlight.jpeg';
import trafficImage from '../assets/traffic.jpeg';
import parkImage from '../assets/park.jpeg';

// Map categories to their predefined images
export const categoryImages = {
  pothole: potholeImage,
  garbage: garbageImage,
  streetlight: streetlightImage,
  traffic: trafficImage,
  parks: parkImage,
  other: null // No predefined image for "other" category
};

// Get image for a specific category
export const getCategoryImage = (category) => {
  return categoryImages[category] || null;
};

// Get all available categories with their images
export const getCategoriesWithImages = () => {
  return [
    { value: '', label: 'Select a category', image: null },
    { value: 'pothole', label: 'Potholes', image: potholeImage },
    { value: 'garbage', label: 'Garbage', image: garbageImage },
    { value: 'streetlight', label: 'Street Lights', image: streetlightImage },
    { value: 'traffic', label: 'Traffic', image: trafficImage },
    { value: 'parks', label: 'Parks & Recreation', image: parkImage },
    { value: 'other', label: 'Other', image: null }
  ];
}; 