/**
 * HOME PAGE
 * Landing page with hero section and call to action
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎯 Test Your Knowledge
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Challenge yourself with interactive quizzes on various topics.
            Learn, compete, and track your progress!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              to="/quizzes"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Quizzes
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold text-lg mb-2">Multiple Topics</h3>
              <p className="text-gray-600">Programming, Science, History, and more</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your scores and improvement</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold text-lg mb-2">Compete & Learn</h3>
              <p className="text-gray-600">Challenge yourself and learn new things</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;