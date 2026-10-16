/**
 * Navbar Layout Component
 * Member 1 (Frontend & UI/UX) — Sprint 1
 */

import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Users, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:text-indigo-200 transition-colors">
          <BookOpen size={24} />
          StudySync
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1 text-sm hover:text-indigo-200 transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/groups" className="flex items-center gap-1 text-sm hover:text-indigo-200 transition-colors">
                <Users size={16} /> Browse Groups
              </Link>
              <span className="text-indigo-300 text-sm hidden md:block">
                {user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-indigo-200 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-4 py-1.5 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
