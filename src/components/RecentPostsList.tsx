import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Post } from '@/types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

interface RecentPostsListProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isRefreshing?: boolean;
}

const POST_ITEM_HEIGHT = 120;

export const RecentPostsList: React.FC<RecentPostsListProps> = ({
  posts,
  isLoading,
  error,
  onRetry,
  onRefresh,
  onLoadMore,
  hasMore = false,
  isRefreshing = false,
}) => {
  const { t } = useTranslation();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const renderPostItem = useCallback(
    ({ item }: { item: Post }) => {
      const featuredImage = item._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = featuredImage?.source_url;
      const author = item._embedded?.author?.[0];
      const excerpt = item.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 120);

      return (
        <Link href={`/posts/${item.id}`} asChild>
          <TouchableOpacity style={[styles.postItem, { borderColor }]}>
            <View style={styles.contentContainer}>
              <ThemedText style={styles.title} numberOfLines={2}>
                {item.title.rendered.replace(/<[^>]*>/g, '')}
              </ThemedText>

              <View style={styles.metadata}>
                <ThemedText style={styles.author}>
                  {author?.name || t('post.by') + ' Unknown'}
                </ThemedText>
                <ThemedText style={styles.date}>
                  {new Date(item.date).toLocaleDateString()}
                </ThemedText>
              </View>

              <ThemedText style={styles.excerpt} numberOfLines={2}>
                {excerpt}
              </ThemedText>

              <ThemedText style={[styles.readMore, { color: tintColor }]}>
                {t('home.readMore')} →
              </ThemedText>
            </View>

            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.thumbnail, { backgroundColor }]}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </Link>
      );
    },
    [backgroundColor, borderColor, textColor, tintColor]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore || !isLoading) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tintColor} />
        <ThemedText style={styles.footerText}>Loading more...</ThemedText>
      </View>
    );
  }, [hasMore, isLoading, tintColor]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <ThemedText style={styles.emptyText}>
          {t('home.noPostsFound')}
        </ThemedText>
      </View>
    );
  }, [isLoading, backgroundColor]);

  const renderErrorState = useCallback(() => {
    if (!error) return null;

    return (
      <View style={[styles.errorContainer, { backgroundColor }]}>
        <ThemedText style={styles.errorText}>
          {t('home.recentPostError')}
        </ThemedText>
        {onRetry && (
          <TouchableOpacity style={[styles.retryButton, { borderColor: tintColor }]} onPress={onRetry}>
            <ThemedText style={[styles.retryText, { color: tintColor }]}>
              {t('common.retry')}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [error, backgroundColor, tintColor, onRetry]);

  if (error && posts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('home.recentPosts')}
        </ThemedText>
        {renderErrorState()}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('home.recentPosts')}
      </ThemedText>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => `post-${item.id}`}
        style={styles.list}
        contentContainerStyle={posts.length === 0 ? styles.emptyListContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          ) : undefined
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: POST_ITEM_HEIGHT,
          offset: POST_ITEM_HEIGHT * index,
          index,
        })}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  postItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: POST_ITEM_HEIGHT,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    opacity: 0.7,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  separator: {
    height: 0,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecentPostsList;