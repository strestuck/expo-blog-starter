import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Post } from '@/types';
import apiService from '@/api';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import RenderHtml from 'react-native-render-html';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  const postId = parseInt(id);

  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError(t('post.postNotFound'));
      setIsLoading(false);
      return;
    }

    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedPost = await apiService.getPostById(postId);
      setPost(fetchedPost);
    } catch (err: any) {
      console.error('Error fetching post:', err);
      const errorMessage = err.response?.data?.message || err.message || t('post.errorLoadingPost');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    try {
      const title = post.title.rendered.replace(/<[^>]*>/g, '');
      const url = post.link;

      await Share.share({
        title,
        url,
        message: `${title}\n\n${url}`,
      });
    } catch (error) {
      Alert.alert(t('common.error'), t('common.shareFailed'));
    }
  };

  const handleRetry = () => {
    fetchPost();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>
            {t('post.loadingPost')}
          </ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <ThemedText style={styles.errorText}>
            {error}
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: tintColor }]}
            onPress={handleRetry}
          >
            <ThemedText style={[styles.retryText, { color: tintColor }]}>
              {t('common.retry')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    if (!post) {
      return (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <ThemedText style={styles.errorText}>
            {t('post.postNotFound')}
          </ThemedText>
        </View>
      );
    }

    const author = post._embedded?.author?.[0];
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
    const title = post.title.rendered.replace(/<[^>]*>/g, '');
    const content = post.content.rendered;
    const publishDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Custom HTML renderers for better styling
    const htmlConfig = {
      baseStyle: {
        fontSize: 16,
        lineHeight: 24,
        color: textColor,
      },
      tagsStyles: {
        h1: {
          fontSize: 24,
          fontWeight: '700',
          marginVertical: 16,
          color: textColor,
        },
        h2: {
          fontSize: 20,
          fontWeight: '600',
          marginVertical: 12,
          color: textColor,
        },
        h3: {
          fontSize: 18,
          fontWeight: '600',
          marginVertical: 10,
          color: textColor,
        },
        p: {
          marginVertical: 8,
          lineHeight: 24,
          color: textColor,
        },
        strong: {
          fontWeight: '700',
          color: textColor,
        },
        em: {
          fontStyle: 'italic',
          color: textColor,
        },
        a: {
          color: tintColor,
          textDecorationLine: 'underline',
        },
        ul: {
          marginVertical: 8,
          marginLeft: 16,
        },
        ol: {
          marginVertical: 8,
          marginLeft: 16,
        },
        li: {
          marginVertical: 4,
          color: textColor,
        },
        blockquote: {
          backgroundColor: borderColor + '20',
          borderLeftWidth: 4,
          borderLeftColor: tintColor,
          padding: 16,
          marginVertical: 16,
          fontStyle: 'italic',
        },
        code: {
          backgroundColor: borderColor + '20',
          fontFamily: 'monospace',
          padding: 4,
          borderRadius: 4,
        },
        pre: {
          backgroundColor: borderColor + '20',
          padding: 16,
          borderRadius: 8,
          marginVertical: 16,
          overflow: 'hidden',
        },
        img: {
          marginVertical: 16,
          borderRadius: 8,
        },
      },
    };

    return (
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.postHeader}>
          <ThemedText type="title" style={styles.postTitle}>
            {title}
          </ThemedText>

          <View style={styles.postMetadata}>
            <View style={styles.authorDate}>
              <ThemedText style={styles.authorText}>
                {t('post.by')} {author?.name || 'Unknown'}
              </ThemedText>
              <ThemedText style={styles.dateText}>
                {t('post.publishedOn')} {publishDate}
              </ThemedText>
            </View>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <ThemedText style={[styles.shareText, { color: tintColor }]}>
                {t('common.share')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Image */}
        {featuredImage?.source_url && (
          <View style={styles.featuredImageContainer}>
            <RenderHtml
              source={{
                html: `<img src="${featuredImage.source_url}" alt="${featuredImage.alt_text || title}" style="width: 100%; height: auto; border-radius: 8px;" />`,
              }}
              contentWidth={styles.content.width - 32}
              {...htmlConfig}
            />
          </View>
        )}

        {/* Post Content */}
        <View style={styles.postContent}>
          <RenderHtml
            source={{ html: content }}
            contentWidth={styles.content.width - 32}
            {...htmlConfig}
          />
        </View>
      </ThemedView>
    );
  };

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

      {renderContent()}
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
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
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
  postHeader: {
    marginBottom: 24,
  },
  postTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 16,
  },
  postMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorDate: {
    flex: 1,
  },
  authorText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredImageContainer: {
    marginBottom: 24,
  },
  postContent: {
    flex: 1,
  },
});