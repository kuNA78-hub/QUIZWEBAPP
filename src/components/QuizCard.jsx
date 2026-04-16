/**
 * QUIZ CARD COMPONENT
 * Displays quiz information in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
            {quiz.category}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {quiz.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {quiz.description}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>📋 {quiz.questions?.length || 0} questions</span>
          <span>⭐ {quiz.totalPoints || 0} points</span>
          <span>⏱️ {quiz.timeLimit || 30} min</span>
        </div>

        {/* Button */}
        <Link
          to={`/quizzes/${quiz._id}`}
          className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          View Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;