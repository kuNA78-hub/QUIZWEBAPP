/**
 * useQuiz HOOK
 * Manages quiz taking logic (answers, navigation, scoring)
 */

import { useState, useCallback } from 'react';

export const useQuiz = (questions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions?.length || 0).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);

  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions?.[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredCount = answers.filter(a => a !== null).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const selectAnswer = useCallback((answerIndex) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = answerIndex;
      return newAnswers;
    });
  }, [currentIndex]);

  const nextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [isLastQuestion]);

  const prevQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [isFirstQuestion]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  }, [totalQuestions]);

  const completeQuiz = useCallback(() => {
    setQuizCompleted(true);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers(new Array(totalQuestions).fill(null));
    setQuizCompleted(false);
  }, [totalQuestions]);

  const calculateScore = useCallback(() => {
    let score = 0;
    questions?.forEach((question, idx) => {
      if (answers[idx] === question.correctAnswer) {
        score += question.points || 10;
      }
    });
    return score;
  }, [questions, answers]);

  const calculatePercentage = useCallback(() => {
    const totalPoints = questions?.reduce((sum, q) => sum + (q.points || 10), 0) || 1;
    return (calculateScore() / totalPoints) * 100;
  }, [questions, calculateScore]);

  return {
    // State
    currentIndex,
    currentQuestion,
    answers,
    quizCompleted,
    totalQuestions,
    progress,
    answeredCount,
    isLastQuestion,
    isFirstQuestion,
    
    // Actions
    selectAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    completeQuiz,
    resetQuiz,
    
    // Calculations
    calculateScore,
    calculatePercentage,
    getScore: calculateScore,
    getPercentage: calculatePercentage
  };
};