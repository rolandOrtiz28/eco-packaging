import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Badge, Clock, ThumbsUp, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Testimonials from "@/components/Testimonials";
import { getProducts, getBlogPosts } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for sections
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const leafRef = useRef(null);
  const aboutImageRef = useRef(null);
  const aboutTextRef = useRef(null);
  const productsRef = useRef(null);
  const strengthsRef = useRef(null);
  const blogRef = useRef(null); // Fixed: Changed "the" to "const"
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

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
        const products = await getProducts();
        setFeaturedProducts(products.slice(0, 4));
        const response = await getBlogPosts({ published: true });
        const posts = response.posts || [];
        setBlogPosts(posts.slice(0, 2));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate useEffect for Hero Section Animation (runs only once on mount)
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

    // Cleanup on unmount
    return () => {
      gsap.killTweensOf([
        heroTextRef.current?.children,
        heroImageRef.current,
        leafRef.current,
      ]);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // useEffect for other sections (depends on isLoading)
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

    // Cleanup on unmount
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

  return (
    <div>
      <section ref={heroSectionRef} className="relative bg-eco pb-10 pt-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1165099864/photo/plastic-free-set-with-eco-cotton-bag-glass-jar-green-leaves-and-recycled-tableware-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=usar9V7DhBWkDIskLAh0ETV5R3kMyuJmk3IwJWGb_Ko=')] bg-cover bg-center" />
        </div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div ref={heroTextRef} className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Sustainable Packaging Solutions for a Greener Future
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Premium non-woven bag solutions that combine quality, sustainability, and style for businesses of all sizes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/retail">
                  <Button className="text-eco bg-white hover:bg-gray-100 w-full sm:w-auto">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/distributor">
                  <Button variant="outline" className="border-white text-eco hover:bg-white/10 w-full sm:w-auto">
                    <Truck className="mr-2 h-5 w-5" />
                    Bulk Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  ref={heroImageRef}
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744274457/BagStory/Hero_ap2vi2.png"
                  alt="Eco-friendly bags"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400?text=Eco-Friendly+Bags"; // Fallback image
                  }}
                />
                <div ref={leafRef} className="absolute -bottom-5 -left-5 bg-white rounded-lg p-3 shadow-lg">
                  <Leaf className="h-8 w-8 text-eco" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                ref={aboutImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744076755/BagStory/eco-packaging-03-800x586_ujtfqu.jpg"
                alt="About Eco Packaging Products"
                className="rounded-lg shadow-md"
              />
            </div>
            <div ref={aboutTextRef} className="order-1 lg:order-2">
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
                not only eco-friendly but also durable, versatile, and visually appealing. We partner with businesses of all
                sizes, from boutique retailers to large corporations, providing customized packaging solutions that align with
                their brand values and sustainability goals.
              </p>
              <Link to="/about">
                <Button className="bg-eco hover:bg-eco-dark">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">OUR PRODUCTS</h6>
            <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our most popular eco-friendly packaging solutions, designed with sustainability and functionality in mind.
            </p>
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
            <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/retail">
              <Button variant="outline" className="border-eco text-eco hover:bg-eco/10">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">WHY CHOOSE US</h6>
            <h2 className="text-3xl font-bold mb-3">Our Core Strengths</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              At Eco Packaging Products Inc., we pride ourselves on these key differentiators that set us apart from the competition.
            </p>
          </div>

          <div ref={strengthsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Badge className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
              <p className="text-gray-700">
                We use premium, sustainable materials that are both durable and environmentally friendly, ensuring our products stand the test of time.
              </p>
            </div>

            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ThumbsUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-700">
                Our dedicated support team ensures a seamless experience from order placement to delivery, with a 98% customer satisfaction rate.
              </p>
            </div>

            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Turnaround</h3>
              <p className="text-gray-700">
                With our efficient manufacturing process and robust supply chain, we deliver on time, every time, even for custom orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">OUR BLOG</h6>
            <h2 className="text-3xl font-bold mb-3">Latest Articles</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Stay informed about sustainability trends, packaging innovations, and company updates.
            </p>
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
            <div ref={blogRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.images && post.images.length > 0 ? post.images[0].url : 'https://via.placeholder.com/800x400'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-eco font-medium mb-2">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
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

          <div className="text-center mt-12">
            <Link to="/blog">
              <Button variant="outline" className="border-eco text-eco hover:bg-eco/10">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div ref={testimonialsRef}>
        <Testimonials />
      </div>

      <section ref={ctaRef} className="py-16 bg-eco text-white">
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
              <Button className="text-eco bg-white hover:bg-gray-100 w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-eco hover:bg-white/10 w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;