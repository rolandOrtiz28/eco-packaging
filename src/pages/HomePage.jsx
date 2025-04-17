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

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showNewsletterModal, setShowNewsletterModal] = useState(true);
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

  // Track animation state to prevent repeats
  const hasAnimated = useRef({
    hero: false,
    about: false,
    products: false,
    strengths: false,
    blog: false,
    testimonials: false,
    cta: false,
  });

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, bannersData, blogResponse] = await Promise.all([
          getProducts(),
          getBanners(),
          getBlogPosts({ published: true })
        ]);
        console.log('Fetched banners:', bannersData); // Add this
        setFeaturedProducts(products.slice(0, 4));
        setBestSellers(products.slice(4, 8));
        setNewArrivals(products.slice(8, 12));
        setBanners(bannersData.filter(banner => banner.isActive));
        setBlogPosts(blogResponse.posts?.slice(0, 2) || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
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

  // Animation effects (same as original)
  useEffect(() => {
    if (hasAnimated.current.hero || !heroTextRef.current || !heroImageRef.current || !leafRef.current) return;

    hasAnimated.current.hero = true;
    gsap.fromTo(
      heroTextRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
    gsap.fromTo(
      heroImageRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
    gsap.fromTo(
      leafRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.4)",
        delay: 0.4,
      }
    );

    return () => {
      gsap.killTweensOf([
        heroTextRef.current?.children,
        heroImageRef.current,
        leafRef.current,
      ]);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const animateSection = (ref, options, key) => {
      if (!ref.current || hasAnimated.current[key]) return;
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration || 1,
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
    };

    // About Section Animations
    if (!hasAnimated.current.about && aboutImageRef.current && aboutTextRef.current) {
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
            onEnter: () => (hasAnimated.current.about = true),
          },
        }
      );
      animateSection(aboutTextRef, { stagger: 0.2 }, "about");
    }

    // Featured Products Animations
    if (productsRef.current) {
      animateSection(productsRef, { stagger: 0.15 }, "products");
    }

    // Core Strengths Animations
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

    // Blog Section Animations
    if (blogRef.current) {
      animateSection(blogRef, { stagger: 0.15 }, "blog");
    }

    // Testimonials Section Animations
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

    // CTA Section Animations
    animateSection(ctaRef, { stagger: 0.2 }, "cta");

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
      ]);
    };
  }, [isLoading]);

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
      {/* Hero Banner Carousel */}
      <section className="relative h-[600px] overflow-hidden">
  {banners.length > 0 ? (
    banners.map((banner, index) => (
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
          backgroundSize: 'cover'
        }}
      >
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10 px-6">
          <div className="text-center lg:text-left space-y-4">
            {/* Animated Leaf Icon with Static Text */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div
                className="inline-block"
                ref={(el) => {
                  if (el && index === currentBannerIndex) {
                    const svg = el.querySelector('svg');
                    if (svg) {
                      const path = svg.querySelector('path');
                      if (path) {
                        console.log('Animating leaf icon for banner:', banner.title);
                        const length = path.getTotalLength();
                        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                        gsap.to(path, {
                          strokeDashoffset: 0,
                          duration: 1.5,
                          ease: "power2.out",
                          repeat: -1,
                          repeatDelay: 1,
                        });
                      } else {
                        console.warn('No path element found in Leaf icon for animation');
                      }
                    } else {
                      console.error('SVG element not found for animation');
                    }
                  }
                }}
              >
                <Leaf
                  className="w-6 h-6 text-eco text-shadow-lg/20 drop-shadow-md"
                  strokeWidth={1}
                />
              </div>
              <span className="text-sm md:text-base text-white/90 font-semibold tracking-wider drop-shadow-md">
                Eco Spotlight
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg ${
              banner.titleColor === 'light' ? 'text-white' :
              banner.titleColor === 'dark' ? 'text-black' :
              banner.titleColor === 'gradient-white-to-eco' ? 'bg-gradient-to-r from-white to-eco bg-clip-text text-transparent' :
              banner.titleColor === 'gradient-black-to-eco' ? 'bg-gradient-to-r from-black to-eco bg-clip-text text-transparent' :
              'text-white'
            }`}>
              {banner.title}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md ${
              banner.subtitleColor === 'light' ? 'text-white/90' :
              banner.subtitleColor === 'dark' ? 'text-gray-900' :
              banner.subtitleColor === 'gradient-white-to-eco' ? 'bg-gradient-to-r from-white/90 to-eco/90 bg-clip-text text-transparent' :
              banner.subtitleColor === 'gradient-black-to-eco' ? 'bg-gradient-to-r from-black to-eco bg-clip-text text-transparent' :
              'text-white/90'
            }`}>
              {banner.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={banner.ctaLink}>
                <Button className={`px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  banner.ctaColor === 'light' ? 'bg-white text-eco hover:bg-gray-100' :
                  banner.ctaColor === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' :
                  banner.ctaColor === 'gradient-white-to-eco' ? 'bg-gradient-to-r from-white to-eco text-gray-900 hover:from-eco hover:to-eco-dark' :
                  banner.ctaColor === 'gradient-black-to-eco' ? 'bg-gradient-to-r from-black to-eco text-white hover:from-eco hover:to-eco-dark' :
                  'bg-white text-eco'
                }`}>
                  {banner.ctaText}
                </Button>
              </Link>
              <Link to="/secondary">
                <Button variant="outline" className={`border-white bg-transparent px-8 py-4 rounded-lg transition-all ${
                  banner.ctaColor === 'light' ? 'text-white hover:bg-white/10' :
                  banner.ctaColor === 'dark' ? 'text-gray-900 hover:bg-gray-100' :
                  banner.ctaColor === 'gradient-white-to-eco' ? 'text-white hover:bg-eco/10' :
                  banner.ctaColor === 'gradient-black-to-eco' ? 'text-white hover:bg-eco/10' :
                  'text-white'
                }`}>
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-800">
      <p className="text-xl">No active banners available</p>
    </div>
  )}
  
  {/* Carousel Controls */}
  <button 
    onClick={prevBanner}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
    aria-label="Previous banner"
  >
    <ChevronLeft className="h-8 w-8 text-white" />
  </button>
  <button 
    onClick={nextBanner}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
    aria-label="Next banner"
  >
    <ChevronRight className="h-8 w-8 text-white" />
  </button>
  
  {/* Carousel Indicators */}
  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
    {banners.map((_, index) => (
      <button
        key={index}
        onClick={() => goToBanner(index)}
        className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
          index === currentBannerIndex 
            ? 'bg-white w-8' 
            : 'bg-white/50 hover:bg-white/70'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
</section>

      {/* Promotional Banner */}
      <section className="bg-eco text-white py-4">
        <div className="container-custom text-center">
          <p className="text-sm md:text-base">
            🚀 Free shipping on orders over $50 | ⏳ 30-day money-back guarantee | 🌱 Carbon-neutral shipping
          </p>
        </div>
      </section>

    
{/* Featured Categories */}
<section className="py-12 bg-gray-50">
  <div className="container-custom">
    <h2 className="text-3xl font-bold text-center mb-10">Custom Bags</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {[
        {
          name: "Jute Bag Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744477756/bagstoryCustom/Screenshot_63_h9ru0x.png",
          percentage: "30%",
          moq: "500 Units",
          bgColor: "bg-gradient-to-br from-pink-50 to-green-50",
          link: "/custom-bags#jute-bag-series",
        },
        {
          name: "Nylon Foldable Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476136/bagstoryCustom/Screenshot_64_eysfhe.png",
          percentage: "25%",
          moq: "1000 Units",
          bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
          link: "/custom-bags#nylon-foldable-series",
        },
        {
          name: "Cooler Bag Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744478046/bagstoryCustom/Screenshot_65_cfpl0d.png",
          percentage: "15%",
          moq: "300 Units",
          bgColor: "bg-gradient-to-br from-blue-50 to-pink-50",
          link: "/custom-bags#cooler-bag-series",
        },
        {
          name: "Wine Bag Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_5_wdzliu.png",
          percentage: "10%",
          moq: "400 Units",
          bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
          link: "/custom-bags#wine-bag-series",
        },
        {
          name: "Backpack Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_6_pvzetl.png",
          percentage: "20%",
          moq: "200 Units",
          bgColor: "bg-gradient-to-br from-purple-50 to-green-50",
          link: "/custom-bags#backpack-series",
        },
        {
          name: "Canvas Bag Series",
          image: "https://res.cloudinary.com/rolandortiz/image/upload/v1744476135/bagstoryCustom/Screenshot_10_cbkiil.png",
          percentage: "35%",
          moq: "400 Units",
          bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
          link: "/custom-bags#canvas-bag-series",
        },
      ].map((category, index) => (
        <Link key={index} to={category.link} className="group">
          <div
            className={`rounded-lg shadow-sm hover:shadow-md transition-shadow h-full p-6 text-center ${category.bgColor}`}
          >
            {/* Percentage Badge */}
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1">
              {category.percentage}
            </div>
            {/* PNG Image */}
            <div className="mb-4 flex justify-center">
              <img
                src={category.image}
                alt={category.name}
                className="w-32 h-32 object-contain"
              />
            </div>
            {/* Category Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-eco transition-colors">
              {category.name}
            </h3>
            {/* MOQ */}
            <p className="text-sm text-gray-500 mt-2">MOQ: {category.moq}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/retail" className="text-eco font-medium hover:underline">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-72 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link to="/retail?sort=newest" className="text-eco font-medium hover:underline">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-72 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <Link to="/retail?sort=popular" className="text-eco font-medium hover:underline">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-72 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1715678913/about.jpg"
                alt="About Eco Packaging Products"
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div>
              <h6 className="text-eco font-medium mb-2">ABOUT THE BRAND</h6>
              <h2 className="text-3xl font-bold mb-6">
                A Commitment to Environmental Responsibility
              </h2>
              <p className="text-gray-700 mb-6">
                Eco Packaging Products Inc. is a leading provider of sustainable packaging solutions based in New York.
                We specialize in designing, producing, and distributing premium non-woven bag solutions that help businesses
                reduce their environmental impact without compromising on quality or aesthetics.
              </p>
              <p className="text-gray-700 mb-8">
                Our innovative approach combines cutting-edge materials with thoughtful design to create products that are
                not only eco-friendly but also durable, versatile, and visually appealing.
              </p>
              <div className="flex gap-4">
                <Link to="/about">
                  <Button className="bg-eco hover:bg-eco-dark">
                    Learn More
                  </Button>
                </Link>
                <Link to="/sustainability">
                  <Button variant="outline" className="border-eco text-eco hover:bg-eco/10">
                    Our Sustainability
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-eco" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Shipping</h3>
              <p className="text-gray-700">
                Get your order delivered within 2-3 business days with our eco-friendly shipping options.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Badge className="h-8 w-8 text-eco" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
              <p className="text-gray-700">
                All our products are made with premium materials and backed by our satisfaction guarantee.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-eco" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Choices</h3>
              <p className="text-gray-700">
                Every purchase helps reduce plastic waste and supports environmental initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">TESTIMONIALS</h6>
            <h2 className="text-3xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Don't just take our word for it - hear from businesses that have made the switch to sustainable packaging.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
            <Link to="/blog" className="text-eco font-medium hover:underline">
              View All Articles
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.images && post.images.length > 0 ? post.images[0].url : 'https://via.placeholder.com/800x450'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-eco font-medium mb-2">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-eco transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <p className="text-eco font-medium inline-flex items-center">
                          Read More
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-700 col-span-2">No blog posts available.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eco text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make the Switch to Sustainable Packaging?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of businesses that have already made the eco-friendly choice.
            Let's work together towards a more sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/retail">
              <Button className="text-eco bg-white hover:bg-gray-100">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

     {showNewsletterModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full flex overflow-hidden relative">
      {/* Close Button */}
      <button
        onClick={() => setShowNewsletterModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
      >
        &times;
      </button>

      {/* Image Section */}
      <div className="w-1/2 p-5">
        <img
          src="https://res.cloudinary.com/rolandortiz/image/upload/v1744732733/ChatGPT_Image_Apr_15_2025_10_58_40_PM_etonim.png"
          alt="Newsletter"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Text & Form Section */}
      <div className="w-1/2 p-6 flex flex-col justify-center text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Newsletter.</h2>
        <p className="text-sm text-gray-500 mb-4">
          Subscribe to Masterkart to stay updated.
        </p>

        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-4 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-eco"
          />
          <button
            type="submit"
            className="bg-eco text-white font-semibold px-4 py-2 w-full rounded hover:bg-eco-dark transition"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HomePage;