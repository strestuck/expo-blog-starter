import { useState, useEffect, useCallback } from 'react';
import { Post, LoadingState } from '@/types';
import apiService from '@/api';

interface UseCategoryPostsOptions {
  categoryId?: number;
  search?: string;
  page?: number;
  perPage?: number;
}

interface UseCategoryPostsReturn extends LoadingState {
  posts: Post[];
  category: string | null;
  refetch: () => Promise<void>;
  fetchPosts: (options?: UseCategoryPostsOptions) => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const useCategoryPosts = (categoryId?: number): UseCategoryPostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [options, setOptions] = useState<UseCategoryPostsOptions>({
    categoryId,
    perPage: 10,
  });

  const fetchPosts = useCallback(async (fetchOptions?: UseCategoryPostsOptions) => {
    try {
      setError(null);

      const finalOptions = {
        ...options,
        ...fetchOptions,
        page: fetchOptions?.page || 1,
      };

      const params: any = {};

      if (finalOptions.categoryId) {
        params.categories = finalOptions.categoryId;
      }

      if (finalOptions.search) {
        params.search = finalOptions.search;
      }

      if (finalOptions.page) {
        params.page = finalOptions.page;
      }

      if (finalOptions.perPage) {
        params.per_page = finalOptions.perPage;
      }

      const fetchedPosts = await apiService.getPosts(params);

      // If this is a paginated request (page > 1), append to existing posts
      if (finalOptions.page && finalOptions.page > 1) {
        setPosts(prev => [...prev, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }

      // Check if there are more posts to load
      const postsPerPage = finalOptions.perPage || 10;
      setHasMore(fetchedPosts.length === postsPerPage);

      return fetchedPosts;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch category posts';
      setError(errorMessage);
      throw err;
    }
  }, [options]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    try {
      await fetchPosts({ ...options, page: nextPage });
    } catch (err) {
      setCurrentPage(currentPage); // Reset page on error
    }
  }, [hasMore, isLoading, currentPage, options, fetchPosts]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      await fetchPosts({ ...options, page: 1 });
    } catch (err) {
      // Error is already handled in fetchPosts
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, options]);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        await fetchPosts({ ...options, page: 1 });
      } catch (err) {
        // Error is already handled in fetchPosts
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (categoryId) {
      initializeData();
    }

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  return {
    posts,
    category,
    isLoading,
    error,
    refetch,
    fetchPosts,
    hasMore,
    loadMore,
  };
};

export default useCategoryPosts;