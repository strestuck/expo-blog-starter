import React from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { FeaturedPostsCarousel } from '@/components/FeaturedPostsCarousel';
import { RecentPostsList } from '@/components/RecentPostsList';
import { usePosts } from '@/hooks/usePosts';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const { t } = useTranslation();
  const {
    featuredPosts,
    recentPosts,
    isLoading,
    error,
    refetch,
  } = usePosts();

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {t('home.title')}
        </ThemedText>
        <LanguageSwitcher compact={true} />
      </View>

      <ThemedView style={styles.content}>
        <FeaturedPostsCarousel
          posts={featuredPosts}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />

        <RecentPostsList
          posts={recentPosts}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onRefresh={handleRefresh}
          isRefreshing={false}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});
