import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';
import Header from './pages/Header';
import HomePage from './pages/HomePage';
import CountryDetailsPage from './pages/CountryDetailsPage';
import LoginPage from './pages/Loginpage';
import FavoritesPage from './pages/FavoritesPage';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:countryCode" element={<CountryDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
            </Routes>
          </main>
          <footer className="bg-blue-600 text-white py-4 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p>© {new Date().getFullYear()} World Countries Explorer</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;