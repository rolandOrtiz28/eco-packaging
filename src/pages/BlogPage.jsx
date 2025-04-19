import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const recentPostsRef = useRef(null);
  const postsGridRef = useRef(null);

  const categories = posts.length
    ? Array.from(new Set(posts.flatMap((post) => post.categories || [])))
    : [];

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { posts } = await getBlogPosts({ published: true });
        const normalizedPosts = posts.map((post) => ({
          ...post,
          categories: post.categories || [],
        }));
        setPosts(normalizedPosts);
        setFilteredPosts(normalizedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.categories.includes(selectedCategory)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

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

    // Search Animation
    gsap.fromTo(
      searchRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: searchRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Categories Animation
    if (categories.length > 0) {
      gsap.fromTo(
        categoriesRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Recent Posts Animation
    gsap.fromTo(
      recentPostsRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: recentPostsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Posts Grid Animation (only when not loading and posts exist)
    if (!isLoading && filteredPosts.length > 0) {
      gsap.fromTo(
        postsGridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: postsGridRef.current,
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
        searchRef.current,
        categoriesRef.current,
        recentPostsRef.current,
        postsGridRef.current,
      ]);
    };
  }, [categories, isLoading, filteredPosts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="bg-background">
      <section className="bg-eco py-16">
        <div className="container-custom">
          <div ref={headerRef} className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Stay informed about sustainability trends, packaging innovations, and company updates
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-8">
                <div ref={searchRef} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Search</h3>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                    />
                    <Input
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search articles..."
                      className="pl-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {categories.length > 0 && (
                  <div ref={categoriesRef} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedCategory === category
                              ? "bg-eco hover:bg-eco-dark"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  ref={recentPostsRef}
                  className="bg-white rounded-lg shadow-sm p-6 hidden lg:block"
                >
                  <h3 className="font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="flex items-start group"
                      >
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={post.images[0]?.url}
                            alt={post.images[0]?.altText}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium group-hover:text-eco transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              {isLoading ? (
                <div ref={postsGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm h-96 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div ref={postsGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover h-full">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.images[0]?.url}
                            alt={post.images[0]?.altText}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar size={14} className="mr-2" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <h2 className="text-xl font-semibold mb-3 group-hover:text-eco transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.categories.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-eco font-medium inline-flex items-center">
                            Read More
                            <svg
                              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div ref={postsGridRef} className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <h2 className="text-2xl font-semibold mb-3">No posts found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or categories.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;