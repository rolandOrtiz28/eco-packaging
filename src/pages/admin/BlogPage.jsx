import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getBlogPosts, deleteBlogPost } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const BlogAdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteSlug, setDeleteSlug] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPosts();
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const response = await getBlogPosts();
      console.log("getBlogPosts response:", response); // Debug the response
      const postsData = response?.posts || []; // Fallback to empty array if posts is undefined
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      toast.error("Failed to fetch blog posts");
      setPosts([]); // Ensure posts is an array even on error
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlogPost(deleteSlug);
      setPosts(posts.filter(post => post.slug !== deleteSlug));
      setDeleteSlug(null);
      toast.success("Blog post deleted successfully");
    } catch (err) {
      console.error("Error deleting blog post:", err);
      toast.error("Failed to delete blog post");
    }
  };

  if (!isAdmin) {
    return <div className="p-4 text-center text-eco-dark">Access denied. Admin only.</div>;
  }

  // Guard against undefined posts
  const filteredPosts = (posts || []).filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Manage Blog Posts</h1>
            <p className="text-sm text-muted-foreground">Create and manage blog posts</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blog posts..."
                className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => navigate("/admin/blog/new")}
              className="bg-eco hover:bg-eco-dark text-white h-8 text-sm"
            >
              <BookOpen className="mr-1 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <Card key={post.id} className="border-eco-light">
                <CardContent className="flex justify-between items-center p-3">
                  <div className="text-sm text-eco-dark">
                    <span className="font sufficient">{post.title}</span> | Slug: {post.slug} | 
                    {post.published ? ' Published' : ' Draft'} | 
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                      className="text-eco-dark hover:text-eco hover:bg-eco-light h-8"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Dialog open={deleteSlug === post.slug} onOpenChange={(open) => setDeleteSlug(open ? post.slug : null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-eco-dark hover:text-red-600 hover:bg-eco-light h-8"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-heading text-eco-dark">Delete Blog Post</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-eco-dark">Are you sure you want to delete "{post.title}"? This action cannot be undone.</p>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteSlug(null)}
                            className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm"
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No blog posts found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogAdminPage;