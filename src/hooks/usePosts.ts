import { useState, useEffect, useCallback } from 'react';
import { Post, LoadingState } from '@/types';
import apiService from '@/api';

interface UsePostsOptions {
  categories?: number[];
  tags?: number[];
  search?: string;
  page?: number;
  perPage?: number;
  include?: number[];
  exclude?: number[];
}

interface UsePostsReturn extends LoadingState {
  posts: Post[];
  featuredPosts: Post[];
  recentPosts: Post[];
  refetch: () => Promise<void>;
  fetchPosts: (options?: UsePostsOptions) => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const usePosts = (initialOptions?: UsePostsOptions): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [options, setOptions] = useState<UsePostsOptions>(initialOptions || {});

  const fetchPosts = useCallback(async (fetchOptions?: UsePostsOptions) => {
    try {
      setError(null);

      const finalOptions = {
        ...options,
        ...fetchOptions,
        page: fetchOptions?.page || 1,
      };

      const params: any = {};

      if (finalOptions.categories && finalOptions.categories.length > 0) {
        params.categories = finalOptions.categories.join(',');
      }

      if (finalOptions.tags && finalOptions.tags.length > 0) {
        params.tags = finalOptions.tags.join(',');
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

      if (finalOptions.include && finalOptions.include.length > 0) {
        params.include = finalOptions.include.join(',');
      }

      if (finalOptions.exclude && finalOptions.exclude.length > 0) {
        params.exclude = finalOptions.exclude.join(',');
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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch posts';
      setError(errorMessage);
      throw err;
    }
  }, [options]);

  const fetchFeaturedPosts = useCallback(async () => {
    try {
      const featured = await apiService.getPosts({
        categories: [6], // Category 6 for featured posts
        per_page: 5,
      });
      setFeaturedPosts(featured);
    } catch (err: any) {
      console.error('Error fetching featured posts:', err);
      // Don't set error state for featured posts, just log it
    }
  }, []);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const recent = await apiService.getPosts({
        per_page: 10,
      });
      setRecentPosts(recent);
    } catch (err: any) {
      console.error('Error fetching recent posts:', err);
      // Don't set error state for recent posts, just log it
    }
  }, []);

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
      await Promise.all([
        fetchPosts({ ...options, page: 1 }),
        fetchFeaturedPosts(),
        fetchRecentPosts(),
      ]);
    } catch (err) {
      // Error is already handled in fetchPosts
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, fetchFeaturedPosts, fetchRecentPosts, options]);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchPosts({ ...options, page: 1 }),
          fetchFeaturedPosts(),
          fetchRecentPosts(),
        ]);
      } catch (err) {
        // Error is already handled in fetchPosts
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
    posts,
    featuredPosts,
    recentPosts,
    isLoading,
    error,
    refetch,
    fetchPosts,
    hasMore,
    loadMore,
  };
};

export default usePosts;