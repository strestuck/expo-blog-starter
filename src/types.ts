export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width: number;
    height: number;
  };
}

export interface WordPressAuthor {
  id: number;
  name: string;
  description?: string;
  avatar_urls?: {
    24?: string;
    48?: string;
    96?: string;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  count: number;
  parent: number;
  _links?: {
    self?: Array<{ href: string }>;
    wp:post_type?: Array<{ href: string }>;
    'curies'?: Array<{ name: string; href: string; templated: boolean }>;
  };
}

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta?: any[];
  categories: number[];
  tags: number[];
  _links?: {
    self?: Array<{ href: string }>;
    author?: Array<{ embeddable: boolean; href: string }>;
    replies?: Array<{ embeddable: boolean; href: string }>;
    'wp:featuredmedia'?: Array<{ embeddable: boolean; href: string }>;
    'wp:attachment'?: Array<{ href: string }>;
    'wp:term'?: Array<{ taxonomy: string; embeddable: boolean; href: string }[]>;
    curies?: Array<{ name: string; href: string; templated: boolean }>;
  };
  _embedded?: {
    author?: WordPressAuthor[];
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressCategory[][];
  };
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links?: {
    self?: Array<{ href: string }>;
    collection?: Array<{ href: string }>;
    about?: Array<{ href: string }>;
    'wp:post_type'?: Array<{ href: string }>;
    curies?: Array<{ name: string; href: string; templated: boolean }>;
  };
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}