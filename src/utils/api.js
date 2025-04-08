import { Product, BlogPost, QuoteRequest, ContactRequest, ChatRequest, User, LoginData, RegisterData, AnalyticsData, Lead } from "@/types";

const productsData = [
  {
    id: 1,
    name: "Wine Vest Bag (1/2 Two Bottle Wine Bag)",
    description: "A premium non-woven bag designed for carrying one or two wine bottles. Ideal for wine and liquor stores.",
    price: 0.10, // $100/case for 1000 pcs → $0.10/unit (1–5 cases)
    bulkPrice: 0.09, // $90/case for 1000 pcs → $0.09/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 1000,
    image: "https://images.unsplash.com/photo-1542456870-7c27d91a7631?auto=format&fit=crop&w=800&q=80",
    category: "Wine Bags",
    tags: ["wine", "vest", "non-woven"],
    featured: true,
    details: {
      size: "19.5H x 8W x 4GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (1000pcs)", pricePerUnit: 0.10 },
        { case: "6 to 50 (1000pcs)", pricePerUnit: 0.09 },
        { case: "50+ (1000pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Wine & Liquor Bags",
    },
  },
  {
    id: 2,
    name: "Small Vest Bag (1/10 Small)",
    description: "A small non-woven vest bag, perfect for beer, snacks, and deli items.",
    price: 0.10, // $100/case for 1000 pcs → $0.10/unit (1–5 cases)
    bulkPrice: 0.09, // $90/case for 1000 pcs → $0.09/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 1000,
    image: "https://images.unsplash.com/photo-1593443601238-67e54a7db53f?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["small", "vest", "non-woven"],
    featured: true,
    details: {
      size: "16H x 8W x 4GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (1000pcs)", pricePerUnit: 0.10 },
        { case: "6 to 50 (1000pcs)", pricePerUnit: 0.09 },
        { case: "50+ (1000pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Beer, Snacks, Deli",
    },
  },
  {
    id: 3,
    name: "Medium Vest Bag (1/8 Medium)",
    description: "A medium-sized non-woven vest bag, suitable for deli and supermarket use.",
    price: 0.11, // $110/case for 1000 pcs → $0.11/unit (1–5 cases)
    bulkPrice: 0.09, // $90/case for 1000 pcs → $0.09/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 1000,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["medium", "vest", "non-woven"],
    featured: true,
    details: {
      size: "18H x 10W x 5GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (1000pcs)", pricePerUnit: 0.11 },
        { case: "6 to 50 (1000pcs)", pricePerUnit: 0.09 },
        { case: "50+ (1000pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Fit 6 pack perfectly, Deli, Liquor Store",
    },
  },
  {
    id: 4,
    name: "Large Vest Bag (1/6 Medium Duty)",
    description: "A large non-woven vest bag, ideal for deli and supermarket use.",
    price: 0.12, // $72/case for 600 pcs → $0.12/unit (1–5 cases)
    bulkPrice: 0.10, // $60/case for 600 pcs → $0.10/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 600,
    image: "https://images.unsplash.com/photo-1602830364173-fdfb9f43402b?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["large", "vest", "non-woven"],
    featured: true,
    details: {
      size: "22H x 11.8W x 7GW inches",
      color: "Black/White/Green/Yellow",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (600pcs)", pricePerUnit: 0.12 },
        { case: "6 to 50 (600pcs)", pricePerUnit: 0.10 },
        { case: "50+ (600pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Deli & Supermarkets",
    },
  },
  {
    id: 5,
    name: "Large+ Vest Bag (1/6 Plus, A Bit Larger)",
    description: "A slightly larger non-woven vest bag, perfect for mini marts and supermarkets.",
    price: 0.13, // $65/case for 500 pcs → $0.13/unit (1–5 cases)
    bulkPrice: 0.11, // $55/case for 500 pcs → $0.11/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 500,
    image: "https://images.unsplash.com/photo-1602830364173-fdfb9f43402b?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["large", "vest", "non-woven"],
    featured: false,
    details: {
      size: "22.5H x 13W x 7GW inches",
      color: "Black/White",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (500pcs)", pricePerUnit: 0.13 },
        { case: "6 to 50 (500pcs)", pricePerUnit: 0.11 },
        { case: "50+ (500pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Mini Mart, Supermarkets",
    },
  },
  {
    id: 6,
    name: "2X-Large Vest Bag (1/4 XX-Large)",
    description: "An extra-large non-woven vest bag, suitable for supermarkets and 99 cent stores.",
    price: 0.20, // $80/case for 400 pcs → $0.20/unit (1–5 cases)
    bulkPrice: 0.18, // $72/case for 400 pcs → $0.18/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 400,
    image: "https://images.unsplash.com/photo-1602830364173-fdfb9f43402b?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["xx-large", "vest", "non-woven"],
    featured: false,
    details: {
      size: "23.5H x 18.7W x 7GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (400pcs)", pricePerUnit: 0.20 },
        { case: "6 to 50 (400pcs)", pricePerUnit: 0.18 },
        { case: "50+ (400pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Supermarkets, 99 Cent Stores",
    },
  },
  {
    id: 7,
    name: "Jumbo Size (Supersized Jumbo)",
    description: "A jumbo-sized non-woven bag, perfect for wholesalers.",
    price: 0.21, // $315/bundle for 1500 pcs → $0.21/unit (1–5 bundles)
    bulkPrice: 0.19, // $285/bundle for 1500 pcs → $0.19/unit (5+ bundles)
    moq: 50,
    pcsPerCase: 1500,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Tote Bags",
    tags: ["jumbo", "non-woven"],
    featured: false,
    details: {
      size: "29H x 18W x 7GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (1500pcs)", pricePerUnit: 0.21 },
        { case: "6 to 50 (1500pcs)", pricePerUnit: 0.19 },
        { case: "50+ (1500pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "99 Cent Store, Wholesaler, Supermarket",
    },
  },
  {
    id: 8,
    name: "Heavy Duty Large Vest Bag (1/6 Large)",
    description: "A heavy-duty non-woven vest bag, designed to support up to 50 lbs, ideal for heavy products.",
    price: 0.16, // $80/case for 500 pcs → $0.16/unit (1–5 cases)
    bulkPrice: 0.135, // $67.5/case for 500 pcs → $0.135/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 500,
    image: "https://images.unsplash.com/photo-1602830364173-fdfb9f43402b?auto=format&fit=crop&w=800&q=80",
    category: "Vest Bags",
    tags: ["heavy-duty", "vest", "non-woven"],
    featured: false,
    details: {
      size: "22H x 11.8W x 7D inches",
      color: "White",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (500pcs)", pricePerUnit: 0.16 },
        { case: "6 to 50 (500pcs)", pricePerUnit: 0.135 },
        { case: "50+ (500pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Heavy duty, supports 50 lbs",
    },
  },
  {
    id: 9,
    name: "Die Cut Handle Bag",
    description: "A non-woven bag with die-cut handles, suitable for book stores, game stores, and medical offices.",
    price: 0.11, // $110/case for 1000 pcs → $0.11/unit (1–5 cases)
    bulkPrice: 0.10, // $100/case for 1000 pcs → $0.10/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 1000,
    image: "https://images.unsplash.com/photo-1593443601238-67e54a7db53f?auto=format&fit=crop&w=800&q=80",
    category: "Specialty Bags",
    tags: ["die-cut", "non-woven"],
    featured: true,
    details: {
      size: "15H x 11W inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (1000pcs)", pricePerUnit: 0.11 },
        { case: "6 to 50 (1000pcs)", pricePerUnit: 0.10 },
        { case: "50+ (1000pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Book Store, Game Shops",
    },
  },
  {
    id: 10,
    name: "2 Bottle Wine Tote Bag",
    description: "A non-woven tote bag designed to carry two wine bottles, perfect for liquor stores.",
    price: 0.18, // $72/case for 400 pcs → $0.18/unit (1–5 cases)
    bulkPrice: 0.17, // $68/case for 400 pcs → $0.17/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 400,
    image: "https://images.unsplash.com/photo-1542456870-7c27d91a7631?auto=format&fit=crop&w=800&q=80",
    category: "Wine Bags",
    tags: ["wine", "tote", "non-woven"],
    featured: false,
    details: {
      size: "14H x 8W x 4D inches",
      color: "Grey",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (400pcs)", pricePerUnit: 0.18 },
        { case: "6 to 50 (400pcs)", pricePerUnit: 0.17 },
        { case: "50+ (400pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Liquor Stores",
    },
  },
  {
    id: 11,
    name: "Large 1/6 Tote Bag",
    description: "A large non-woven tote bag, ideal for grocery stores, delis, and retail.",
    price: 0.22, // $66/case for 300 pcs → $0.22/unit (1–5 cases)
    bulkPrice: 0.20, // $60/case for 300 pcs → $0.20/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 300,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Tote Bags",
    tags: ["large", "tote", "non-woven"],
    featured: false,
    details: {
      size: "14H x 11.5W x 7D inches",
      color: "Grey",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (300pcs)", pricePerUnit: 0.22 },
        { case: "6 to 50 (300pcs)", pricePerUnit: 0.20 },
        { case: "50+ (300pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Grocery/Deli",
    },
  },
  {
    id: 12,
    name: "Jumbo Grocery Tote Bag",
    description: "A jumbo non-woven tote bag, perfect for everyday grocery shopping.",
    price: 0.25, // $75/case for 300 pcs → $0.25/unit (1–5 cases)
    bulkPrice: 0.23, // $69/case for 300 pcs → $0.23/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 300,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Tote Bags",
    tags: ["jumbo", "tote", "non-woven"],
    featured: false,
    details: {
      size: "15H x 14W x 8GW inches",
      color: "Black",
      material: "Premium Non Woven",
      pricing: [
        { case: "1 to 5 (300pcs)", pricePerUnit: 0.25 },
        { case: "6 to 50 (300pcs)", pricePerUnit: 0.23 },
        { case: "50+ (300pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Retail/Supermarket",
    },
  },
  {
    id: 13,
    name: "Thermal Insulated Tote Bag",
    description: "A thermal insulated non-woven tote bag, ideal for lunch carriers and delivery.",
    price: 3.50, // $350/case for 100 pcs → $3.50/unit (1–5 cases)
    bulkPrice: 3.00, // $300/case for 100 pcs → $3.00/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 100,
    image: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=800&q=80",
    category: "Specialty Bags",
    tags: ["thermal", "tote", "non-woven"],
    featured: false,
    details: {
      size: "15H x 13W x 10D inches",
      color: "Black/White/Green/Yellow",
      material: "Premium Non Woven",
      note: "Patented smart fabric multi layered and coated thermal film bag",
      pricing: [
        { case: "1 to 5 (100pcs)", pricePerUnit: 3.50 },
        { case: "6 to 50 (100pcs)", pricePerUnit: 3.00 },
        { case: "50+ (100pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Lunch, Delivery, Groceries",
    },
  },
  {
    id: 14,
    name: "Heavy Duty Grocery Tote Bag",
    description: "A heavy-duty reusable non-woven tote bag, perfect for everyday grocery shopping.",
    price: 2.50, // $250/case for 100 pcs → $2.50/unit (1–5 cases)
    bulkPrice: 2.00, // $200/case for 100 pcs → $2.00/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 100,
    image: "https://images.unsplash.com/photo-1572163064776-36c7d5bb7a3b?auto=format&fit=crop&w=800&q=80",
    category: "Tote Bags",
    tags: ["heavy-duty", "tote", "non-woven"],
    featured: false,
    details: {
      size: "15H x 13W x 10D inches",
      color: "Black",
      material: "Premium Non Woven",
      note: "PVC board on bottom, hand stitched",
      pricing: [
        { case: "1 to 5 (100pcs)", pricePerUnit: 2.50 },
        { case: "6 to 50 (100pcs)", pricePerUnit: 2.00 },
        { case: "50+ (100pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Everyday shopping bag",
    },
  },
  {
    id: 15,
    name: "6 Bottle Wine Bag",
    description: "A non-woven bag designed to carry six wine bottles, ideal for liquor stores.",
    price: 2.00, // $200/case for 100 pcs → $2.00/unit (1 case)
    bulkPrice: 2.00, // No 6–50 cases pricing, so use the same as 1 case
    moq: 50,
    pcsPerCase: 100,
    image: "https://images.unsplash.com/photo-1542456870-7c27d91a7631?auto=format&fit=crop&w=800&q=80",
    category: "Wine Bags",
    tags: ["wine", "non-woven"],
    featured: false,
    details: {
      size: "15H x 11W x 8.5GW inches",
      color: "Black/Red Burgundy",
      material: "Premium Non Woven",
      note: "6 bottle carrier with separator and PVC board, Hand Stitched",
      pricing: [
        { case: "1 (100pcs)", pricePerUnit: 2.00 },
        { case: "50+ (100pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Liquor Store",
    },
  },
  {
    id: 16,
    name: "Mylar Film Gift Bag",
    description: "A mylar film gift bag with ribbon, perfect for gifting.",
    price: 0.60, // $3000/case for 500 pcs → $6.00/unit (1–5 cases)
    bulkPrice: 0.50, // $2500/case for 500 pcs → $5.00/unit (6–50 cases)
    moq: 50,
    pcsPerCase: 5000,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
    category: "Gift Bags",
    tags: ["mylar", "gift", "non-woven"],
    featured: false,
    details: {
      size: "20H x 9.5W inches",
      color: "White Flash",
      material: "PVC Film",
      note: "Ribbon not included",
      pricing: [
        { case: "1 to 5 (5000pcs)", pricePerUnit: 0.60 },
        { case: "6 to 50 (5000pcs)", pricePerUnit: 0.50 },
        { case: "50+ (5000pcs)", pricePerUnit: "Contact office" },
      ],
      useCase: "Wine Gift Bag",
    },
  },
];

const blogPostsData = [
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

// Simulated order data for the regular user
// Simulated order data storage (replace static userOrders)
let userOrders = {
  2: [], // Start with an empty array for user ID 2 (Regular User)
};



// Simulated user data with additional fields
const usersData = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    phone: "+1 (555) 123-4567",
    address: "123 Admin St",
    city: "Admin City",
    state: "CA",
    zipCode: "90001",
    country: "US"
  },
  {
    id: 2,
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    phone: "+1 (555) 987-6543",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  }
];

// Function to update user profile
export const updateUserProfile = async (userId, updatedData) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  const userIndex = usersData.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error(`User with ID ${userId} not found`);
  }

  usersData[userIndex] = {
    ...usersData[userIndex],
    ...updatedData
  };

  console.log(`Updated user profile for user ${userId}:`, usersData[userIndex]);
  return usersData[userIndex];
};

// Function to create a new order
export const createOrder = async (userId, orderData) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  // Generate a unique order ID (e.g., ECO-XXXX)
  const orderId = `ECO-${String(Object.keys(userOrders).length + 1).padStart(4, '0')}`;
  
  const newOrder = {
    id: orderId,
    date: new Date().toISOString().split('T')[0], // Current date (e.g., 2025-04-08)
    status: "Processing", // Default status
    items: orderData.items,
    total: orderData.total,
  };

  if (!userOrders[userId]) {
    userOrders[userId] = [];
  }
  userOrders[userId].push(newOrder);

  console.log(`Order created for user ${userId}:`, newOrder);
  return newOrder;
};

export const getProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return productsData;
};

export const getProduct = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const product = productsData.find(p => p.id === id);
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  return product;
};

export const getRelatedProducts = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const currentProduct = productsData.find(p => p.id === id);
  if (!currentProduct) {
    return [];
  }
  
  return productsData
    .filter(p => p.id !== id && p.category === currentProduct.category)
    .slice(0, 4);
};

export const getDistributorProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return productsData;
};

export const getBlogPosts = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return blogPostsData;
};

export const getBlogPost = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const post = blogPostsData.find(p => p.id === id);
  if (!post) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  return post;
};

export const getRelatedPosts = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const currentPost = blogPostsData.find(p => p.id === id);
  if (!currentPost) {
    return [];
  }
  
  return blogPostsData
    .filter(p => p.id !== id && p.categories.some(cat => currentPost.categories.includes(cat)))
    .slice(0, 3);
};

export const login = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = usersData.find(u => u.email === data.email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  return user;
};

export const register = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const existingUser = usersData.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  const newUser = {
    id: usersData.length + 1,
    name: data.name,
    email: data.email,
    role: "user"
  };
  
  usersData.push(newUser);
  
  return newUser;
};

// New function to fetch user profile data, including orders
export const getUserProfile = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = usersData.find(u => u.id === userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const userWithOrders = {
    ...user,
    orders: userOrders[userId] || [],
  };
  console.log("Returning user profile:", userWithOrders);
  return userWithOrders;
};

export const getAnalyticsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
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

export const getLeads = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
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

export const submitQuote = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log("Quote request submitted:", data);
  return;
};

export const submitContact = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Contact form submitted:", data);
  return;
};

export const submitChat = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Chat message submitted:", data);
  return;
};