/**
 * QUIZ DETAIL PAGE
 * Shows detailed information about a specific quiz
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const QuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await apiService.quizzes.getById(id);
      setQuiz(response.data.data);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      toast.error('Please login to take this quiz');
      navigate('/login');
      return;
    }
    navigate(`/quiz/${id}/take`);
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz) return null;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-indigo-100">{quiz.description}</p>
          </div>
          
          {/* Info Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl">📂</div>
                <div className="font-semibold">{quiz.category}</div>
                <div className="text-sm text-gray-500">Category</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">⭐</div>
                <div className="font-semibold">{quiz.difficulty}</div>
                <div className="text-sm text-gray-500">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">📋</div>
                <div className="font-semibold">{quiz.questions?.length || 0}</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">⏱️</div>
                <div className="font-semibold">{quiz.timeLimit || 30} min</div>
                <div className="text-sm text-gray-500">Time Limit</div>
              </div>
            </div>
            
            {/* Question Preview */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Questions Preview</h2>
              <div className="space-y-3">
                {quiz.questions?.slice(0, 3).map((q, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{idx + 1}. {q.questionText}</p>
                    <p className="text-sm text-gray-500 mt-1">Points: {q.points}</p>
                  </div>
                ))}
                {quiz.questions?.length > 3 && (
                  <p className="text-gray-500 text-sm">+ {quiz.questions.length - 3} more questions</p>
                )}
              </div>
            </div>
            
            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
            >
              Start Quiz 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;