/**
 * useTimer HOOK
 * Manages countdown timer for quizzes
 */

import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialSeconds, onTimeout) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      if (timeRemaining <= 0 && onTimeoutRef.current) {
        onTimeoutRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const reset = (newSeconds) => {
    setTimeRemaining(newSeconds);
    setIsActive(true);
  };

  const pause = () => setIsActive(false);
  const resume = () => setIsActive(true);

  return {
    timeRemaining,
    isActive,
    minutes: Math.floor(timeRemaining / 60),
    seconds: timeRemaining % 60,
    reset,
    pause,
    resume
  };
};