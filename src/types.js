export const Product = {
  id: Number,
  name: String,
  description: String,
  price: Number,
  bulkPrice: Number,
  moq: Number,
  image: String,
  category: String,
  tags: Array,
  featured: Boolean
};

export const CartItem = {
  ...Product,
  quantity: Number
};

export const BlogPost = {
  id: Number,
  title: String,
  excerpt: String,
  content: String,
  date: String,
  author: String,
  readTime: Number,
  image: String,
  categories: Array,
  tags: Array
};

export const QuoteRequest = {
  name: String,
  email: String,
  company: String,
  products: String,
  quantity: Number,
  message: String,
  phone: String // optional
};

export const ContactRequest = {
  name: String,
  email: String,
  subject: String,
  message: String,
  phone: String // optional
};

export const ChatRequest = {
  name: String,
  email: String,
  message: String,
  requestHuman: Boolean // optional
};

export const User = {
  id: Number,
  name: String,
  email: String,
  role: ['user', 'admin']
};

export const LoginData = {
  email: String,
  password: String
};

export const RegisterData = {
  name: String,
  email: String,
  password: String
};

export const AnalyticsData = {
  totalVisits: Number,
  visitsByPage: [{
    name: String,
    visits: Number
  }],
  visitsByTime: [{
    name: String,
    visits: Number
  }],
  conversionRate: Number,
  leadsCount: Number
};

export const Lead = {
  id: Number,
  name: String,
  email: String,
  source: String,
  date: String,
  status: ['New', 'Contacted', 'Qualified', 'Converted']
};