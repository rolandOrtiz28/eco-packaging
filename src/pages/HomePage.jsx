import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Badge, Clock, ThumbsUp, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Testimonials from "@/components/Testimonials";
import { getProducts, getBlogPosts, getBanners } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSubscription } from "@/hooks/useSubscription";
import ValuePropsGraph from "@/hooks/ValuePropsGraph.jsx";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]); // For Featured Categories section
  const [trendingProducts, setTrendingProducts] = useState([]); // For Trending Items
  const [topRatedProducts, setTopRatedProducts] = useState([]); // For Top Rated
  const [topSellingProducts, setTopSellingProducts] = useState([]); // For Top Selling
  const [isLoading, setIsLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const {
    email,
    setEmail,
    loading,
    message,
    handleSubscribe,
  } = useSubscription();
  const [banners, setBanners] = useState([]);

  // Refs for sections
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const leafRef = useRef(null);
  const aboutImageRef = useRef(null);
  const aboutTextRef = useRef(null);
  const productsRef = useRef(null);
  const strengthsRef = useRef(null);
  const blogRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const carouselRef = useRef(null);
  const aboutRef = useRef(null);
  const valueImpactRef = useRef(null);
  const trendingRef = useRef(null);
  const featuredRef = useRef(null);
const blogGridRef = useRef(null);
const modalRef = useRef(null);

  // Track animation state to prevent repeats
  const hasAnimated = useRef({
    hero: false,
    about: false,
    products: false,
    strengths: false,
    blog: false,
    testimonials: false,
    cta: false,
    aboutRef: false,
    valueImpactRef: false,
    featured: false,
blogs: false,
  });

  const valueCounterRefs = {
    valueGrowth: useRef(null),
    customerReach: useRef(null),
    ecoOffset: useRef(null),
    wasteReduction: useRef(null),
    recycledMaterials: useRef(null),
    costSavings: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, bannersData, blogResponse] = await Promise.all([
          getProducts(),
          getBanners(),
          getBlogPosts({ published: true }),
        ]);
        console.log('Fetched banners:', bannersData);

        // Set existing product sections
        setFeaturedProducts(products.slice(0, 4));
        setBestSellers(products.slice(4, 8));
        setNewArrivals(products.slice(8, 12));

        // Set custom products for Featured Categories section (isCustomizable: true)
        const customProds = products
          .filter((product) => product.isCustomizable === true)
          .slice(0, 6) // Limit to 6 items as in the original hard-coded data
          .map((product) => ({
            name: product.name,
            image: product.image,
            percentage: "20%", // Default value since not in schema; can be derived if needed
            moq: `${product.moq} Units`,
            link: `/custom-bags#${product.id}`,
            tag: product.isEcoFriendly ? "Eco-Friendly" : "Durable", // Derive tag based on isEcoFriendly
          }));
        setCustomProducts(customProds);

        // Set products for Trending / Rated / Selling section
        setTrendingProducts(products.filter((p) => p.isTrending).slice(0, 3));
        setTopRatedProducts(products.filter((p) => p.isTopRated).slice(0, 3));
        setTopSellingProducts(products.filter((p) => p.isBestSeller).slice(0, 3));

        setBanners(bannersData.filter((banner) => banner.isActive));
        setBlogPosts(blogResponse.posts?.slice(0, 2) || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setCustomProducts([]);
        setTrendingProducts([]);
        setTopRatedProducts([]);
        setTopSellingProducts([]);
        setBlogPosts([]);
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Banner carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Animation effects
  useEffect(() => {
    if (isLoading) return;

    const animateSection = (ref, options, key) => {
      if (!ref.current || hasAnimated.current[key]) return;
    
      const cards = ref.current.querySelectorAll("a"); 
  
    
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: options.duration || 1,
          delay: options.delay || 0.1,
          ease: options.ease || "power1.out",
          overwrite: "auto",
          onStart: () => (hasAnimated.current[key] = true),
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    };

    if (!hasAnimated.current.trending && trendingRef.current) {
      const cards = trendingRef.current.querySelectorAll("a");
    
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: trendingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.trending = true),
          },
        }
      );
    }
    
    
    // Animate About Section
    if (!hasAnimated.current.about && aboutImageRef.current && aboutTextRef.current) {
      // Debug: Check aboutRef
      if (!aboutRef.current) {
        console.error("aboutRef is null. Check ref assignment for About section.");
      }

      gsap.fromTo(
        aboutImageRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutImageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              hasAnimated.current.about = true;
              console.log("About section animation triggered");
            },
          },
        }
      );
      animateSection(aboutTextRef, { stagger: 0.2 }, "about");

      // About Stats Counters
      const aboutCounters = [
        { ref: valueCounterRefs.wasteReduction, endValue: 5000, suffix: " tons" },
        { ref: valueCounterRefs.recycledMaterials, endValue: 80, suffix: "%" },
        { ref: valueCounterRefs.costSavings, endValue: 25, suffix: "%" },
      ];

      aboutCounters.forEach(({ ref, endValue, prefix = "", suffix = "" }, index) => {
        // Debug: Check if ref exists
        if (!ref.current) {
          console.error(`Counter ref at index ${index} is null. Check ref assignment in JSX.`);
          return;
        }

        console.log(`Setting up counter for ref ${index} with endValue ${endValue}`);

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: endValue,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => {
              console.log(`Counter animation triggered for ref ${index}`);
            },
          },
          onUpdate: () => {
            try {
              if (ref.current) {
                ref.current.textContent = prefix + Math.floor(counterObj.val).toLocaleString() + suffix;
              } else {
                console.warn(`Ref for counter ${index} became null during animation`);
              }
            } catch (error) {
              console.error(`Error updating counter ${index}:`, error);
            }
          },
          onComplete: () => {
            console.log(`Counter animation completed for ref ${index}`);
          },
        });
      });
    }

    if (!hasAnimated.current.featured && featuredRef.current) {
      const cards = featuredRef.current.querySelectorAll("div > div, a");
    
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.featured = true),
          },
        }
      );
    }
    
    // Animate Blog Grid
    if (!hasAnimated.current.blogs && blogGridRef.current) {
      const blogCards = blogGridRef.current.querySelectorAll("a");
    
      gsap.fromTo(
        blogCards,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: blogGridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.blogs = true),
          },
        }
      );
    }

    // Animate Featured Products
    animateSection(productsRef, {
      duration: 1.1,
      delay: 0.1,
      ease: "power1.out", 
    }, "products");
    
    
    

    // Animate Core strengths
    if (!hasAnimated.current.strengths && strengthsRef.current) {
      gsap.fromTo(
        strengthsRef.current.children,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strengthsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.strengths = true),
          },
        }
      );
    }

    // Animate Blog Section
    animateSection(blogRef, { stagger: 0.15 }, "blog");

    // Animate Testimonials
    if (!hasAnimated.current.testimonials && testimonialsRef.current) {
      gsap.fromTo(
        testimonialsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => (hasAnimated.current.testimonials = true),
          },
        }
      );
    }

    // Animate CTA
    animateSection(ctaRef, { stagger: 0.2 }, "cta");

    // Animate Value Impact + Counters
    if (!hasAnimated.current.valueImpactRef && valueImpactRef.current) {
      hasAnimated.current.valueImpactRef = true;

      gsap.fromTo(
        valueImpactRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valueImpactRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const counters = [
        { ref: valueCounterRefs.valueGrowth, endValue: 6000, prefix: "$" },
        { ref: valueCounterRefs.customerReach, endValue: 2, suffix: "x" },
        { ref: valueCounterRefs.ecoOffset, endValue: 13, suffix: "+" },
      ];

      counters.forEach(({ ref, endValue, prefix = "", suffix = "" }) => {
        if (ref.current) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: endValue,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valueImpactRef.current,
              start: "top 80%",
            },
            onUpdate: () => {
              if (ref.current) {
                ref.current.textContent =
                  prefix + Math.floor(counterObj.val).toLocaleString() + suffix;
              }
            },
          });
        }
      });
    }

    // Refresh ScrollTrigger layout
    setTimeout(() => ScrollTrigger.refresh(), 1000);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        aboutImageRef.current,
        aboutTextRef.current?.children,
        productsRef.current?.children,
        strengthsRef.current?.children,
        blogRef.current?.children,
        testimonialsRef.current,
        ctaRef.current?.children,
        valueImpactRef.current?.children,
      ]);
    };
  }, [isLoading]);
  useEffect(() => {
    const hasShownModal = sessionStorage.getItem("newsletterModalShown");

    if (!hasShownModal && modalRef.current) {
      // Show modal
      setShowNewsletterModal(true);
      sessionStorage.setItem("newsletterModalShown", "true");

      // Fade-in animation
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Auto-close after 4 seconds with fade-out
      const timer = setTimeout(() => {
        if (modalRef.current) {
          gsap.to(modalRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => setShowNewsletterModal(false),
          });
        } else {
          setShowNewsletterModal(false);
        }
      }, 4000);

      // Cleanup
      return () => {
        clearTimeout(timer);
        gsap.killTweensOf(modalRef.current);
      };
    }
  }, []);

  // Handle manual close with fade-out
  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setShowNewsletterModal(false),
      });
    } else {
      setShowNewsletterModal(false);
    }
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
  };

  return (
    <div className="bg-white">
      {/* Hero Banner Carousel - Responsive adjustments only */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="h-full w-full flex items-center">
              <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center px-4 sm:px-6">
                <div className="text-center lg:text-left space-y-3 md:space-y-4">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 sm:h-12 md:h-14 w-3/4 bg-gray-200 rounded mx-auto lg:mx-0"></div>
                  <div className="h-6 sm:h-8 w-full max-w-2xl bg-gray-200 rounded mx-auto lg:mx-0"></div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <div className="h-10 sm:h-12 w-32 sm:w-40 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 sm:h-12 w-32 sm:w-40 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : banners.length > 0 ? (
          <div ref={carouselRef}>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                  index === currentBannerIndex
                    ? 'opacity-100 z-10 scale-100'
                    : 'opacity-0 z-0 scale-105'
                } bg-cover bg-center`}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%), url(${banner.image})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                }}
              >
                <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center relative z-10 px-4 sm:px-6">
                  <div className="text-center lg:text-left space-y-3 md:space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <div
                        className="inline-block"
                        ref={(el) => {
                          if (el && index === currentBannerIndex) {
                            const svg = el.querySelector('svg');
                            if (svg) {
                              const path = svg.querySelector('path');
                              if (path) {
                                const length = path.getTotalLength();
                                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                                gsap.to(path, {
                                  strokeDashoffset: 0,
                                  duration: 1.5,
                                  ease: "power2.out",
                                  repeat: -1,
                                  repeatDelay: 1,
                                });
                              }
                            }
                          }
                        }}
                      >
                        <Leaf
                          className="w-5 h-5 sm:w-6 sm:h-6 text-eco text-shadow-lg/20 drop-shadow-md"
                          strokeWidth={1}
                        />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base text-white/90 font-semibold tracking-wider drop-shadow-md">
                        Eco Spotlight
                      </span>
                    </div>
                    <h1
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg ${
                        banner.titleColor === 'light'
                          ? 'text-white'
                          : banner.titleColor === 'dark'
                          ? 'text-black'
                          : banner.titleColor === 'gradient-white-to-eco'
                          ? 'bg-gradient-to-r from-white to-eco bg-clip-text text-transparent'
                          : banner.titleColor === 'gradient-black-to-eco'
                          ? 'bg-gradient-to-r from-black to-eco bg-clip-text text-transparent'
                          : 'text-white'
                      }`}
                    >
                      {banner.title}
                    </h1>
                    <p
                      className={`text-base sm:text-lg md:text-xl mb-4 md:mb-6 max-w-2xl drop-shadow-md ${
                        banner.subtitleColor === 'light'
                          ? 'text-white/90'
                          : banner.subtitleColor === 'dark'
                          ? 'text-gray-900'
                          : banner.subtitleColor === 'gradient-white-to-eco'
                          ? 'bg-gradient-to-r from-white/90 to-eco/90 bg-clip-text text-transparent'
                          : banner.subtitleColor === 'gradient-black-to-eco'
                          ? 'bg-gradient-to-r from-black to-eco bg-clip-text text-transparent'
                          : 'text-white/90'
                      }`}
                    >
                      {banner.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <Link to={banner.ctaLink}>
                        <Button
                          className={`px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all transform hover:scale-105

 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                            banner.ctaColor === 'light'
                              ? 'bg-white text-eco hover:bg-gray-100'
                              : banner.ctaColor === 'dark'
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : banner.ctaColor === 'gradient-white-to-eco'
                              ? 'bg-gradient-to-r from-white to-eco text-gray-900 hover:from-eco hover:to-eco-dark'
                              : banner.ctaColor === 'gradient-black-to-eco'
                              ? 'bg-gradient-to-r from-black to-eco text-white hover:from-eco hover:to-eco-dark'
                              : 'bg-white text-eco'
                          }`}
                        >
                          {banner.ctaText}
                        </Button>
                      </Link>
                      <Link to="/secondary">
                        <Button
                          variant="outline"
                          className={`border-white bg-transparent px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all text-sm sm:text-base ${
                            banner.ctaColor === 'light'
                              ? 'text-white hover:bg-white/10'
                              : banner.ctaColor === 'dark'
                              ? 'text-gray-900 hover:bg-gray-100'
                              : banner.ctaColor === 'gradient-white-to-eco'
                              ? 'text-white hover:bg-eco/10'
                              : banner.ctaColor === 'gradient-black-to-eco'
                              ? 'text-white hover:bg-eco/10'
                              : 'text-white'
                          }`}
                        >
                          Learn more
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-800">
            <p className="text-lg sm:text-xl">No active banners available</p>
          </div>
        )}

        {/* Carousel Controls */}
        {!isLoading && banners.length > 0 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-3 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={`w-3 h-1 sm:w-4 sm:h-1.5 rounded-full transition-all duration-300 ${
                    index === currentBannerIndex
                      ? 'bg-white sm:w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Promotional Banner - Responsive text only */}
      <section className="bg-eco text-white py-3 sm:py-4">
        <div className="container-custom text-center">
          <p className="text-xs sm:text-sm md:text-base">
            🚀 Free shipping on orders over $50 | ⏳ 30-day money-back guarantee | 🌱 Carbon-neutral shipping
          </p>
        </div>
      </section>

      {/* Featured Categories - Responsive grid only */}
      <section  className="py-12 sm:py-16 md:py-20 bg-[#dfddd7]">
        <div className="container-custom">
          {/* Header - Responsive text only */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-[#25553d] font-medium tracking-wide uppercase text-xs sm:text-sm mb-2">Custom Solutions</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">Premium Custom Bag Collections</h2>
            <p className="text-gray-700 max-w-xl mx-auto text-sm sm:text-base">High-quality, sustainable bag solutions tailored to your brand requirements</p>
          </div>

          {/* Grid - Responsive columns only */}
          <div ref={productsRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 min-h-[300px]">
            {isLoading ? (
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow h-48 sm:h-64 animate-pulse">
                  <div className="h-24 sm:h-32 bg-gray-200 rounded-t-lg sm:rounded-t-xl"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : customProducts.length > 0 ? (
              customProducts.map((item, index) => (
                <Link
                  to={item.link}
                  key={index}
                  className="group transition-transform hover:-translate-y-1 sm:hover:-translate-y-1.5"
                >
                  <div className="relative bg-white rounded-lg sm:rounded-xl shadow hover:shadow-lg transition-all p-3 sm:p-4 text-center w-full max-w-[180px] sm:max-w-[210px] mx-auto" style={{ willChange: "opacity, transform", transform: "translateY(0)" }}>
                    {/* Discount Ribbon - Responsive sizing only */}
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-eco text-white text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-[2px] rounded-full shadow-sm z-10">
                      {item.percentage} OFF
                    </div>
                
                    {/* Tag - Responsive sizing only */}
                    <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-white text-[#25553d] text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-[2px] rounded-full border border-[#A4C3A2] shadow-sm">
                      {item.tag}
                    </span>
                
                    {/* Image - Responsive sizing only */}
                    <div className="flex items-center justify-center mb-3 sm:mb-4 mt-3 sm:mt-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-20 sm:max-h-28 mt-4 object-contain transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                
                    {/* Title + MOQ - Responsive text only */}
                    <div>
                      <h3 className="text-xs sm:text-[13px] md:text-[14px] font-semibold text-gray-900 group-hover:text-[#25553d] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        <span className="font-medium">MOQ:</span> {item.moq}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-6 text-center text-gray-700 text-sm sm:text-base">
                No custom products available.
              </div>
            )}
          </div>

          {/* Footer Link - Responsive text only */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/custombags"
              className="inline-flex items-center text-[#25553d] font-semibold hover:underline text-xs sm:text-sm"
            >
              Explore all collections
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Responsive layout only */}
      <section ref={aboutRef} className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
            {/* Left: Image Grid - Responsive sizing only */}
            <div ref={aboutImageRef} className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                <div className="relative group">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476169/bagstoryCustom/Image_20250412214849_vgwmmo.jpg"
                    alt="Eco Bag 1"
                    className="rounded-lg sm:rounded-xl shadow-md w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group mt-auto">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476197/bagstoryCustom/Image_20250412215022_wpvlmg.jpg"
                    alt="Eco Bag 2"
                    className="rounded-lg sm:rounded-xl shadow-md w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477296/bagstoryCustom/Screenshot_17_jcene8.png"
                    alt="Eco Bag 3"
                    className="rounded-lg sm:rounded-xl shadow-md w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476706/bagstoryCustom/Screenshot_13_q4pavh.png"
                    alt="Eco Bag 4"
                    className="rounded-lg sm:rounded-xl shadow-md w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right: Text and Stats - Responsive text only */}
            <div ref={aboutTextRef} className="lg:w-1/2 w-full mt-8 lg:mt-0">
              <div className="inline-block bg-eco/10 text-eco px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4 font-medium text-xs sm:text-sm">
                ABOUT THE BRAND
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">A Commitment to Environmental Responsibility</h2>
              <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base">
                <p>
                  EcoLogic Solutions LLC is a leading provider of sustainable packaging solutions based in New York.
                  We specialize in designing, producing, and distributing premium non-woven bag solutions that help businesses
                  reduce their environmental impact without compromising on quality or aesthetics.
                </p>

                {/* Stats Panel - Responsive sizing only */}
                <div className="bg-eco/5 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-eco-dark">Sustainability Metrics</h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                    <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                      <div
                        className="text-xl sm:text-2xl font-bold text-eco"
                        ref={valueCounterRefs.wasteReduction}
                      ></div>
                      <div className="text-xs sm:text-sm">Waste Reduction</div>
                    </div>
                    <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                      <div
                        className="text-xl sm:text-2xl font-bold text-eco"
                        ref={valueCounterRefs.recycledMaterials}
                      ></div>
                      <div className="text-xs sm:text-sm">Recycled Materials</div>
                    </div>
                    <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                      <div
                        className="text-xl sm:text-2xl font-bold text-eco"
                        ref={valueCounterRefs.costSavings}
                      ></div>
                      <div className="text-xs sm:text-sm">Cost Savings</div>
                    </div>
                  </div>
                </div>

                <p>
                  By embracing sustainable practices, we offer high-quality products at competitive prices while contributing
                  to a greener future. Our environmental commitment extends across all operations, from material sourcing to
                  final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Responsive grid only */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-[#25553d] font-medium tracking-wide uppercase text-xs sm:text-sm mb-2">Featured Products</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">Premium Custom Bag Collections</h2>
            <p className="text-gray-700 max-w-xl mx-auto text-sm sm:text-base">High-quality, sustainable bag solutions tailored to your brand requirements</p>
            <Link to="/retail" className="text-eco font-medium hover:underline text-sm sm:text-base">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-60 sm:h-72 animate-pulse">
                  <div className="h-36 sm:h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={featuredRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending / Rated / Selling Section - Responsive layout only */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
            {/* Left Promo Banner - Responsive sizing only */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Our Top Most Products</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Check It Now</p>
                <Link to="/retail">
                  <button className="bg-eco text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm">
                    Shop Now
                  </button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-6">
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477756/bagstoryCustom/Screenshot_63_h9ru0x.png"
                  alt="Promo"
                  className="w-full rounded-md sm:rounded-lg"
                />
              </div>
            </div>

            {/* Trending / Rated / Selling Columns - Responsive grid only */}
            <div ref={trendingRef} className="col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Trending Items",
                  products: trendingProducts,
                },
                {
                  title: "Top Rated",
                  products: topRatedProducts,
                },
                {
                  title: "Top Selling",
                  products: topSellingProducts,
                },
              ].map((column, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800">
                      {column.title.split(" ")[0]}{" "}
                      <span className="text-eco">{column.title.split(" ")[1]}</span>
                    </h4>
                    <div className="flex gap-1 sm:gap-2">
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {isLoading ? (
                      [...Array(3)].map((_, index) => (
                        <div key={index} className="flex gap-3 sm:gap-4 items-center animate-pulse">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-200 rounded border"></div>
                          <div className="flex-1">
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))
                    ) : column.products.length > 0 ? (
                      column.products.map((product) => {
                        const units = product.pcsPerCase || 1;
                        const firstTier = product.details?.pricing?.[0];
                        const retailPrice =
                          typeof firstTier?.pricePerUnit === "number"
                            ? (firstTier.pricePerUnit * units).toFixed(2)
                            : "Contact";

                        return (
                          <Link
                            key={product.id}
                            to={`/retail/product/${product.id}`}
                            className="flex gap-3 sm:gap-4 items-center group"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded border"
                            />
                            <div>
                              <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-eco line-clamp-1">
                                {product.name}
                              </h5>
                              <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                                {product.details?.useCase || "Product"}
                              </p>
                              <div className="text-xs sm:text-sm font-bold text-[#25553d]">
                                ${retailPrice}{" "}
                                <span className="text-[10px] sm:text-xs text-gray-500 font-normal">per case</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-700">No products available.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - Responsive layout only */}
      <section ref={valueImpactRef} className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
            {/* LEFT: Description & Stats - Responsive text only */}
            <div className="lg:w-1/2 w-full">
              <div className="inline-block bg-eco/10 text-eco px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4 font-medium text-xs sm:text-sm">
                Value Impact Analysis
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A2E1A] mb-4 sm:mb-6">
                Proof That Our Eco Solutions Perform
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Our growth isn't just green—it's measurable. We track performance across key indicators to ensure our packaging not only protects the planet, but also boosts your business results.
              </p>

              {/* Stats Panel - Responsive sizing only */}
              <div className="bg-eco/5 p-4 sm:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-eco-dark">Eco Metrics</h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                  <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                    <div className="text-xl sm:text-2xl font-bold text-eco" ref={valueCounterRefs.valueGrowth}>
                      $0
                    </div>
                    <div className="text-xs sm:text-sm">Value Growth</div>
                  </div>
                  <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                    <div className="text-xl sm:text-2xl font-bold text-eco" ref={valueCounterRefs.customerReach}>
                      0
                    </div>
                    <div className="text-xs sm:text-sm">Customer Reach</div>
                  </div>
                  <div className="bg-white p-2 sm:p-3 rounded-md sm:rounded-lg shadow-sm">
                    <div className="text-xl sm:text-2xl font-bold text-eco" ref={valueCounterRefs.ecoOffset}>
                      0
                    </div>
                    <div className="text-xs sm:text-sm">Tons Offset</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm sm:text-base">
                Our environmental impact is tracked across organic traffic, recycled use cases, and total carbon offset—helping you move toward a more sustainable brand with measurable growth and reduced waste.
              </p>
            </div>

            {/* RIGHT: Chart - Responsive container only */}
            <div className="lg:w-1/2 w-full mt-8 lg:mt-0 bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 md:p-8">
              <ValuePropsGraph />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Responsive text only */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-[#25553d] font-medium tracking-wide uppercase text-xs sm:text-sm mb-2">TESTIMONIALS</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">What Our Customers Say</h2>
            <p className="text-gray-700 max-w-xl mx-auto text-sm sm:text-base">Don't just take our word for it - hear from businesses that have made the switch to sustainable packaging.</p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Blog Section - Responsive grid and text only */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="container-custom">
         
        <div className="text-center mb-8 sm:mb-12">
  <span className="inline-block text-[#25553d] font-medium tracking-wide uppercase text-xs sm:text-sm mb-2">Blogs</span>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">Latest from Our Blog</h2>
  <p className="text-gray-700 max-w-xl mx-auto text-sm sm:text-base">
    Explore insights, tips, and inspiring stories around sustainability, eco-friendly innovations, and the future of packaging.
  </p>
  <Link to="/blog" className="text-eco text-xs sm:text-sm md:text-base font-medium hover:underline">
    View All Articles
  </Link>
</div>


          {isLoading ? (
            <div ref={blogGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-64 sm:h-80 animate-pulse">
                  <div className="h-28 sm:h-36 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2 sm:mb-3"></div>
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className="h-32 sm:h-40 overflow-hidden">
                        <img
                          src={post.images && post.images.length > 0 ? post.images[0].url : 'https://via.placeholder.com/800x450'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="text-xs text-eco font-medium mb-1">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-eco transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <p className="text-eco text-xs sm:text-sm font-medium inline-flex items-center">
                          Read More
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-700 col-span-2 text-sm sm:text-base">No blog posts available.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Responsive text and buttons only */}
      <section className="py-12 sm:py-16 bg-eco text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Make the Switch to Sustainable Packaging?
          </h2>
          <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Join thousands of businesses that have already made the eco-friendly choice.
            Let's work together towards a more sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/retail">
              <Button className="text-eco bg-white hover:bg-gray-100 text-sm sm:text-base">
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Shop Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 text-sm sm:text-base">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Modal - Responsive layout only */}
      {showNewsletterModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full flex flex-col sm:flex-row overflow-hidden relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg sm:text-xl"
            >
              ×
            </button>

            <div className="w-full sm:w-1/2 p-4 sm:p-5">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744732733/ChatGPT_Image_Apr_15_2025_10_58_40_PM_etonim.png"
                alt="Newsletter"
                className="h-40 sm:h-full w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
              />
            </div>

            <div className="w-full sm:w-1/2 p-4 sm:p-5 flex flex-col justify-center text-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Newsletter.</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Subscribe to Masterkart to stay updated.
              </p>

              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border rounded px-3 py-2 mb-2 sm:mb-3 w-full focus:outline-none focus:ring-2 focus:ring-eco text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  className="bg-eco text-white font-semibold px-4 py-2 w-full rounded hover:bg-eco-dark transition text-xs sm:text-sm"
                  disabled={loading}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              {message && <p className="text-xs sm:text-sm mt-1 sm:mt-2">{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;