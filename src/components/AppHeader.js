import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust path if authSlice is elsewhere

export default function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 antialiased selection:bg-gray-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-gray-900 tracking-tight text-lg">
          <span className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-sans">⚡</span>
          <span>Forge.ai</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500">
          <Link to="/dashboard" className="px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">Workspace</Link>
          <Link to="/create" className="px-3 py-2 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">Forge Content</Link>
        </nav>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all active:scale-[0.98]"
          >
            Log out
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Panel Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-xs">
          <Link 
            to="/dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50 rounded-xl"
          >
            Workspace Dashboard
          </Link>
          <Link 
            to="/create" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
          >
            Forge Content Matrix
          </Link>
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full text-center px-4 py-3 text-sm font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Log out of Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
