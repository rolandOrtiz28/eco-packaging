import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor for detailed error logging
api.interceptors.response.use(
  response => response,
  error => {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };
    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

// PRODUCTS
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching products:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/product/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const response = await api.get(`/products/related-products/${id}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching related products for product ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const getDistributorProducts = async () => {
  try {
    const response = await api.get('/products/distributor-products');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching distributor products:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// BLOG POSTS
export const getBlogPosts = async ({ page = 1, limit = 10, category, tag, published } = {}) => {
  try {
    const response = await api.get('/blog-posts', {
      params: { page, limit, category, tag, published },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching blog posts:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const getBlogPost = async (slug) => {
  try {
    const response = await api.get(`/blog-posts/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getRelatedPosts = async (slug) => {
  try {
    const response = await api.get(`/blog-posts/related-posts/${slug}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching related posts for slug ${slug}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const createBlogPost = async (formData) => {
  try {
    const response = await api.post('/blog-posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateBlogPost = async (slug, formData) => {
  try {
    const response = await api.put(`/blog-posts/${slug}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating blog post with slug ${slug}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteBlogPost = async (slug) => {
  try {
    const response = await api.delete(`/blog-posts/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog post with slug ${slug}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// AUTH
export const login = async (data) => {
  try {
    console.log("Logging in user:", data);
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const register = async (data) => {
  try {
    console.log("Registering user:", data);
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for user ID ${userId}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const response = await api.put(`/user/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user profile for user ID ${userId}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.error || 'Failed to update profile');
  }
};

// ORDERS
export const getOrders = async () => {
  try {
    const response = await api.get('/order');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching orders:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/order/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createPaypalOrder = async (userId, orderData) => {
  try {
    const response = await api.post('/order/create', { userId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error creating PayPal order:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const capturePaypalOrder = async (token, payerId) => {
  try {
    const response = await api.get('/order/capture', { params: { token, PayerID: payerId } });
    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal order:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const completeOrder = async (userId, paypalOrderId, paymentId, orderData) => {
  try {
    const response = await api.post('/order/complete', { userId, paypalOrderId, paymentId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error completing order:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// PROMO CODES
export const createPromoCode = async (promoData) => {
  try {
    const response = await api.post('/promo', promoData);
    return response.data;
  } catch (error) {
    console.error('Error creating promo code:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getPromoCodes = async () => {
  try {
    const response = await api.get('/promo');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching promo codes:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const updatePromoCode = async (id, promoData) => {
  try {
    const response = await api.put(`/promo/${id}`, promoData);
    return response.data;
  } catch (error) {
    console.error('Error updating promo code:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const applyPromoCode = async (code, subtotal) => {
  try {
    const response = await api.post('/promo/apply', { code, subtotal });
    return response.data;
  } catch (error) {
    console.error('Error applying promo code:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// SETTINGS
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateSetting = async (key, value) => {
  try {
    const response = await api.post('/settings', { key, value });
    return response.data;
  } catch (error) {
    console.error('Error updating setting:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// DEPRECATED
export const createOrder = async (userId, orderData) => {
  try {
    const response = await api.post('/checkout', { userId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// QUOTES
export const submitQuote = async (data) => {
  try {
    const response = await api.post('/products/quote', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getQuotes = async () => {
  try {
    const response = await api.get('/products/quotes');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching quotes:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const updateQuoteStatus = async (id, status) => {
  try {
    const response = await api.put(`/products/quotes/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating quote status with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const sendQuoteReply = async (id, replyMessage) => {
  try {
    const response = await api.post(`/products/quotes/${id}/reply`, { replyMessage });
    return response.data;
  } catch (error) {
    console.error(`Error sending reply for quote with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const response = await api.delete(`/products/quotes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting quote with ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// CONTACT
export const submitContact = async (data) => {
  try {
    const response = await api.post('/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// CHAT
export const submitChat = async (data) => {
  try {
    console.log("Submitting chat message:", data);
    const response = await api.post('/chat', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting chat:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// ANALYTICS
export const getAnalyticsData = async () => {
  try {
    const response = await api.get('/analytics/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// LEADS
export const getLeads = async () => {
  try {
    const response = await api.get('/leads');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching leads:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/leads/users');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching users:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const updateLeadStatus = async (id, status) => {
  try {
    const response = await api.put(`/leads/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating lead status for ID ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// SUBSCRIBERS
export const submitSubscriber = async (data) => {
  try {
    const response = await api.post('/subscribers', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting subscriber:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getSubscribers = async () => {
  try {
    const response = await api.get('/subscribers');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching subscribers:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

// Export the api instance
export { api };