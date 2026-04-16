/**
 * CREATE QUIZ PAGE
 * Allows users to create their own quizzes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Medium',
    timeLimit: 30,
    isPublished: true,
    questions: []
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 10
        }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quiz.title || quiz.title.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    
    if (quiz.questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiService.quizzes.create(quiz);
      toast.success('Quiz created successfully!');
      navigate('/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">✏️ Create New Quiz</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quiz Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
                minLength="3"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <select
                  value={quiz.category}
                  onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Programming</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Mathematics</option>
                  <option>General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Difficulty</label>
                <select
                  value={quiz.difficulty}
                  onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={quiz.timeLimit}
                  onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                  max="180"
                />
              </div>
              
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  checked={quiz.isPublished}
                  onChange={(e) => setQuiz({ ...quiz, isPublished: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700">Publish immediately</label>
              </div>
            </div>
          </div>
          
          {/* Questions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                + Add Question
              </button>
            </div>
            
            {quiz.questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Click "Add Question" to start building your quiz</p>
            ) : (
              <div className="space-y-6">
                {quiz.questions.map((question, qIdx) => (
                  <div key={qIdx} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-semibold">Question {qIdx + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Question text"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, oIdx) => (
                        <input
                          key={oIdx}
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          value={option}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600">Correct Answer</label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(qIdx, 'correctAnswer', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="0">Option A</option>
                          <option value="1">Option B</option>
                          <option value="2">Option C</option>
                          <option value="3">Option D</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Points</label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIdx, 'points', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg"
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;