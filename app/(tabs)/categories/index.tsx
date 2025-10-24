import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

const CATEGORY_ITEM_HEIGHT = 80;

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const {
    categories,
    isLoading,
    error,
    refetch,
  } = useCategories();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const renderCategoryItem = React.useCallback(
    ({ item }: { item: Category }) => {
      return (
        <Link href={{ pathname: '/categories/[id]', params: { id: item.id.toString(), name: item.name } }} asChild>
          <TouchableOpacity style={[styles.categoryItem, { borderColor }]}>
            <View style={styles.categoryInfo}>
              <ThemedText style={styles.categoryName}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.categoryDescription} numberOfLines={2}>
                {item.description || t('categories.postsInCategory', { category: item.name })}
              </ThemedText>
              <ThemedText style={styles.postCount}>
                {item.count} {item.count === 1 ? 'post' : 'posts'}
              </ThemedText>
            </View>
            <View style={[styles.arrowContainer, { borderColor }]}>
              <ThemedText style={[styles.arrow, { color: tintColor }]}>
                →
              </ThemedText>
            </View>
          </TouchableOpacity>
        </Link>
      );
    },
    [borderColor, tintColor]
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor }]}>
      <ThemedText style={styles.emptyText}>
        {t('categories.noCategoriesFound')}
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={[styles.errorContainer, { backgroundColor }]}>
      <ThemedText style={styles.errorText}>
        {t('categories.errorLoadingCategories')}
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
        {t('categories.loadingCategories')}
      </ThemedText>
    </View>
  );

  if (isLoading && categories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t('categories.title')}
          </ThemedText>
          <LanguageSwitcher compact={true} />
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error && categories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t('categories.title')}
          </ThemedText>
          <LanguageSwitcher compact={true} />
        </View>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {t('categories.title')}
        </ThemedText>
        <LanguageSwitcher compact={true} />
      </View>

      <ThemedView style={styles.content}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => `category-${item.id}`}
          style={styles.list}
          contentContainerStyle={
            categories.length === 0 ? styles.emptyListContent : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: CATEGORY_ITEM_HEIGHT,
            offset: CATEGORY_ITEM_HEIGHT * index,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
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
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: CATEGORY_ITEM_HEIGHT,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 18,
  },
  postCount: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 12,
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