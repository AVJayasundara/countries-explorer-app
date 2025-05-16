import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedFavorites = localStorage.getItem('favoriteCountries');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedFavorites) {
      setFavoriteCountries(JSON.parse(storedFavorites));
    }
    
    setLoading(false);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('favoriteCountries', JSON.stringify(favoriteCountries));
    }
  }, [favoriteCountries, currentUser]);

  // Login function
  const login = (email, password) => {
    // For demo purposes, we'll use a simple validation
    // In a real app, you would make an API call to your backend
    if (email && password.length >= 6) {
      const user = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  // Register function
  const register = (email, password, name) => {
    // For demo purposes, we'll use a simple validation
    // In a real app, you would make an API call to your backend
    if (email && password.length >= 6) {
      const user = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
      };
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, error: 'Registration failed. Please check your details.' };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    // We don't remove favorites so they persist between sessions
  };

  // Add country to favorites
  const addFavorite = (country) => {
    // Check if country already exists in favorites
    if (!favoriteCountries.some(c => c.cca3 === country.cca3)) {
      const countryToAdd = {
        cca3: country.cca3,
        name: country.name.common,
        flag: country.flags.png || country.flags.svg,
      };
      setFavoriteCountries([...favoriteCountries, countryToAdd]);
    }
  };

  // Remove country from favorites
  const removeFavorite = (countryCode) => {
    setFavoriteCountries(favoriteCountries.filter(c => c.cca3 !== countryCode));
  };

  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    return favoriteCountries.some(c => c.cca3 === countryCode);
  };

  // The value that will be supplied to consuming components
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    favoriteCountries,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;