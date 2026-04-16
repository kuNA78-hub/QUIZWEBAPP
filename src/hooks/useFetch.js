/**
 * useFetch HOOK
 * Handles API requests with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useFetch = (fetchFunction, options = {}) => {
  const { immediate = true, showError = true } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      if (showError) {
        toast.error(err.response?.data?.message || 'Request failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, showError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, refetch: execute };
};