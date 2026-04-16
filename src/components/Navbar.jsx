/**
 * NAVIGATION BAR COMPONENT
 * Shows different links based on login status
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            🎯 QuizMaster
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/quizzes" className="text-gray-700 hover:text-indigo-600 transition">
              Quizzes
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
                <Link to="/create-quiz" className="text-gray-700 hover:text-indigo-600 transition">
                  Create Quiz
                </Link>
                <Link to="/results" className="text-gray-700 hover:text-indigo-600 transition">
                  My Results
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">
                    👋 {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;