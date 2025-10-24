import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://blog.doavers.com/wp-json/wp/v2/';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getPosts(params?: object): Promise<Post[]> {
    try {
      const response = await this.api.get('/posts', {
        params: {
          _embed: true,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get('/categories', {
        params: {
          _embed: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getPostById(id: number): Promise<Post> {
    try {
      const response = await this.api.get(`/posts/${id}`, {
        params: {
          _embed: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;