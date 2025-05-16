import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries, getCountriesByRegion, getCountryByName } from '../services/api';

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Define regions for the filter dropdown
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // Fetch all countries on initial load
  useEffect(() => {
    const fetchInitialCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch countries');
        setLoading(false);
        console.error(err);
      }
    };

    fetchInitialCountries();
  }, []);

  // Handle search input change with debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    // Visual feedback that search is in progress
    if (searchTerm) {
      setIsSearching(true);
    }
    
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Reduced to 300ms for more responsive feel
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchCountriesByFilters = useCallback(async (searchValue, regionValue) => {
    setLoading(true);
    setError(null);
    
    try {
      let data = [];
      
      // Case 1: Both search and region filter
      if (searchValue && regionValue) {
        const searchResults = await getCountryByName(searchValue);
        data = searchResults.filter(country => country.region === regionValue);
      }
      // Case 2: Only search filter
      else if (searchValue) {
        data = await getCountryByName(searchValue);
      }
      // Case 3: Only region filter
      else if (regionValue) {
        data = await getCountriesByRegion(regionValue);
      }
      // Case 4: No filters
      else {
        data = await getAllCountries();
      }
      
      setCountries(data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCountries([]);
      } else {
        setError(`Error fetching countries${searchValue ? ` matching "${searchValue}"` : ''}${
          regionValue ? ` in ${regionValue}` : ''
        }`);
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  // Search and filter effect
  useEffect(() => {
    fetchCountriesByFilters(debouncedSearchTerm, selectedRegion);
  }, [debouncedSearchTerm, selectedRegion, fetchCountriesByFilters]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle region filter change
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">Loading countries...</p>
      </div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="container mx-auto px-4 mt-8">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{message}</span>
        </div>
      </div>
    </div>
  );

  if (loading && !countries.length) {
    return <LoadingIndicator />;
  }

  if (error && !countries.length) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            World Countries Explorer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover information about countries around the world
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="relative md:col-span-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Search for a country..."
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="Search countries"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-4">
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  aria-label="Filter by Region"
                >
                  <option value="">Filter by Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2 flex items-center">
                {(searchTerm || selectedRegion) && (
                  <button
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center group"
                    onClick={handleClearFilters}
                    aria-label="Clear filters"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Active filters display */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-600 font-medium">
              {loading ? 'Searching...' : `Showing ${countries.length} countries`}
            </span>
            
            {(searchTerm || selectedRegion) && (
              <div className="flex flex-wrap gap-2 ml-2">
                {searchTerm && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedRegion && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                    Region: {selectedRegion}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Loading indicator during searches */}
        {loading && countries.length > 0 && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        )}
        
        {/* Error message during searches */}
        {error && countries.length > 0 && (
          <div className="mb-8">
            <ErrorMessage message={error} />
          </div>
        )}
        
        {/* Countries Grid with Transition Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.length > 0 ? (
            countries.map((country, index) => (
              <div 
                key={country.cca3}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link 
                  to={`/country/${country.cca3}`} 
                  className="block h-full"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={country.flags.png || country.flags.svg}
                        className="w-full h-full object-cover"
                        alt={`Flag of ${country.name.common}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h5 className="font-bold text-xl mb-3 text-gray-900">{country.name.common}</h5>
                      <div className="space-y-2 text-gray-700">
                        <p className="flex items-center">
                          <span className="font-medium text-gray-900 mr-2">Population:</span> 
                          <span>{country.population.toLocaleString()}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium text-gray-900 mr-2">Region:</span> 
                          <span>{country.region}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium text-gray-900 mr-2">Capital:</span> 
                          <span>{country.capital ? country.capital[0] : 'N/A'}</span>
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                          View details
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-6 py-8 rounded-xl text-center shadow-md">
                <svg className="h-16 w-16 text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium mb-2">No countries found</p>
                <p className="text-indigo-500">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>World Countries Explorer &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
      
      {/* Add this to your CSS or create a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;