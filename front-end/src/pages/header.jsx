import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';

export default function Header({ isAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic here
    console.log('Search:', searchQuery);
  };

  return (
    <header className="w-full bg-violet-950 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-violet-300 hover:text-blue-700 transition-colors">
              IJSoS
            </Link>
          </div>


          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
            <input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent placeholder-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />

              <button 
                type="submit"
                className="absolute right-3 top-3 text-gray-300 hover:text-blue-600"
              >
                <FiSearch size={18} />
              </button>
            </form>

            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              className="p-2 text-gray-300 hover:text-blue-300 transition-colors"
            >
              <FiUser size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-violet-950 shadow-md">
          <div className="px-2 pt-2 pb-4 flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 text-gray-300 hover:text-blue-600"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>
            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
            >
              <FiUser size={20} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}