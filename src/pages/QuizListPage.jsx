/**
 * QUIZ LIST PAGE
 * Displays all available quizzes with filtering options
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      
      const response = await apiService.quizzes.getAll(params);
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Programming', 'Science', 'History', 'Mathematics', 'General'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const handleFilterChange = (type, value) => {
    setFilters({
      ...filters,
      [type]: value === 'All' ? '' : value
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 Available Quizzes</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Quiz Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes found. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;