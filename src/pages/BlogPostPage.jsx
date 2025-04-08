import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Tag, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getBlogPost, getRelatedPosts } from "@/utils/api";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const blogPostData = await getBlogPost(parseInt(id));
        setPost(blogPostData);
        
        const related = await getRelatedPosts(parseInt(id));
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error("Failed to load this article");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);
  
  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post?.title || "Eco Packaging Article";
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full animate-pulse mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="bg-eco py-12">
        <div className="container-custom text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {post.categories.map(category => (
                <Badge key={category} className="bg-white/20 hover:bg-white/30">
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm opacity-90">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {post.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-8">
              <article className="prose prose-lg max-w-none">
                <p className="text-lg font-medium mb-6">{post.excerpt}</p>
                
                <p>
                  In today's increasingly environmentally conscious world, businesses are
                  under growing pressure to adopt sustainable practices. One of the most
                  visible aspects of a company's commitment to sustainability is its
                  choice of packaging materials.
                </p>
                
                <h2>The Impact of Traditional Packaging</h2>
                <p>
                  Traditional packaging materials, particularly single-use plastics, have
                  a significant environmental footprint. According to recent studies, plastic
                  packaging accounts for nearly 40% of all plastic production worldwide, with
                  the majority ending up in landfills or the natural environment.
                </p>
                
                <p>
                  The consequences of this waste are far-reaching:
                </p>
                
                <ul>
                  <li>Marine pollution affecting wildlife and ecosystems</li>
                  <li>Microplastics entering the food chain</li>
                  <li>Greenhouse gas emissions from production and disposal</li>
                  <li>Limited recycling capabilities for many plastic types</li>
                </ul>
                
                <h2>Benefits of Eco-Friendly Alternatives</h2>
                <p>
                  Non-woven bags and other sustainable packaging options offer numerous
                  advantages over conventional materials:
                </p>
                
                <h3>Environmental Benefits</h3>
                <p>
                  Eco-friendly packaging solutions like those offered by Eco Packaging Products Inc.
                  are designed to minimize environmental impact through biodegradability,
                  reduced resource consumption, and lower carbon emissions during production.
                </p>
                
                <h3>Business Advantages</h3>
                <p>
                  Beyond the environmental benefits, sustainable packaging can provide
                  significant business advantages:
                </p>
                
                <ul>
                  <li>Enhanced brand image and consumer perception</li>
                  <li>Meeting evolving consumer expectations</li>
                  <li>Potential cost savings through material efficiency</li>
                  <li>Compliance with emerging regulations</li>
                  <li>Competitive differentiation in the marketplace</li>
                </ul>
                
                <blockquote>
                  "The most successful businesses of tomorrow will be those that integrate
                  sustainability into their core operations today. Packaging represents one
                  of the most visible and impactful opportunities to demonstrate this commitment."
                </blockquote>
                
                <h2>Implementing Sustainable Packaging</h2>
                <p>
                  Transitioning to eco-friendly packaging requires careful planning and
                  consideration of various factors:
                </p>
                
                <ol>
                  <li>Assessing current packaging usage and environmental impact</li>
                  <li>Identifying suitable sustainable alternatives</li>
                  <li>Evaluating costs and logistical considerations</li>
                  <li>Communicating changes to consumers and stakeholders</li>
                  <li>Monitoring and measuring environmental benefits</li>
                </ol>
                
                <h2>Conclusion</h2>
                <p>
                  The shift toward sustainable packaging is not merely a trend but a
                  fundamental transformation in how businesses operate. By embracing
                  eco-friendly packaging solutions, companies can reduce their environmental
                  footprint while positioning themselves favorably in an increasingly
                  conscientious marketplace.
                </p>
                
                <p>
                  At Eco Packaging Products Inc., we're committed to helping businesses
                  navigate this transition with innovative, high-quality packaging solutions
                  that meet both environmental and business objectives.
                </p>
              </article>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag size={18} className="text-muted-foreground mr-2" />
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-muted-foreground font-medium flex items-center">
                    <Share2 size={18} className="mr-2" />
                    Share:
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full w-9 h-9 p-0"
                    onClick={() => sharePost("facebook")}
                  >
                    <Facebook size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full w-9 h-9 p-0"
                    onClick={() => sharePost("twitter")}
                  >
                    <Twitter size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full w-9 h-9 p-0"
                    onClick={() => sharePost("linkedin")}
                  >
                    <Linkedin size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <Link to="/blog" className="inline-flex items-center text-eco hover:underline">
                <ArrowLeft size={18} className="mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-eco-paper">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover h-full">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Calendar size={12} className="mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-eco transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <p className="text-sm text-eco font-medium inline-flex items-center">
                        Read More
                        <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;