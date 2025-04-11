import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getBlogPost, createBlogPost, updateBlogPost } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen, ArrowLeft } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogFormPage = () => {
  const { isAdmin } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;
  const [formData, setFormData] = useState({
    title: "",
    titleTag: "",
    slug: "",
    metaDescription: "",
    content: "",
    excerpt: "",
    images: [],
    categories: "",
    tags: "",
    keywords: "",
    author: "",
    date: "",
    readTime: "",
    published: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    if (isEdit && slug) {
      fetchBlogPost();
    } else if (isEdit && !slug) {
      toast.error("Invalid blog post slug");
      navigate("/admin/blog");
    }
  }, [isAdmin, isEdit, slug, navigate]);

  const fetchBlogPost = async () => {
    try {
      const post = await getBlogPost(slug);
      setFormData({
        title: post.title,
        titleTag: post.titleTag,
        slug: post.slug,
        metaDescription: post.metaDescription,
        content: post.content,
        excerpt: post.excerpt,
        images: post.images,
        categories: post.categories.join(", "),
        tags: post.tags.join(", "), // Convert array to comma-separated string for form
        keywords: post.keywords.join(", "),
        author: post.author,
        date: new Date(post.date).toISOString().split("T")[0],
        readTime: post.readTime.toString(),
        published: post.published
      });
    } catch (err) {
      console.error("Error fetching blog post:", err);
      toast.error("Failed to load blog post");
      navigate("/admin/blog");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setFormData(prev => ({
      ...prev,
      images: files.map(file => ({
        url: URL.createObjectURL(file),
        altText: prev.images.find(img => img.url.includes(file.name))?.altText || ""
      }))
    }));
  };

  const handleAltTextChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? { ...img, altText: value } : img)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("titleTag", formData.titleTag);
      data.append("slug", formData.slug);
      data.append("metaDescription", formData.metaDescription);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("categories", JSON.stringify(formData.categories.split(",").map(s => s.trim()).filter(Boolean)));
      data.append("tags", JSON.stringify(formData.tags.split(",").map(s => s.trim()).filter(Boolean))); // Convert to array of strings
      data.append("keywords", JSON.stringify(formData.keywords.split(",").map(s => s.trim()).filter(Boolean)));
      data.append("author", formData.author);
      data.append("date", formData.date);
      data.append("readTime", formData.readTime);
      data.append("published", formData.published);

      imageFiles.forEach(file => {
        data.append("images", file);
        data.append(`altText_${file.name}`, formData.images.find(img => img.url.includes(file.name))?.altText || "");
      });

      if (isEdit) {
        await updateBlogPost(slug, data);
        toast.success("Blog post updated successfully");
      } else {
        await createBlogPost(data);
        toast.success("Blog post created successfully");
      }

      navigate("/admin/blog");
    } catch (err) {
      console.error("Error saving blog post:", err);
      toast.error(err.message || "Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-4 text-center text-eco-dark">Access denied. Admin only.</div>;
  }

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-heading text-eco-dark">
            {isEdit ? "Edit Blog Post" : "Create Blog Post"}
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/blog")}
            className="border-eco text-eco-dark hover:bg-eco-light h-8 text-sm"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-sm text-eco-dark">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
            <div>
              <Label htmlFor="titleTag" className="text-sm text-eco-dark">
                Title Tag ({formData.titleTag.length}/60)
              </Label>
              <Input
                id="titleTag"
                name="titleTag"
                value={formData.titleTag}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
                maxLength={60}
              />
            </div>
            <div>
              <Label htmlFor="slug" className="text-sm text-eco-dark">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription" className="text-sm text-eco-dark">
                Meta Description ({formData.metaDescription.length}/160)
              </Label>
              <Input
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
                maxLength={160}
              />
            </div>
            <div>
              <Label htmlFor="excerpt" className="text-sm text-eco-dark">
                Excerpt ({formData.excerpt.length}/150)
              </Label>
              <Input
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
                maxLength={150}
              />
            </div>
            <div>
              <Label htmlFor="author" className="text-sm text-eco-dark">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-sm text-eco-dark">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
            <div>
              <Label htmlFor="readTime" className="text-sm text-eco-dark">Read Time (minutes)</Label>
              <Input
                id="readTime"
                name="readTime"
                type="number"
                value={formData.readTime}
                onChange={handleInputChange}
                required
                className="h-8 text-sm border-eco-light"
                min={1}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-sm text-eco-dark">Content</Label>
            <ReactQuill
              id="content"
              value={formData.content}
              onChange={handleContentChange}
              className="bg-white"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  ['image', 'link'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['clean']
                ]
              }}
            />
          </div>

          <div>
            <Label htmlFor="categories" className="text-sm text-eco-dark">Categories (comma-separated)</Label>
            <Input
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              className="h-8 text-sm border-eco-light"
              placeholder="e.g., Sustainability, Packaging"
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-sm text-eco-dark">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="h-8 text-sm border-eco-light"
              placeholder="e.g., eco-friendly, green"
            />
          </div>

          <div>
            <Label htmlFor="keywords" className="text-sm text-eco-dark">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="h-8 text-sm border-eco-light"
              placeholder="e.g., sustainable packaging, eco products"
            />
          </div>

          <div>
            <Label htmlFor="images" className="text-sm text-eco-dark">Images (up to 5)</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="h-8 text-sm border-eco-light"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img src={img.url} alt={img.altText} className="w-16 h-16 object-cover rounded" />
                    <Input
                      value={img.altText}
                      onChange={(e) => handleAltTextChange(index, e.target.value)}
                      placeholder="Alt text"
                      className="h-8 text-sm border-eco-light flex-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="published" className="text-sm text-eco-dark">Published</Label>
            <Input
              id="published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-eco hover:bg-eco-dark text-white h-8 text-sm"
          >
            <BookOpen className="mr-1 h-4 w-4" />
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogFormPage;