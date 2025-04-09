import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const response = await api.get(`/related-products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching related products for product ID ${id}:`, error);
    throw error;
  }
};

export const getDistributorProducts = async () => {
  try {
    const response = await api.get('/distributor-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching distributor products:', error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const response = await api.get('/blog-posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const getBlogPost = async (id) => {
  try {
    const response = await api.get(`/blog-post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }
};

export const getRelatedPosts = async (id) => {
  try {
    const response = await api.get(`/related-posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching related posts for blog post ID ${id}:`, error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    console.log("Logging in user:", data);
    const response = await api.post('/login', data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    console.log("Registering user:", data);
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for user ID ${userId}:`, error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const response = await api.put(`/user/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user profile for user ID ${userId}:`, error);
    throw error;
  }
};

export const createOrder = async (userId, orderData) => {
  try {
    const response = await api.post('/checkout', { userId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const submitQuote = async (data) => {
  try {
    const response = await api.post('/quote', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

export const submitContact = async (data) => {
  try {
    const response = await api.post('/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const submitChat = async (data) => {
  try {
    console.log("Submitting chat message:", data);
    const response = await api.post('/chat', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting chat:', error);
    throw error;
  }
};

export const getAnalyticsData = async () => {
  try {
    const response = await api.get('/analytics/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export const getLeads = async () => {
  try {
    const response = await api.get('/leads');
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

// Export the api instance for use in useAuth
export { api };