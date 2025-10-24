import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
      back: 'Back',
      close: 'Close',
      search: 'Search',
      noResults: 'No results found',
      tryAgain: 'Try Again',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      copy: 'Copy',
      copied: 'Copied!',
    },
    navigation: {
      home: 'Home',
      categories: 'Categories',
      settings: 'Settings',
      language: 'Language',
    },
    home: {
      title: 'Blog',
      featuredPosts: 'Featured Posts',
      recentPosts: 'Recent Posts',
      readMore: 'Read More',
      noPostsFound: 'No posts found',
      loadingPosts: 'Loading posts...',
      featuredPostError: 'Failed to load featured posts',
      recentPostError: 'Failed to load recent posts',
    },
    post: {
      publishedOn: 'Published on',
      by: 'By',
      readTime: 'min read',
      loadingPost: 'Loading post...',
      postNotFound: 'Post not found',
      errorLoadingPost: 'Failed to load post',
    },
    categories: {
      title: 'Categories',
      allCategories: 'All Categories',
      postsInCategory: 'Posts in {category}',
      noCategoriesFound: 'No categories found',
      loadingCategories: 'Loading categories...',
      errorLoadingCategories: 'Failed to load categories',
      noPostsInCategory: 'No posts found in this category',
    },
    language: {
      english: 'English',
      indonesian: 'Bahasa Indonesia',
    },
  },
  id: {
    common: {
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      retry: 'Coba Lagi',
      back: 'Kembali',
      close: 'Tutup',
      search: 'Cari',
      noResults: 'Tidak ada hasil',
      tryAgain: 'Coba Lagi',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Edit',
      share: 'Bagikan',
      copy: 'Salin',
      copied: 'Tersalin!',
    },
    navigation: {
      home: 'Beranda',
      categories: 'Kategori',
      settings: 'Pengaturan',
      language: 'Bahasa',
    },
    home: {
      title: 'Blog',
      featuredPosts: 'Postingan Unggulan',
      recentPosts: 'Postingan Terbaru',
      readMore: 'Baca Selengkapnya',
      noPostsFound: 'Tidak ada postingan ditemukan',
      loadingPosts: 'Memuat postingan...',
      featuredPostError: 'Gagal memuat postingan unggulan',
      recentPostError: 'Gagal memuat postingan terbaru',
    },
    post: {
      publishedOn: 'Diterbitkan pada',
      by: 'Oleh',
      readTime: 'menit baca',
      loadingPost: 'Memuat postingan...',
      postNotFound: 'Postingan tidak ditemukan',
      errorLoadingPost: 'Gagal memuat postingan',
    },
    categories: {
      title: 'Kategori',
      allCategories: 'Semua Kategori',
      postsInCategory: 'Postingan di {category}',
      noCategoriesFound: 'Tidak ada kategori ditemukan',
      loadingCategories: 'Memuat kategori...',
      errorLoadingCategories: 'Gagal memuat kategori',
      noPostsInCategory: 'Tidak ada postingan di kategori ini',
    },
    language: {
      english: 'English',
      indonesian: 'Bahasa Indonesia',
    },
  },
};

// Default language
const defaultLanguage = 'en';

// Get device language or use default
const getDeviceLanguage = (): string => {
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = window.navigator.language || (window.navigator as any).userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      return resources[langCode as keyof typeof resources] ? langCode : defaultLanguage;
    }
  }
  return defaultLanguage;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage, // Start with default language
    fallbackLng: defaultLanguage,
    debug: __DEV__, // Only show debug logs in development

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense mode for better control
    },

    defaultNS: 'common',
    ns: ['common', 'navigation', 'home', 'post', 'categories', 'language'],
  });

export { i18n, defaultLanguage, getDeviceLanguage };
export default i18n;