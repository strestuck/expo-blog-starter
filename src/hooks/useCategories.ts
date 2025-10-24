import { useState, useEffect, useCallback } from 'react';
import { Category, LoadingState } from '@/types';
import apiService from '@/api';

interface UseCategoriesReturn extends LoadingState {
  categories: Category[];
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const fetchedCategories = await apiService.getCategories();

      // Filter out empty categories and sort by name
      const filteredCategories = fetchedCategories
        .filter(category => category.count > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(filteredCategories);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchCategories();
    } catch (err) {
      // Error is already handled in fetchCategories
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        await fetchCategories();
      } catch (err) {
        // Error is already handled in fetchCategories
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};

export default useCategories;