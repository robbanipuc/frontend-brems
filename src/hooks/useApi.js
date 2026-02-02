import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/helpers';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      const result = response.data;
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

/**
 * Custom hook for paginated API calls
 */
export const usePaginatedApi = (apiFunction) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(params);
      const result = response.data;
      
      // Handle different response formats
      if (result.data && result.pagination) {
        setData(result.data);
        setPagination(result.pagination);
      } else if (result.data) {
        // Laravel pagination format
        setData(result.data);
        setPagination({
          currentPage: result.current_page,
          lastPage: result.last_page,
          perPage: result.per_page,
          total: result.total,
        });
      } else if (Array.isArray(result)) {
        // Non-paginated array
        setData(result);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          perPage: result.length,
          total: result.length,
        });
      }
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData([]);
    setPagination({
      currentPage: 1,
      lastPage: 1,
      perPage: 20,
      total: 0,
    });
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

/**
 * Custom hook for mutation API calls (POST, PUT, DELETE)
 */
export const useMutation = (apiFunction, options = {}) => {
  const { onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      const result = response.data;
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage, err);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
  };
};

export default useApi;