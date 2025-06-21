import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiSearch, FiBell, FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // You'll need to implement your authentication logic here
  // This could come from a context, Redux store, or custom hook
  const isAuthenticated = false; // Replace with your actual auth state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FiBell className="text-blue-600 text-lg" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Civix</span>
            <span className="text-lg font-bold sm:hidden">SA</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSubmit} className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par titre..."
                  className="w-full pl-10 pr-4 py-2 border-0 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-200"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-colors duration-200"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <button className="text-white hover:text-blue-200 transition-colors duration-200">
                  <FiBell className="w-5 h-5" />
                </button>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Mon Compte</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create-account" 
                  className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                >
                  S'inscrire
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-blue-200 transition-colors duration-200"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mt-2 mb-4 p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par titre..."
                  className="w-full pl-10 pr-4 py-2 border-0 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-colors duration-200"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Mon Compte</span>
                  </Link>
                  <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
                    <FiBell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/create-account" 
                    className="text-white hover:text-blue-200 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium transition-all duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;