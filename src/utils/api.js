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

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
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
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
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

export const getOrders = async () => {
  try {
    const response = await api.get('/order');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status with ID ${id}:`, error);
    throw error;
  }
};

export const createPaypalOrder = async (userId, orderData) => {
  try {
    const response = await api.post('/order/create', { userId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

export const capturePaypalOrder = async (token, payerId) => {
  try {
    const response = await api.get('/order/capture', { params: { token, PayerID: payerId } });
    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
};

export const completeOrder = async (userId, paypalOrderId, paymentId, orderData) => {
  try {
    const response = await api.post('/order/complete', { userId, paypalOrderId, paymentId, ...orderData });
    return response.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

// Promo Code Functions
export const createPromoCode = async (promoData) => {
  try {
    const response = await api.post('/promo', promoData);
    return response.data;
  } catch (error) {
    console.error('Error creating promo code:', error);
    throw error;
  }
};

export const getPromoCodes = async () => {
  try {
    const response = await api.get('/promo');
    return response.data;
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    throw error;
  }
};

export const updatePromoCode = async (id, promoData) => {
  try {
    const response = await api.put(`/promo/${id}`, promoData);
    return response.data;
  } catch (error) {
    console.error('Error updating promo code:', error);
    throw error;
  }
};

export const applyPromoCode = async (code, subtotal) => {
  try {
    const response = await api.post('/promo/apply', { code, subtotal });
    return response.data;
  } catch (error) {
    console.error('Error applying promo code:', error);
    throw error;
  }
};

// Settings Functions
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSetting = async (key, value) => {
  try {
    const response = await api.post('/settings', { key, value });
    return response.data;
  } catch (error) {
    console.error('Error updating setting:', error);
    throw error;
  }
};

// Deprecated: Remove or keep as legacy if needed
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

export const getQuotes = async () => {
  try {
    const response = await api.get('/quotes');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const updateQuoteStatus = async (id, status) => {
  try {
    const response = await api.put(`/quotes/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating quote status with ID ${id}:`, error);
    throw error;
  }
};

export const sendQuoteReply = async (id, replyMessage) => {
  try {
    const response = await api.post(`/quotes/${id}/reply`, { replyMessage });
    return response.data;
  } catch (error) {
    console.error(`Error sending reply for quote with ID ${id}:`, error);
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const response = await api.delete(`/quotes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting quote with ID ${id}:`, error);
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

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const submitSubscriber = async (data) => {
  try {
    const response = await api.post('/subscribers', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting subscriber:', error);
    throw error;
  }
};

export const getSubscribers = async () => {
  try {
    const response = await api.get('/subscribers');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }
};

// Export the api instance for use in useAuth
export { api };