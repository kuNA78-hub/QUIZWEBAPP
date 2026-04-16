/**
 * QUIZ TAKING PAGE
 * Allows users to take the quiz with timer and navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const QuizTakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeRemaining <= 0 || !quiz) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await apiService.quizzes.getById(id);
      const quizData = response.data.data;
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill(null));
      setTimeRemaining(quizData.timeLimit * 60);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    }
  };

  const handleAnswerSelect = (selectedIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`);
      if (!confirm) return;
    }
    
    setSubmitting(true);
    const timeTaken = (quiz.timeLimit * 60) - timeRemaining;
    
    try {
      const response = await apiService.results.submit({
        quizId: id,
        answers: answers,
        timeTaken: timeTaken
      });
      
      toast.success('Quiz submitted successfully!');
      navigate('/results', { state: { result: response.data.data } });
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (!quiz) {
    return <div className="text-center py-12">Loading quiz...</div>;
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-2xl font-bold text-indigo-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Question {currentIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        
        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.questionText}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all
                  ${answers[currentIndex] === idx 
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600"
          >
            Previous
          </button>
          
          {currentIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;