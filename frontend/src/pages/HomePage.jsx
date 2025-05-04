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
    // Note: No need to manually call fetchCountriesByFilters here,
    // as it will be triggered by the useEffect that depends on selectedRegion
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="container mx-auto px-4 mt-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{message}</span>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">World Countries Explorer</h1>
      
      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative md:col-span-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search countries"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <select
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        
        {(searchTerm || selectedRegion) && (
          <div className="md:col-span-1 flex items-center">
            <button
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center"
              onClick={handleClearFilters}
              aria-label="Clear filters"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Loading indicator during searches */}
      {loading && countries.length > 0 && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error message during searches */}
      {error && countries.length > 0 && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      {/* Display number of results with active filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-gray-600">
          {loading ? 'Searching...' : `Showing ${countries.length} countries`}
        </span>
        
        {/* Active filters display */}
        {(searchTerm || selectedRegion) && (
          <div className="flex flex-wrap gap-2 ml-2">
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                Search: {searchTerm}
              </span>
            )}
            {selectedRegion && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                Region: {selectedRegion}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Countries Grid with Transition Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {countries.length > 0 ? (
          countries.map(country => (
            <div 
              key={country.cca3}
              className="animate-fade-in transition-all duration-300 ease-in-out"
            >
              <Link 
                to={`/country/${country.cca3}`} 
                className="block h-full"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full transform hover:-translate-y-1 hover:scale-[1.02]">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={country.flags.png || country.flags.svg}
                      className="w-full h-full object-cover"
                      alt={`Flag of ${country.name.common}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h5 className="font-bold text-lg mb-2 text-gray-900">{country.name.common}</h5>
                    <div className="text-sm text-gray-700">
                      <p className="mb-1"><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
                      <p className="mb-1"><span className="font-medium">Region:</span> {country.region}</p>
                      <p className="mb-1"><span className="font-medium">Capital:</span> {country.capital ? country.capital[0] : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="bg-blue-100 text-blue-700 px-4 py-3 rounded">No countries found matching your criteria</p>
          </div>
        )}
      </div>
      
      {/* Add this to your CSS or create a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;