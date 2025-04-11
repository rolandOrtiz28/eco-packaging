import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, User, Tag, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getBlogPost, getRelatedPosts } from "@/utils/api";
import sanitizeHtml from "sanitize-html";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const blogPostData = await getBlogPost(slug);
        setPost(blogPostData);
        
        const related = await getRelatedPosts(slug);
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
  }, [slug]);
  
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

  // Ensure tags is an array
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="bg-background">
      <Helmet>
        <title>{post.titleTag}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta property="og:title" content={post.titleTag} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.images[0]?.url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.titleTag} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.images[0]?.url} />
        <script type="application/ld+json">
          {JSON.stringify(post.structuredData)}
        </script>
      </Helmet>

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
            {post.images.map((img, index) => (
              <div key={index} className="mb-8 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={img.url} 
                  alt={img.altText} 
                  className="w-full h-auto"
                  loading={index > 0 ? "lazy" : "eager"}
                />
              </div>
            ))}
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-8">
              <article className="prose prose-lg max-w-none">
                <p className="text-lg font-medium mb-6">{post.excerpt}</p>
                <div 
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(post.content, {
                      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src', 'alt'] }
                    })
                  }}
                />
              </article>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag size={18} className="text-muted-foreground mr-2" />
                  {tags.map(tag => (
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
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover h-full">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={post.images[0]?.url} 
                        alt={post.images[0]?.altText} 
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