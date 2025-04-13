import { useEffect, useRef, useState } from "react";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomProductSeriesCard from "@/components/CustomProductSeriesCard";
import QuoteFormModal from "@/components/QuoteFormModal";

gsap.registerPlugin(ScrollTrigger);

const CustomBagsPage = () => {
  const bannerImageRef = useRef(null);
  const productsRef = useRef(null);
  const filterRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const bagSeriesData = [
    {
      id: "jute-bag-series",
      name: "Jute Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744477756/bagstoryCustom/Screenshot_63_h9ru0x.png",
      description: "Eco-friendly, durable bags made from natural jute fibers.",
      bulkPrice: 2.5,
      pcsPerCase: 100,
      moq: 500,
      material: "Jute",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: false,
    },
    {
      id: "nylon-foldable-series",
      name: "Nylon Foldable Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476136/bagstoryCustom/Screenshot_64_eysfhe.png",
      description: "Lightweight, compact bags that fold into a small pouch.",
      bulkPrice: 1.8,
      pcsPerCase: 200,
      moq: 1000,
      material: "Nylon",
      usage: "Travel",
      isEcoFriendly: false,
      isBestSeller: true,
    },
    {
      id: "cooler-bag-series",
      name: "Cooler Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744478046/bagstoryCustom/Screenshot_65_cfpl0d.png",
      description: "Keeps your food and drinks fresh with insulated linings.",
      bulkPrice: 5.0,
      pcsPerCase: 50,
      moq: 300,
      material: "Nylon",
      usage: "Cooler",
      isEcoFriendly: false,
      isBestSeller: false,
    },
    {
      id: "wine-bag-series",
      name: "Wine Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_5_wdzliu.png",
      description: "Crafted to safely transport your favorite bottles.",
      bulkPrice: 3.0,
      pcsPerCase: 80,
      moq: 400,
      material: "Canvas",
      usage: "Wine",
      isEcoFriendly: true,
      isBestSeller: false,
    },
    {
      id: "backpack-series",
      name: "Backpack Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_6_pvzetl.png",
      description: "Spacious, ergonomic designs for everyday use.",
      bulkPrice: 10.0,
      pcsPerCase: 20,
      moq: 200,
      material: "Oxford",
      usage: "School/Work",
      isEcoFriendly: false,
      isBestSeller: true,
    },
    {
      id: "stitching-bag-series",
      name: "Stitching Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_7_tt8ocb.png",
      description: "Features bags with reinforced stitching for added durability.",
      bulkPrice: 2.0,
      pcsPerCase: 120,
      moq: 600,
      material: "Canvas",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: false,
    },
    {
      id: "heat-sealed-bag-series",
      name: "Heat Sealed Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476136/bagstoryCustom/Screenshot_8_gvqgb2.png",
      description: "Seamless, heat-sealed bags for a sleek finish.",
      bulkPrice: 1.5,
      pcsPerCase: 150,
      moq: 800,
      material: "Nylon",
      usage: "Retail",
      isEcoFriendly: false,
      isBestSeller: false,
    },
    {
      id: "pvc-bag-series",
      name: "PVC Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_9_m9uqoc.png",
      description: "Transparent, waterproof bags made from durable PVC material.",
      bulkPrice: 2.2,
      pcsPerCase: 100,
      moq: 500,
      material: "PVC",
      usage: "Retail",
      isEcoFriendly: false,
      isBestSeller: false,
    },
    {
      id: "canvas-bag-series",
      name: "Canvas Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_10_cbkiil.png",
      description: "Sturdy canvas material, offering a classic and timeless look.",
      bulkPrice: 4.0,
      pcsPerCase: 60,
      moq: 400,
      material: "Canvas",
      usage: "Grocery",
      isEcoFriendly: true,
      isBestSeller: true,
    },
    {
      id: "oxford-bag-series",
      name: "Oxford Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_11_x0fb9i.png",
      description: "Combines durability and elegance with Oxford fabric.",
      bulkPrice: 6.0,
      pcsPerCase: 40,
      moq: 300,
      material: "Oxford",
      usage: "School/Work",
      isEcoFriendly: false,
      isBestSeller: false,
    },
    {
      id: "woven-bag-series",
      name: "Woven Bag Series",
      image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_12_l3hp8x.png",
      description: "Intricately woven designs for a unique, artisanal look.",
      bulkPrice: 3.5,
      pcsPerCase: 80,
      moq: 400,
      material: "Woven",
      usage: "Retail",
      isEcoFriendly: true,
      isBestSeller: false,
    },
  ];

  const [filteredBags, setFilteredBags] = useState(bagSeriesData);
  const [filters, setFilters] = useState({
    sortBy: "priceLow",
    material: [],
    priceRange: [1, 10],
    moqRange: [200, 1000],
    usage: [],
    others: [],
  });

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    let filtered = [...bagSeriesData];

    // Sort By
    switch (filters.sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.bulkPrice - b.bulkPrice);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.bulkPrice - a.bulkPrice);
        break;
      case "moqLow":
        filtered.sort((a, b) => a.moq - b.moq);
        break;
      case "moqHigh":
        filtered.sort((a, b) => b.moq - a.moq);
        break;
      default:
        break;
    }

    if (filters.material.length > 0) {
      filtered = filtered.filter((bag) => filters.material.includes(bag.material));
    }

    filtered = filtered.filter(
      (bag) =>
        bag.bulkPrice >= filters.priceRange[0] &&
        bag.bulkPrice <= filters.priceRange[1]
    );

    filtered = filtered.filter(
      (bag) => bag.moq >= filters.moqRange[0] && bag.moq <= filters.moqRange[1]
    );

    if (filters.usage.length > 0) {
      filtered = filtered.filter((bag) => filters.usage.includes(bag.usage));
    }

    if (filters.others.length > 0) {
      filtered = filtered.filter((bag) =>
        filters.others.some((option) =>
          option === "Eco-Friendly" ? bag.isEcoFriendly : bag.isBestSeller
        )
      );
    }

    setFilteredBags(filtered);
  }, [filters]);

  useEffect(() => {
    if (bannerImageRef.current) {
      gsap.fromTo(
        bannerImageRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bannerImageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    if (productsRef.current) {
      gsap.fromTo(
        productsRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([bannerImageRef.current, productsRef.current, filterRef.current]);
    };
  }, []);

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

  const resetFilters = () => {
    setFilters({
      sortBy: "priceLow",
      material: [],
      priceRange: [1, 10],
      moqRange: [200, 1000],
      usage: [],
      others: [],
    });
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-eco py-16">
        <div className="container mx-auto">
          <div ref={bannerImageRef} className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Custom Bags</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Explore our range of customizable bags designed for every business need, with style and sustainability in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
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
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                  <SelectItem value="moqLow">MOQ: Low to High</SelectItem>
                  <SelectItem value="moqHigh">MOQ: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Sidebar */}
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
                    onClick={resetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[1, 10]}
                      min={1}
                      max={10}
                      step={0.1}
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        handleFilterChange("priceRange", value)
                      }
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${filters.priceRange[0].toFixed(1)}</span>
                      <span>${filters.priceRange[1].toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* MOQ Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    MOQ Range
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[200, 1000]}
                      min={200}
                      max={1000}
                      step={10}
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

                {/* Material Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Material Type
                  </label>
                  <div className="space-y-2">
                    {["Jute", "Nylon", "Canvas", "PVC", "Oxford", "Woven"].map(
                      (material) => (
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
                      )
                    )}
                  </div>
                </div>

                {/* Usage */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Usage
                  </label>
                  <div className="space-y-2">
                    {[
                      "Grocery",
                      "Travel",
                      "Cooler",
                      "Wine",
                      "School/Work",
                      "Retail",
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

                {/* Others */}
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
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4">
              <div className="hidden lg:flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredBags.length} products
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={18}
                    className="text-muted-foreground"
                  />
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priceLow">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="priceHigh">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="moqLow">MOQ: Low to High</SelectItem>
                      <SelectItem value="moqHigh">MOQ: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredBags.length > 0 ? (
                <div
                  ref={productsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredBags.map((series) => (
                    <CustomProductSeriesCard
                      key={series.id}
                      series={series}
                      onRequestCustomization={openModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters.
                  </p>
                  <Button onClick={resetFilters}>Clear Filters</Button>
                </div>
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

export default CustomBagsPage;