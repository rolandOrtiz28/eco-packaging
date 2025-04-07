import { Product, BlogPost, QuoteRequest, ContactRequest, ChatRequest, User, LoginData, RegisterData, AnalyticsData, Lead } from "@/types";

// Placeholder products data
const productsData: Product[] = [
  {
    id: 1,
    name: "Eco-Friendly Tote Bag",
    description: "Durable and stylish non-woven tote bag, perfect for shopping and everyday use. Made from recycled materials.",
    price: 12.99,
    bulkPrice: 8.50,
    moq: 500,
    image: "https://images.unsplash.com/photo-1593443601238-67e54a7db53f?auto=format&fit=crop&w=800&q=80",
    category: "Tote Bags",
    tags: ["tote", "eco-friendly", "shopping"],
    featured: true
  },
  {
    id: 2,
    name: "Reusable Grocery Bag",
    description: "Heavy-duty grocery bag that can hold up to 20 pounds. Foldable design for easy storage.",
    price: 9.99,
    bulkPrice: 6.75,
    moq: 1000,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Grocery Bags",
    tags: ["grocery", "reusable", "heavy-duty"],
    featured: true
  },
  {
    id: 3,
    name: "Custom Print Gift Bag",
    description: "Elegant gift bag with customizable printing options. Available in multiple sizes and colors.",
    price: 14.99,
    bulkPrice: 9.25,
    moq: 500,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
    category: "Gift Bags",
    tags: ["gift", "custom", "print"],
    featured: true
  },
  {
    id: 4,
    name: "Biodegradable Shopping Bag",
    description: "Fully biodegradable shopping bag that decomposes within 6 months. Strong and water-resistant.",
    price: 11.99,
    bulkPrice: 7.50,
    moq: 750,
    image: "https://images.unsplash.com/photo-1602830364173-fdfb9f43402b?auto=format&fit=crop&w=800&q=80",
    category: "Shopping Bags",
    tags: ["biodegradable", "shopping", "water-resistant"],
    featured: true
  },
  {
    id: 5,
    name: "Promotional Drawstring Bag",
    description: "Lightweight drawstring bag perfect for promotions and events. Large imprint area for logos.",
    price: 8.99,
    bulkPrice: 5.25,
    moq: 1000,
    image: "https://images.unsplash.com/photo-1562164141-e839b5f8a0a6?auto=format&fit=crop&w=800&q=80",
    category: "Promotional Bags",
    tags: ["drawstring", "promotional", "lightweight"],
    featured: false
  },
  {
    id: 6,
    name: "Insulated Cooler Bag",
    description: "Keep items hot or cold with this insulated bag. Perfect for food delivery or grocery shopping.",
    price: 19.99,
    bulkPrice: 14.75,
    moq: 500,
    image: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=800&q=80",
    category: "Specialty Bags",
    tags: ["insulated", "cooler", "food"],
    featured: false
  },
  {
    id: 7,
    name: "Wine Bottle Gift Bag",
    description: "Elegant single or double bottle wine bag with reinforced handles. Custom printing available.",
    price: 7.99,
    bulkPrice: 4.50,
    moq: 750,
    image: "https://images.unsplash.com/photo-1542456870-7c27d91a7631?auto=format&fit=crop&w=800&q=80",
    category: "Gift Bags",
    tags: ["wine", "gift", "bottle"],
    featured: false
  },
  {
    id: 8,
    name: "Recycled Paper Shopping Bag",
    description: "Premium recycled paper shopping bag with twisted paper handles. Available in multiple sizes.",
    price: 6.99,
    bulkPrice: 3.75,
    moq: 1000,
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?auto=format&fit=crop&w=800&q=80",
    category: "Shopping Bags",
    tags: ["paper", "recycled", "shopping"],
    featured: false
  }
];

// Placeholder blog posts data
const blogPostsData: BlogPost[] = [
  {
    id: 1,
    title: "The Environmental Impact of Sustainable Packaging",
    excerpt: "Discover how eco-friendly packaging solutions can significantly reduce your business's carbon footprint and contribute to a healthier planet.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2025-03-15",
    author: "Emma Rodriguez",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    categories: ["Sustainability", "Business"],
    tags: ["eco-friendly", "carbon-footprint", "sustainability"]
  },
  {
    id: 2,
    title: "How to Choose the Right Packaging for Your Business",
    excerpt: "A comprehensive guide to selecting packaging solutions that align with your brand values and meet customer expectations.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2025-03-02",
    author: "Michael Chen",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    categories: ["Business", "Guides"],
    tags: ["packaging", "branding", "business"]
  },
  {
    id: 3,
    title: "The Rise of Non-Woven Bags in Retail",
    excerpt: "Exploring the growing popularity of non-woven bags and their benefits for retailers and consumers alike.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2025-02-18",
    author: "Sarah Johnson",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    categories: ["Trends", "Retail"],
    tags: ["non-woven", "retail", "trends"]
  },
  {
    id: 4,
    title: "5 Ways Custom Packaging Enhances Brand Recognition",
    excerpt: "Learn how personalized packaging can significantly boost your brand visibility and create a memorable customer experience.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2025-02-05",
    author: "James Wilson",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
    categories: ["Marketing", "Branding"],
    tags: ["custom", "branding", "recognition"]
  },
  {
    id: 5,
    title: "Navigating Packaging Regulations for International Markets",
    excerpt: "A guide to understanding and complying with packaging regulations when expanding your business globally.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "2025-01-20",
    author: "Olivia Martinez",
    readTime: 9,
    image: "https://images.unsplash.com/photo-1555252322-ec8b2b2b8456?auto=format&fit=crop&w=800&q=80",
    categories: ["International", "Compliance"],
    tags: ["regulations", "international", "compliance"]
  }
];

// Mock users data for authentication
const usersData: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: 2,
    name: "Regular User",
    email: "user@example.com",
    role: "user"
  }
];

// API functions

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return productsData;
};

// Get a single product by ID
export const getProduct = async (id: number): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const product = productsData.find(p => p.id === id);
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  return product;
};

// Get related products (excludes the current product)
export const getRelatedProducts = async (id: number): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const currentProduct = productsData.find(p => p.id === id);
  if (!currentProduct) {
    return [];
  }
  
  // Find products in the same category, excluding the current one
  return productsData
    .filter(p => p.id !== id && p.category === currentProduct.category)
    .slice(0, 4);
};

// Get products for distributors (all products, but could filter for bulk-only in a real API)
export const getDistributorProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return productsData;
};

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return blogPostsData;
};

// Get a single blog post by ID
export const getBlogPost = async (id: number): Promise<BlogPost> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const post = blogPostsData.find(p => p.id === id);
  if (!post) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  return post;
};

// Get related blog posts
export const getRelatedPosts = async (id: number): Promise<BlogPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const currentPost = blogPostsData.find(p => p.id === id);
  if (!currentPost) {
    return [];
  }
  
  // Find posts with at least one matching category
  return blogPostsData
    .filter(p => p.id !== id && p.categories.some(cat => currentPost.categories.includes(cat)))
    .slice(0, 3);
};

// Auth API functions
export const login = async (data: LoginData): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would validate credentials against a backend
  const user = usersData.find(u => u.email === data.email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // For demo purposes, any password works
  return user;
};

export const register = async (data: RegisterData): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if user already exists
  const existingUser = usersData.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  // Create new user (in a real app, this would be sent to a backend)
  const newUser: User = {
    id: usersData.length + 1,
    name: data.name,
    email: data.email,
    role: "user" // New users are regular users by default
  };
  
  // In a real app, this would be saved to a database
  usersData.push(newUser);
  
  return newUser;
};

// Analytics API functions
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock analytics data
  return {
    totalVisits: 10842,
    visitsByPage: [
      { name: "Home", visits: 4300 },
      { name: "Shop", visits: 3200 },
      { name: "Bulk Orders", visits: 2100 },
      { name: "Blog", visits: 1800 },
      { name: "Contact", visits: 1400 }
    ],
    visitsByTime: [
      { name: "Mon", visits: 800 },
      { name: "Tue", visits: 1200 },
      { name: "Wed", visits: 1400 },
      { name: "Thu", visits: 1100 },
      { name: "Fri", visits: 900 },
      { name: "Sat", visits: 600 },
      { name: "Sun", visits: 500 }
    ],
    conversionRate: 3.8,
    leadsCount: 324
  };
};

// Get captured leads
export const getLeads = async (): Promise<Lead[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock leads data
  return [
    { id: 1, name: "John Smith", email: "john@example.com", source: "Contact Form", date: "2025-04-01", status: "New" },
    { id: 2, name: "Emily Johnson", email: "emily@example.com", source: "Quote Request", date: "2025-03-29", status: "Contacted" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", source: "Chat Widget", date: "2025-03-28", status: "Qualified" },
    { id: 4, name: "Sarah Davis", email: "sarah@example.com", source: "Contact Form", date: "2025-03-27", status: "New" },
    { id: 5, name: "David Wilson", email: "david@example.com", source: "Quote Request", date: "2025-03-26", status: "Contacted" },
    { id: 6, name: "Jessica Taylor", email: "jessica@example.com", source: "Chat Widget", date: "2025-03-25", status: "Converted" },
    { id: 7, name: "Robert Martinez", email: "robert@example.com", source: "Contact Form", date: "2025-03-24", status: "Qualified" },
    { id: 8, name: "Jennifer Anderson", email: "jennifer@example.com", source: "Quote Request", date: "2025-03-23", status: "New" },
    { id: 9, name: "Thomas Moore", email: "thomas@example.com", source: "Chat Widget", date: "2025-03-22", status: "Contacted" },
    { id: 10, name: "Lisa Jackson", email: "lisa@example.com", source: "Contact Form", date: "2025-03-21", status: "Converted" }
  ];
};

// Submit a quote request
export const submitQuote = async (data: QuoteRequest): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log("Quote request submitted:", data);
  return;
};

// Submit a contact form
export const submitContact = async (data: ContactRequest): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Contact form submitted:", data);
  return;
};

// Submit a chat message
export const submitChat = async (data: ChatRequest): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Chat message submitted:", data);
  return;
};
