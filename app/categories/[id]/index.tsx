import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useCategoryPosts } from '@/hooks/useCategoryPosts';
import { Post, Category } from '@/types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

const POST_ITEM_HEIGHT = 120;

export default function CategoryPostsScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    posts,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore,
  } = useCategoryPosts(parseInt(id));

  const [isRefreshing, setIsRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const categoryId = parseInt(id);
  const categoryName = name || `Category ${categoryId}`;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderPostItem = React.useCallback(
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

  const renderFooter = () => {
    if (!hasMore || isLoading) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tintColor} />
        <ThemedText style={styles.footerText}>Loading more...</ThemedText>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor }]}>
      <ThemedText style={styles.emptyText}>
        {t('categories.noPostsInCategory')}
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={[styles.errorContainer, { backgroundColor }]}>
      <ThemedText style={styles.errorText}>
        {t('home.recentPostError')}
      </ThemedText>
      <TouchableOpacity
        style={[styles.retryButton, { borderColor: tintColor }]}
        onPress={refetch}
      >
        <ThemedText style={[styles.retryText, { color: tintColor }]}>
          {t('common.retry')}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={[styles.loadingContainer, { backgroundColor }]}>
      <ActivityIndicator size="large" color={tintColor} />
      <ThemedText style={styles.loadingText}>
        {t('home.loadingPosts')}
      </ThemedText>
    </View>
  );

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={[styles.backText, { color: tintColor }]}>
              ← {t('common.back')}
            </ThemedText>
          </TouchableOpacity>
          <LanguageSwitcher compact={true} />
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={[styles.backText, { color: tintColor }]}>
              ← {t('common.back')}
            </ThemedText>
          </TouchableOpacity>
          <LanguageSwitcher compact={true} />
        </View>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={[styles.backText, { color: tintColor }]}>
            ← {t('common.back')}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {categoryName}
        </ThemedText>
        <LanguageSwitcher compact={true} />
      </View>

      <ThemedView style={styles.content}>
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => `post-${item.id}`}
          style={styles.list}
          contentContainerStyle={
            posts.length === 0 ? styles.emptyListContent : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          }
          onEndReached={loadMore}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 4,
    flex: 1,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 2,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});