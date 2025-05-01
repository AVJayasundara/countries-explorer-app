import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries, getCountriesByRegion, getCountryByName } from '../services/api';

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

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
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Search API call effect
  useEffect(() => {
    const fetchCountriesBySearch = async () => {
      if (debouncedSearchTerm === '') {
        // If search term is cleared, fetch either all countries or by region
        if (selectedRegion) {
          fetchCountriesByRegion(selectedRegion);
        } else {
          fetchAllCountries();
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getCountryByName(debouncedSearchTerm);
        
        // If there's a region selected, filter the search results by that region
        if (selectedRegion) {
          const filteredByRegion = data.filter(country => 
            country.region === selectedRegion
          );
          setCountries(filteredByRegion);
        } else {
          setCountries(data);
        }
        
        setLoading(false);
      } catch (err) {
        // If no results were found, set an empty array
        if (err.response && err.response.status === 404) {
          setCountries([]);
        } else {
          setError(`Error searching for "${debouncedSearchTerm}"`);
        }
        setLoading(false);
      }
    };

    // Only fetch if there's a search term
    if (debouncedSearchTerm) {
      fetchCountriesBySearch();
    }
  }, [debouncedSearchTerm, selectedRegion]);

  // Fetch all countries function
  const fetchAllCountries = async () => {
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

  // Fetch countries by region function
  const fetchCountriesByRegion = async (region) => {
    try {
      setLoading(true);
      const data = await getCountriesByRegion(region);
      setCountries(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch countries from ${region}`);
      setLoading(false);
      console.error(err);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle region filter change
  const handleRegionChange = async (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    
    if (region) {
      // If there's a search term, we need to re-fetch with both criteria
      if (searchTerm) {
        try {
          setLoading(true);
          // First get countries by name
          const searchResults = await getCountryByName(searchTerm);
          // Then filter by selected region
          const filteredByRegion = searchResults.filter(country => 
            country.region === region
          );
          setCountries(filteredByRegion);
          setLoading(false);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setCountries([]);
          } else {
            setError(`Error searching for "${searchTerm}" in ${region}`);
          }
          setLoading(false);
        }
      } else {
        // If no search term, just fetch by region
        fetchCountriesByRegion(region);
      }
    } else {
      // If no region selected
      if (searchTerm) {
        // If there's a search term, fetch by name
        try {
          setLoading(true);
          const data = await getCountryByName(searchTerm);
          setCountries(data);
          setLoading(false);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setCountries([]);
          } else {
            setError(`Error searching for "${searchTerm}"`);
          }
          setLoading(false);
        }
      } else {
        // If no search term and no region, fetch all countries
        fetchAllCountries();
      }
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
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
          />
        </div>
        
        <div>
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
      </div>
      
      {/* Loading indicator during searches */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error message during searches */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      {/* Display number of results */}
      <p className="mb-4 text-gray-600">
        {loading ? 'Searching...' : `Showing ${countries.length} countries`}
      </p>
      
      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {countries.length > 0 ? (
          countries.map(country => (
            <div key={country.cca3}>
              <Link 
                to={`/country/${country.cca3}`} 
                className="block h-full"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
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
    </div>
  );
};

export default HomePage;