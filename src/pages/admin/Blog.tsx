import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, Eye, FileText, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BlogBuilder, { ContentBlock } from "@/components/admin/BlogBuilder";

const AdminBlog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    tags: "",
    featured_image: "",
    published: false,
  });
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch blog posts",
      });
    } else {
      setPosts(data || []);
    }
    setLoadingPosts(false);
  };

  const blocksToContent = (blocks: ContentBlock[]): string => {
    return JSON.stringify(blocks);
  };

  const contentToBlocks = (content: string): ContentBlock[] => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Legacy content - convert to paragraph block
      if (content) {
        return [{
          id: Math.random().toString(36).substring(2, 9),
          type: "paragraph",
          content: content,
          settings: { alignment: "left" }
        }];
      }
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const content = blocksToContent(contentBlocks);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: content,
      category: formData.category,
      tags: tagsArray,
      featured_image: formData.featured_image,
      published: formData.published,
      author_id: null,
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully" });
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast({ title: "Success", description: "Blog post created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      category: post.category || "",
      tags: post.tags?.join(", ") || "",
      featured_image: post.featured_image || "",
      published: post.published,
    });
    setContentBlocks(contentToBlocks(post.content));
    setActiveTab("content");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete blog post",
      });
    } else {
      toast({ title: "Success", description: "Blog post deleted" });
      fetchPosts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      category: "",
      tags: "",
      featured_image: "",
      published: false,
    });
    setContentBlocks([]);
    setEditingPost(null);
    setActiveTab("content");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/admin">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
                Blog Posts
              </h1>
              <p className="text-foreground/80">Create and manage your blog content with the visual builder</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          {loadingPosts ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first blog post using the visual builder
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            post.published 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {post.category && <span className="font-medium">{post.category}</span>}
                          {post.category && " • "}
                          <span>/{post.slug}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-foreground/70 line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Blog Editor Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle className="text-2xl">
                  {editingPost ? "Edit Blog Post" : "Create Blog Post"}
                </DialogTitle>
                <DialogDescription>
                  Use the visual builder to create your blog content
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
                    <TabsTrigger value="content" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Content Builder
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Post Settings
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-y-auto">
                    <TabsContent value="content" className="mt-0 h-full">
                      <div className="space-y-4">
                        {/* Title Input */}
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-base font-semibold">Post Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData({ 
                                ...formData, 
                                title: e.target.value,
                                slug: formData.slug || generateSlug(e.target.value)
                              });
                            }}
                            placeholder="Enter your post title..."
                            className="text-lg h-12"
                            required
                          />
                        </div>

                        {/* Blog Builder */}
                        <div className="space-y-2">
                          <Label className="text-base font-semibold">Post Content</Label>
                          <BlogBuilder
                            blocks={contentBlocks}
                            onChange={setContentBlocks}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                      <div className="space-y-6 p-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                              id="slug"
                              value={formData.slug}
                              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                              placeholder="my-blog-post"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              The URL path for this post: /blog/{formData.slug || "..."}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              placeholder="Travel, Lifestyle, etc."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Excerpt / Summary</Label>
                          <Input
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="A brief summary of your post..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Shown in post previews and search results
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="featured_image">Featured Image URL</Label>
                          <Input
                            id="featured_image"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                          {formData.featured_image && (
                            <div className="rounded-lg overflow-hidden border mt-2">
                              <img 
                                src={formData.featured_image} 
                                alt="Featured" 
                                className="w-full h-40 object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags</Label>
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="travel, luxury, marbella (comma-separated)"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div>
                            <Label htmlFor="published" className="text-base font-medium">Publish Post</Label>
                            <p className="text-sm text-muted-foreground">
                              Make this post visible to the public
                            </p>
                          </div>
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, published: checked })
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                <DialogFooter className="shrink-0 pt-4 border-t mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[120px]">
                    {editingPost ? "Update" : "Create"} Post
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminBlog;
