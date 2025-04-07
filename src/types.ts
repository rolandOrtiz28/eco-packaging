
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  bulkPrice: number;
  moq: number;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: number;
  image: string;
  categories: string[];
  tags: string[];
}

export interface QuoteRequest {
  name: string;
  email: string;
  company: string;
  products: string;
  quantity: number;
  message: string;
  phone?: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ChatRequest {
  name: string;
  email: string;
  message: string;
  requestHuman?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AnalyticsData {
  totalVisits: number;
  visitsByPage: {
    name: string;
    visits: number;
  }[];
  visitsByTime: {
    name: string;
    visits: number;
  }[];
  conversionRate: number;
  leadsCount: number;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  source: string;
  date: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
}
