import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            World Countries Explorer
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/favorites" className="hover:text-blue-200 transition-colors">
                  Favorites
                </Link>
                <div className="flex items-center">
                  <span className="mr-3 hidden md:inline">Hello, {currentUser.name}</span>
                  <button
                    onClick={logout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;