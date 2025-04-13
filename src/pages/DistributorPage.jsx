import { useState, useEffect, useRef } from "react";
import { CheckCircle, Building2, Users, PackageCheck, Leaf, ArrowRight, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import QuoteFormModal from "@/components/QuoteFormModal";
import CustomProductSeriesCard from "@/components/CustomProductSeriesCard";
import { getDistributorProducts } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DistributorPage = () => {
  const [products, setProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const headerRef = useRef(null);
  const businessRef = useRef(null);
  const processRef = useRef(null);
  const catalogHeaderRef = useRef(null);
  const catalogSearchRef = useRef(null);
  const productsRef = useRef(null);
  const customProductsRef = useRef(null);
  const sustainabilityRef = useRef(null);

  // Track animation states
  const hasAnimated = useRef({
    header: false,
    business: false,
    process: false,
    catalogHeader: false,
    catalogSearch: false,
    products: false,
    customProducts: false,
    sustainability: false,
  });

  // Unified filter state
  const [filters, setFilters] = useState({
    searchQuery: "",
    sortBy: "featured",
    priceRange: [0, 10],
    material: [],
    moqRange: [1, 1000],
    usage: [],
    others: [],
    categories: [],
  });

  // Custom products data with added fields
  const customProductsData = [
    {
      id: "jute-bag-series",
      name: "Jute Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744477756/bagstoryCustom/Screenshot_63_h9ru0x.png",
      description: "Eco-friendly, durable bags made from natural jute fibers.",
      category: "Customization",
      bulkPrice: 2.5,
      pcsPerCase: 100,
      moq: 500,
      material: "Jute",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "nylon-foldable-series",
      name: "Nylon Foldable Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476136/bagstoryCustom/Screenshot_64_eysfhe.png",
      description: "Lightweight, compact bags that fold into a small pouch.",
      category: "Customization",
      bulkPrice: 1.8,
      pcsPerCase: 200,
      moq: 1000,
      material: "Nylon",
      usage: "Travel",
      isEcoFriendly: false,
      isBestSeller: true,
      type: "custom",
    },
    {
      id: "cooler-bag-series",
      name: "Cooler Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744478046/bagstoryCustom/Screenshot_65_cfpl0d.png",
      description: "Keeps your food and drinks fresh with insulated linings.",
      category: "Customization",
      bulkPrice: 5.0,
      pcsPerCase: 50,
      moq: 300,
      material: "Nylon",
      usage: "Cooler",
      isEcoFriendly: false,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "wine-bag-series",
      name: "Wine Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_5_wdzliu.png",
      description: "Crafted to safely transport your favorite bottles.",
      category: "Customization",
      bulkPrice: 3.0,
      pcsPerCase: 80,
      moq: 400,
      material: "Canvas",
      usage: "Wine",
      isEcoFriendly: true,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "backpack-series",
      name: "Backpack Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_6_pvzetl.png",
      description: "Spacious, ergonomic designs for everyday use.",
      category: "Customization",
      bulkPrice: 10.0,
      pcsPerCase: 20,
      moq: 200,
      material: "Oxford",
      usage: "School/Work",
      isEcoFriendly: false,
      isBestSeller: true,
      type: "custom",
    },
    {
      id: "stitching-bag-series",
      name: "Stitching Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_7_tt8ocb.png",
      description: "Features bags with reinforced stitching for added durability.",
      category: "Customization",
      bulkPrice: 2.0,
      pcsPerCase: 120,
      moq: 600,
      material: "Canvas",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "heat-sealed-bag-series",
      name: "Heat Sealed Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476136/bagstoryCustom/Screenshot_8_gvqgb2.png",
      description: "Seamless, heat-sealed bags for a sleek finish.",
      category: "Customization",
      bulkPrice: 1.5,
      pcsPerCase: 150,
      moq: 800,
      material: "Nylon",
      usage: "Retail",
      isEcoFriendly: false,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "pvc-bag-series",
      name: "PVC Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_9_m9uqoc.png",
      description: "Transparent, waterproof bags made from durable PVC material.",
      category: "Customization",
      bulkPrice: 2.2,
      pcsPerCase: 100,
      moq: 500,
      material: "PVC",
      usage: "Retail",
      isEcoFriendly: false,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "canvas-bag-series",
      name: "Canvas Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_10_cbkiil.png",
      description: "Sturdy canvas material, offering a classic and timeless look.",
      category: "Customization",
      bulkPrice: 4.0,
      pcsPerCase: 60,
      moq: 400,
      material: "Canvas",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: true,
      type: "custom",
    },
    {
      id: "oxford-bag-series",
      name: "Oxford Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_11_x0fb9i.png",
      description: "Combines durability and elegance with Oxford fabric.",
      category: "Customization",
      bulkPrice: 6.0,
      pcsPerCase: 40,
      moq: 300,
      material: "Oxford",
      usage: "School/Work",
      isEcoFriendly: false,
      isBestSeller: false,
      type: "custom",
    },
    {
      id: "woven-bag-series",
      name: "Woven Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_12_l3hp8x.png",
      description: "Intricately woven designs for a unique, artisanal look.",
      category: "Customization",
      bulkPrice: 3.5,
      pcsPerCase: 80,
      moq: 400,
      material: "Woven",
      usage: "Retail",
      isEcoFriendly: true,
      isBestSeller: false,
      type: "custom",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getDistributorProducts();
        // Map distributor products to include required fields
        const bulkData = data.map((product) => {
          const bulkProduct = {
            ...product,
            type: "bulk",
            moq: product.moq || 1,
            material: product.details?.material || "Premium Non Woven",
            usage: product.details?.useCase || "General",
            isEcoFriendly: product.isEcoFriendly || false,
            isBestSeller: product.featured || false,
          };

          // Normalize usage to match filter options
          if (bulkProduct.usage) {
            const usageLower = bulkProduct.usage.toLowerCase();
            if (usageLower.includes("deli") || usageLower.includes("pack")) {
              bulkProduct.usage = "Beer, Snacks, and Deli";
            } else if (usageLower.includes("liquor")) {
              bulkProduct.usage = "Wine & Liquor Bags";
            } else {
              bulkProduct.usage = "General";
            }
          }

          return bulkProduct;
        });

        console.log("Distributor Products:", bulkData); // Debug: Log distributor products

        setProducts(bulkData);
        setCustomProducts(customProductsData);

        // Combine all products for unified filtering
        const allProducts = [...bulkData, ...customProductsData];
        setFilteredProducts(allProducts);

        // Combine categories and ensure "Cup & Trays" is included
        const allCategories = Array.from(
          new Set(allProducts.map((product) => product.category))
        );
        if (!allCategories.includes("Cup & Trays")) {
          allCategories.push("Cup & Trays");
        }
        setCategories(allCategories);

        const maxPrice = Math.max(
          ...allProducts.map((product) =>
            product.type === "bulk" ? product.price : product.bulkPrice
          ),
          10
        );
        setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] }));
      } catch (error) {
        console.error("Error fetching distributor products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products, ...customProducts];

    console.log("Current Filters:", filters); // Debug: Log current filters

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Price filter
    result = result.filter((product) => {
      const price = product.type === "bulk" ? product.price : product.bulkPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Material filter
    if (filters.material.length > 0) {
      result = result.filter((product) =>
        filters.material.some((material) =>
          product.material
            ? product.material.toLowerCase() === material.toLowerCase()
            : false
        )
      );
    }

    // MOQ filter
    result = result.filter(
      (product) =>
        product.moq >= filters.moqRange[0] && product.moq <= filters.moqRange[1]
    );

    // Usage filter
    if (filters.usage.length > 0) {
      result = result.filter((product) =>
        filters.usage.some((usage) =>
          product.usage
            ? product.usage.toLowerCase() === usage.toLowerCase()
            : false
        )
      );
    }

    // Others filter
    if (filters.others.length > 0) {
      result = result.filter((product) =>
        filters.others.some((option) =>
          option === "Eco-Friendly"
            ? product.isEcoFriendly
            : product.isBestSeller
        )
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "priceLow":
        result.sort((a, b) => {
          const priceA = a.type === "bulk" ? a.price : a.bulkPrice;
          const priceB = b.type === "bulk" ? b.price : b.bulkPrice;
          return priceA - priceB;
        });
        break;
      case "priceHigh":
        result.sort((a, b) => {
          const priceA = a.type === "bulk" ? a.price : a.bulkPrice;
          const priceB = b.type === "bulk" ? b.price : b.bulkPrice;
          return priceB - priceA;
        });
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "moqLow":
        result.sort((a, b) => (a.moq || 0) - (b.moq || 0));
        break;
      case "moqHigh":
        result.sort((a, b) => (b.moq || 0) - (a.moq || 0));
        break;
      default:
        break;
    }

    console.log("Filtered Products:", result); // Debug: Log filtered products

    setFilteredProducts(result);
  }, [products, customProducts, filters]);

  useEffect(() => {
    const animateSection = (ref, options, key) => {
      if (ref.current && !hasAnimated.current[key]) {
        gsap.fromTo(
          ref.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: options.stagger || 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none none",
              onEnter: () => (hasAnimated.current[key] = true),
            },
          }
        );
      }
    };

    // Header Animation
    animateSection(headerRef, { stagger: 0.2 }, "header");

    // Business Types Animation
    animateSection(businessRef, { stagger: 0.15 }, "business");

    // Process Animation
    animateSection(processRef, { stagger: 0.15 }, "process");

    // Catalog Header Animation
    animateSection(catalogHeaderRef, { stagger: 0.2 }, "catalogHeader");

    // Catalog Search Animation
    if (catalogSearchRef.current && !hasAnimated.current.catalogSearch) {
      gsap.fromTo(
        catalogSearchRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: catalogSearchRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.catalogSearch = true),
          },
        }
      );
    }

    // Products Animation
    if (!isLoading && filteredProducts.length > 0 && productsRef.current && !hasAnimated.current.products) {
      gsap.fromTo(
        productsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.products = true),
          },
        }
      );
    }

    // Custom Products Animation
    if (!isLoading && filteredProducts.filter((p) => p.type === "custom").length > 0 && customProductsRef.current && !hasAnimated.current.customProducts) {
      gsap.fromTo(
        customProductsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: customProductsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.customProducts = true),
          },
        }
      );
    }

    // Sustainability Animation
    animateSection(sustainabilityRef, { stagger: 0.2 }, "sustainability");

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        headerRef.current,
        businessRef.current,
        processRef.current,
        catalogHeaderRef.current,
        catalogSearchRef.current,
        productsRef.current,
        customProductsRef.current,
        sustainabilityRef.current,
      ]);
    };
  }, [isLoading, filteredProducts]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const toggleFilterOption = (filterName, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterName];
      return {
        ...prev,
        [filterName]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const clearFilters = () => {
    const maxPrice = Math.max(
      ...[...products, ...customProducts].map((product) =>
        product.type === "bulk" ? product.price : product.bulkPrice
      ),
      10
    );
    setFilters({
      searchQuery: "",
      sortBy: "featured",
      priceRange: [0, maxPrice],
      material: [],
      moqRange: [1, 1000],
      usage: [],
      others: [],
      categories: [],
    });
  };

  const handleRequestQuote = (product) => {
    setSelectedProduct(product);
    setShowQuoteModal(true);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <section className="bg-eco py-16">
        <div className="container-custom text-white">
          <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Bulk Packaging Solutions</h1>
              <p className="text-lg opacity-90 mb-6">
                Eco Packaging Products Inc. offers premium wholesale solutions for businesses of all sizes. 
                Our bulk packaging options are sustainable, cost-effective, and customizable to meet your specific needs.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Competitive wholesale pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Custom branding options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Sustainable materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Dedicated account management</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744535099/BagStory/Untitled_design_epux3t.png" 
                alt="Bulk packaging solutions" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Serving Businesses of All Sizes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From small retailers to large corporations, we provide tailored packaging solutions for every business need
            </p>
          </div>
          
          <div ref={businessRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Retail Stores</h3>
              <p className="text-gray-700 mb-4">
                Branded shopping bags and packaging solutions for retail businesses looking to enhance their customer experience.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Organizers</h3>
              <p className="text-gray-700 mb-4">
                Custom promotional bags and event swag packages for conferences, tradeshows, and corporate events.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <PackageCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
              <p className="text-gray-700 mb-4">
                Eco-friendly shipping bags and protective packaging for online retailers and subscription box services.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-eco-paper">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes ordering bulk packaging simple and efficient
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-eco-light"></div>
            
            <div ref={processRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                <p className="text-muted-foreground">
                  Explore our catalog of wholesale products and find the right fit for your business
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Request a Quote</h3>
                <p className="text-muted-foreground">
                  Fill out our simple quote request form with your specific requirements
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Receive Proposal</h3>
                <p className="text-muted-foreground">
                  Our team will prepare a customized quote tailored to your needs
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Place Order</h3>
                <p className="text-muted-foreground">
                  Confirm your order and our team will handle the rest
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-catalog" className="py-12">
        <div className="container-custom">
          <div ref={catalogHeaderRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Product Catalog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wholesale and customizable products and request a quote for your business
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden flex justify-between items-center mb-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                  <SelectItem value="nameAZ">Name: A to Z</SelectItem>
                  <SelectItem value="nameZA">Name: Z to A</SelectItem>
                  <SelectItem value="moqLow">MOQ: Low to High</SelectItem>
                  <SelectItem value="moqHigh">MOQ: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div ref={catalogSearchRef} className={`lg:w-1/4 lg:block ${showFilters ? "block" : "hidden"}`}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      value={filters.searchQuery}
                      onChange={(e) =>
                        handleFilterChange("searchQuery", e.target.value)
                      }
                      placeholder="Search products..."
                      className="pl-10"
                    />
                    {filters.searchQuery && (
                      <button
                        onClick={() => handleFilterChange("searchQuery", "")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 10]}
                      max={
                        Math.max(
                          ...[...products, ...customProducts].map((product) =>
                            product.type === "bulk"
                              ? product.price
                              : product.bulkPrice
                          ),
                          10
                        )
                      }
                      step={0.01}
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        handleFilterChange("priceRange", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${filters.priceRange[0].toFixed(2)}</span>
                      <span>${filters.priceRange[1].toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    MOQ Range
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[1, 1000]}
                      min={1}
                      max={1000}
                      step={1}
                      value={filters.moqRange}
                      onValueChange={(value) =>
                        handleFilterChange("moqRange", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{filters.moqRange[0]}</span>
                      <span>{filters.moqRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Material Type
                  </label>
                  <div className="space-y-2">
                    {[
                      "Jute",
                      "Nylon",
                      "Canvas",
                      "PVC",
                      "Oxford",
                      "Woven",
                      "Premium Non Woven",
                    ].map((material) => (
                      <div key={material} className="flex items-center">
                        <Checkbox
                          id={`material-${material}`}
                          checked={filters.material.includes(material)}
                          onCheckedChange={() =>
                            toggleFilterOption("material", material)
                          }
                        />
                        <label
                          htmlFor={`material-${material}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Usage</label>
                  <div className="space-y-2">
                    {[
                      "Grocery",
                      "Travel",
                      "Cooler",
                      "Wine",
                      "School/Work",
                      "Retail",
                      "Wine & Liquor Bags",
                      "Beer, Snacks, and Deli",
                      "General",
                    ].map((usage) => (
                      <div key={usage} className="flex items-center">
                        <Checkbox
                          id={`usage-${usage}`}
                          checked={filters.usage.includes(usage)}
                          onCheckedChange={() =>
                            toggleFilterOption("usage", usage)
                          }
                        />
                        <label
                          htmlFor={`usage-${usage}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {usage}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Others
                  </label>
                  <div className="space-y-2">
                    {["Eco-Friendly", "Best Seller"].map((option) => (
                      <div key={option} className="flex items-center">
                        <Checkbox
                          id={`others-${option}`}
                          checked={filters.others.includes(option)}
                          onCheckedChange={() =>
                            toggleFilterOption("others", option)
                          }
                        />
                        <label
                          htmlFor={`others-${option}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() =>
                            toggleFilterOption("categories", category)
                          }
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="hidden lg:flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-muted-foreground" />
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange("sortBy", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="priceLow">Price: Low to High</SelectItem>
                      <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                      <SelectItem value="nameAZ">Name: A to Z</SelectItem>
                      <SelectItem value="nameZA">Name: Z to A</SelectItem>
                      <SelectItem value="moqLow">MOQ: Low to High</SelectItem>
                      <SelectItem value="moqHigh">MOQ: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Product Catalog */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Bulk Products</h3>
                {isLoading ? (
                  <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.filter((p) => p.type === "bulk").length > 0 ? (
                  <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts
                      .filter((p) => p.type === "bulk")
                      .map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product}
                          isDistributor={true}
                          onQuoteRequest={handleRequestQuote}
                        />
                      ))}
                  </div>
                ) : (
                  <div ref={productsRef} className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No bulk products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Customization Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Customization</h3>
                {filteredProducts.filter((p) => p.type === "custom").length > 0 ? (
                  <div ref={customProductsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts
                      .filter((p) => p.type === "custom")
                      .map((series) => (
                        <CustomProductSeriesCard
                          key={series.id}
                          series={series}
                          onRequestCustomization={handleRequestQuote}
                        />
                      ))}
                  </div>
                ) : (
                  <div ref={customProductsRef} className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No custom products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-eco text-white">
        <div className="container-custom">
          <div ref={sustainabilityRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Our Commitment to Sustainability</h2>
              </div>
              <p className="text-lg opacity-90 mb-6">
                Eco Packaging Products Inc. is dedicated to environmental responsibility. 
                We source sustainable materials and employ eco-friendly manufacturing processes 
                to minimize our carbon footprint and help your business meet its sustainability goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>100% recyclable and biodegradable options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Reduced plastic usage in all our products</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Carbon-neutral shipping options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Ethical sourcing and fair labor practices</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013" 
                alt="Sustainable packaging" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <QuoteFormModal 
        product={selectedProduct}
        isOpen={showQuoteModal}
        onClose={closeQuoteModal}
      />
    </div>
  );
};

export default DistributorPage;