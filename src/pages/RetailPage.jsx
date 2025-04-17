import { useState, useEffect, useRef } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import CustomProductSeriesCard from "@/components/CustomProductSeriesCard";
import QuoteFormModal from "@/components/QuoteFormModal";
import { getProducts } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RetailPage = () => {
  const [products, setProducts] = useState([]); // Retail products (isCustomizable: false)
  const [customProducts, setCustomProducts] = useState([]); // Customizable products (isCustomizable: true)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const retailProductsRef = useRef(null);
  const customProductsRef = useRef(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        // Separate retail and customizable products
        const retailData = data
          .filter((product) => !product.isCustomizable)
          .map((product) => {
            const retailProduct = {
              ...product,
              type: "retail",
              moq: product.moq || 1,
              material: product.details?.material || "Premium Non Woven",
              usage: product.details?.useCase || "General",
              isEcoFriendly: product.isEcoFriendly || false,
              isBestSeller: product.isBestSeller || product.featured || false,
            };

            if (retailProduct.usage) {
              const usageLower = retailProduct.usage.toLowerCase();
              if (usageLower.includes("deli") || usageLower.includes("pack")) {
                retailProduct.usage = "Beer, Snacks, and Deli";
              } else if (usageLower.includes("liquor")) {
                retailProduct.usage = "Wine & Liquor Bags";
              } else {
                retailProduct.usage = "General";
              }
            }

            return retailProduct;
          });

        const customData = data
          .filter((product) => product.isCustomizable)
          .map((product) => ({
            ...product,
            type: "custom",
            bulkPrice: product.bulkPrice,
            pcsPerCase: product.pcsPerCase,
            moq: product.moq,
            material: product.details?.material || "Unknown",
            usage: product.details?.useCase || "Multi-purpose",
            isEcoFriendly: product.isEcoFriendly || false,
            isBestSeller: product.isBestSeller || false,
          }));

        console.log("Retail Products:", retailData);
        console.log("Custom Products:", customData);

        setProducts(retailData);
        setCustomProducts(customData);

        const allProducts = [...retailData, ...customData];
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
            product.type === "retail" ? product.price : product.bulkPrice
          ),
          10
        );
        setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] }));
      } catch (error) {
        console.error("Error fetching products:", error);
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
          product.description.toLowerCase().includes(query)
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
      const price =
        product.type === "retail" ? product.price : product.bulkPrice;
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
          const priceA = a.type === "retail" ? a.price : a.bulkPrice;
          const priceB = b.type === "retail" ? b.price : b.bulkPrice;
          return priceA - priceB;
        });
        break;
      case "priceHigh":
        result.sort((a, b) => {
          const priceA = a.type === "retail" ? a.price : a.bulkPrice;
          const priceB = b.type === "retail" ? b.price : b.bulkPrice;
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
    // Header Animation
    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Filter Animation
    gsap.fromTo(
      filterRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: filterRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Retail Products Animation
    if (!isLoading) {
      gsap.fromTo(
        retailProductsRef.current?.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: retailProductsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Custom Products Animation
      gsap.fromTo(
        customProductsRef.current?.children,
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
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        headerRef.current,
        filterRef.current,
        retailProductsRef.current,
        customProductsRef.current,
      ]);
    };
  }, [isLoading]);

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
        product.type === "retail" ? product.price : product.bulkPrice
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

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <section className="bg-eco py-16">
        <div className="container-custom">
          <div ref={headerRef} className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Eco-Friendly Packaging</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse our collection of sustainable packaging solutions for your retail and customization needs
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
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

            <div
              ref={filterRef}
              className={`lg:w-1/4 lg:block ${showFilters ? "block" : "hidden"}`}
            >
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
                            product.type === "retail"
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
                  <label className="block text-sm font-medium mb-2">Categories</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleFilterOption("categories", category)}
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

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm h-80 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Retail Products Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Retail Products</h2>
                    {filteredProducts.filter((p) => p.type === "retail").length >
                    0 ? (
                      <div
                        ref={retailProductsRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {filteredProducts
                          .filter((p) => p.type === "retail")
                          .map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No retail products match your filters.
                      </p>
                    )}
                  </div>

                  {/* Customization Section */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Customization</h2>
                    {filteredProducts.filter((p) => p.type === "custom").length >
                    0 ? (
                      <div
                        ref={customProductsRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {filteredProducts
                          .filter((p) => p.type === "custom")
                          .map((product) => (
                            <CustomProductSeriesCard
                              key={product.id}
                              series={product}
                              onRequestCustomization={openModal}
                            />
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No customization products match your filters.
                      </p>
                    )}
                  </div>

                  {/* No Results */}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">
                        No products found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or search criteria.
                      </p>
                      <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <QuoteFormModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default RetailPage;