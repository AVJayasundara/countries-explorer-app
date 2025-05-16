import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const FavoritesPage = () => {
  const { favoriteCountries, removeFavorite, currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          You need to be logged in to view favorites.
        </div>

        <Link 
          to="/login" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Your Favorite Countries</h1>

      {favoriteCountries.length === 0 ? (
        <div className="text-center">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            You haven't added any favorite countries yet
          </div>
          <Link 
            to="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteCountries.map(country => (
            <div key={country.cca3} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => removeFavorite(country.cca3)}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                aria-label="Remove from favorites"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              
              <Link to={`/country/${country.cca3}`} className="block">
                <div className="h-40 overflow-hidden">
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-lg">{country.name}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;