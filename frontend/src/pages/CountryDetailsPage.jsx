import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import { useAuth } from './AuthContext';

const CountryDetailsPage = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the auth context to access favorites functionality
  const { currentUser, addFavorite, removeFavorite, isFavorite } = useAuth();
  
  // Track if this country is in favorites
  const [inFavorites, setInFavorites] = useState(false);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(countryCode);
        setCountry(data[0]);
        
        // Check if country is in favorites
        if (currentUser) {
          setInFavorites(isFavorite(countryCode));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load country details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCountryData();
  }, [countryCode, currentUser, isFavorite]);

  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (!currentUser) {
      // Redirect to login if user is not authenticated
      navigate('/login', { state: { from: { pathname: `/country/${countryCode}` } } });
      return;
    }
    
    if (inFavorites) {
      removeFavorite(countryCode);
    } else {
      addFavorite(country);
    }
    
    setInFavorites(!inFavorites);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">Country not found</span>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Extract needed data from country object
  const {
    name,
    capital,
    population,
    region,
    subregion,
    flags,
    languages,
    currencies,
    borders,
    area
  } = country;

  // Format population with commas
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
          onClick={() => navigate('/')}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </button>
        
        {/* Favorites Button */}
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
            inFavorites 
              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500'
          }`}
        >
          <svg
            className={`w-5 h-5 mr-2 ${inFavorites ? 'fill-current' : 'stroke-current fill-none'}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
          </svg>
          {inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img 
            src={flags.svg || flags.png} 
            alt={`Flag of ${name.common}`}
            className="w-full h-auto shadow rounded"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-6">{name.common}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2"><span className="font-semibold">Official Name:</span> {name.official}</p>
              <p className="mb-2"><span className="font-semibold">Capital:</span> {capital ? capital.join(', ') : 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Region:</span> {region}</p>
              <p className="mb-2"><span className="font-semibold">Sub Region:</span> {subregion || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Population:</span> {formatNumber(population)}</p>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold">Area:</span> {formatNumber(area)} km²</p>
              <p className="mb-2">
                <span className="font-semibold">Languages:</span>{' '}
                {languages ? Object.values(languages).join(', ') : 'N/A'}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Currencies:</span>{' '}
                {currencies
                  ? Object.values(currencies).map(currency => currency.name).join(', ')
                  : 'N/A'}
              </p>
            </div>
          </div>
          
          {borders && borders.length > 0 && (
            <div className="mt-6">
              <h5 className="font-semibold text-lg mb-3">Border Countries:</h5>
              <div className="flex flex-wrap gap-2">
                {borders.map(borderCode => (
                  <button
                    key={borderCode}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    onClick={() => navigate(`/country/${borderCode}`)}
                  >
                    {borderCode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Information Section */}
      <div className="mt-10">
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="bg-blue-500 text-white px-6 py-3">
            <h3 className="text-xl font-semibold">Additional Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg shadow-sm p-4 h-full">
                <h5 className="font-semibold text-lg mb-3">Geography</h5>
                <p>
                  <span className="font-medium">Area:</span> {formatNumber(area)} km²<br />
                  <span className="font-medium">Region:</span> {region}<br />
                  <span className="font-medium">Subregion:</span> {subregion || 'N/A'}
                </p>
              </div>
              
              <div className="border rounded-lg shadow-sm p-4 h-full">
                <h5 className="font-semibold text-lg mb-3">Demographics</h5>
                <p>
                  <span className="font-medium">Population:</span> {formatNumber(population)}<br />
                  <span className="font-medium">Languages:</span> {languages ? Object.values(languages).join(', ') : 'N/A'}<br />
                  <span className="font-medium">Currencies:</span> {currencies
                    ? Object.values(currencies).map(currency => `${currency.name} (${currency.symbol || 'N/A'})`).join(', ')
                    : 'N/A'}
                </p>
              </div>
              
              <div className="border rounded-lg shadow-sm p-4 h-full">
                <h5 className="font-semibold text-lg mb-3">International</h5>
                <p>
                  <span className="font-medium">Alpha-3 Code:</span> {country.cca3 || 'N/A'}<br />
                  <span className="font-medium">Border Countries:</span> {borders ? borders.length : 0}<br />
                  <span className="font-medium">UN Member:</span> {country.unMember ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailsPage;