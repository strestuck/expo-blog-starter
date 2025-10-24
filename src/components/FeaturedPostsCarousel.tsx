import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Post } from '@/types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width: screenWidth } = Dimensions.get('window');
const SLIDER_WIDTH = screenWidth;
const ITEM_WIDTH = screenWidth * 0.85;
const ITEM_HEIGHT = 200;

interface FeaturedPostsCarouselProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const FeaturedPostsCarousel: React.FC<FeaturedPostsCarouselProps> = ({
  posts,
  isLoading,
  error,
  onRetry,
}) => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<Carousel<Post>>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const overlayColor = '#000000';

  const renderItem = useCallback(
    ({ item }: { item: Post; index: number }) => {
      const featuredImage = item._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = featuredImage?.source_url;

      return (
        <Link href={`/posts/${item.id}`} asChild>
          <TouchableOpacity style={styles.slideContainer} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.image, { backgroundColor }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor }]}>
                  <Text style={[styles.placeholderText, { color: textColor }]}>
                    {item.title.rendered.replace(/<[^>]*>/g, '').substring(0, 50)}...
                  </Text>
                </View>
              )}
              <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                  <ThemedText
                    style={styles.title}
                    numberOfLines={2}
                    lightColor="#FFFFFF"
                    darkColor="#FFFFFF"
                  >
                    {item.title.rendered.replace(/<[^>]*>/g, '')}
                  </ThemedText>
                  <View style={styles.metadata}>
                    <Text style={styles.date}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      );
    },
    [backgroundColor, textColor]
  );

  const pagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={posts.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={[
          styles.paginationDot,
          { backgroundColor: tintColor },
        ]}
        inactiveDotStyle={[
          styles.paginationInactiveDot,
          { backgroundColor: textColor + '40' },
        ]}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
      />
    );
  }, [posts.length, activeSlide, tintColor, textColor]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('home.featuredPosts')}
        </ThemedText>
        <View style={[styles.loadingContainer, { backgroundColor }]}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>
            {t('home.loadingPosts')}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('home.featuredPosts')}
        </ThemedText>
        <View style={[styles.errorContainer, { backgroundColor }]}>
          <ThemedText style={styles.errorText}>
            {t('home.featuredPostError')}
          </ThemedText>
          {onRetry && (
            <TouchableOpacity style={[styles.retryButton, { borderColor: tintColor }]} onPress={onRetry}>
              <ThemedText style={[styles.retryText, { color: tintColor }]}>
                {t('common.retry')}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    );
  }

  if (posts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('home.featuredPosts')}
        </ThemedText>
        <View style={[styles.emptyContainer, { backgroundColor }]}>
          <ThemedText style={styles.emptyText}>
            {t('home.noPostsFound')}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('home.featuredPosts')}
      </ThemedText>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={posts}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          itemHeight={ITEM_HEIGHT}
          layout="default"
          onSnapToItem={setActiveSlide}
          autoplay={true}
          autoplayInterval={4000}
          loop={true}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
        />
        {posts.length > 1 && pagination()}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carouselContainer: {
    alignItems: 'center',
  },
  slideContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  paginationContainer: {
    paddingTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  paginationInactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 20,
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
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FeaturedPostsCarousel;