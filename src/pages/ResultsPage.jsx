/**
 * RESULTS PAGE
 * Shows user's quiz attempt history
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const ResultsPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const latestResult = location.state?.result;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await apiService.results.getUserResults();
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 My Quiz Results</h1>
        
        {latestResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-green-800">Latest Quiz Result</h2>
            <p className="text-green-700">
              Score: {latestResult.score}/{latestResult.totalPossible} ({latestResult.percentage}%)
              {latestResult.passed ? ' ✅ Passed!' : ' ❌ Failed'}
            </p>
          </div>
        )}
        
        {results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No quiz attempts yet. Take a quiz to see results!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {result.quizId?.title || 'Unknown Quiz'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {result.quizId?.category} • {result.quizId?.difficulty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.score}/{result.totalPossibleScore} points
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Completed: {new Date(result.completedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;