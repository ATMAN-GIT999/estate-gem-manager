import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Home,
  ListTodo,
  FileText,
  Gift,
  Users,
  Plus,
  Save,
  X,
  Tag,
  Mail,
  Phone,
  Building2,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Edit,
  Search,
  Upload,
  DollarSign,
  Calendar,
  Percent,
  MapPin,
  Bed,
  Bath,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Types
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface OfferTask {
  id: string;
  text: string;
  completed: boolean;
}

interface Contact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  tags: string[];
  notes: string;
}

interface Offer {
  id?: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: string;
  target_audience: string;
  tasks: OfferTask[];
  max_redemptions: number;
}

const creationTabs = [
  { id: "property", label: "Property", icon: Home, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { id: "todo", label: "Todo List", icon: ListTodo, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { id: "blog", label: "Blog Post", icon: FileText, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { id: "offer", label: "Offer", icon: Gift, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { id: "contact", label: "Contacts", icon: Users, color: "text-rose-500", bgColor: "bg-rose-500/10" },
];

export default function CreatePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("property");
  const [saving, setSaving] = useState(false);

  // Property state
  const [propertyForm, setPropertyForm] = useState({
    name: "",
    location: "",
    address: "",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    price_per_night: 100,
    description: "",
  });

  // Todo state
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [todoPriority, setTodoPriority] = useState<"low" | "medium" | "high">("medium");

  // Blog state
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
  });

  // Offer state
  const [offerForm, setOfferForm] = useState<Offer>({
    title: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    start_date: "",
    end_date: "",
    status: "draft",
    target_audience: "",
    tasks: [],
    max_redemptions: 100,
  });
  const [newOfferTask, setNewOfferTask] = useState("");

  // Contact state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactForm, setContactForm] = useState<Contact>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    status: "lead",
    tags: [],
    notes: "",
  });
  const [contactTagInput, setContactTagInput] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Handlers
  const handleSaveProperty = async () => {
    if (!propertyForm.name || !propertyForm.location) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const slug = propertyForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const { error } = await supabase.from("properties").insert({
      ...propertyForm,
      slug,
      available: true,
      featured: false,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Property created successfully" });
      setPropertyForm({
        name: "",
        location: "",
        address: "",
        type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        price_per_night: 100,
        description: "",
      });
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now().toString(), text: newTodo, completed: false, priority: todoPriority },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.content) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const { error } = await supabase.from("blog_posts").insert({
      title: blogForm.title,
      slug,
      content: blogForm.content,
      excerpt: blogForm.excerpt,
      category: blogForm.category,
      tags: blogForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: false,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Blog post created as draft" });
      setBlogForm({ title: "", slug: "", content: "", excerpt: "", category: "", tags: "" });
    }
  };

  const handleAddOfferTask = () => {
    if (!newOfferTask.trim()) return;
    setOfferForm({
      ...offerForm,
      tasks: [...offerForm.tasks, { id: Date.now().toString(), text: newOfferTask, completed: false }],
    });
    setNewOfferTask("");
  };

  const toggleOfferTask = (id: string) => {
    setOfferForm({
      ...offerForm,
      tasks: offerForm.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    });
  };

  const getOfferCompletion = () => {
    if (offerForm.tasks.length === 0) return 0;
    return Math.round((offerForm.tasks.filter((t) => t.completed).length / offerForm.tasks.length) * 100);
  };

  const handleSaveOffer = async () => {
    if (!offerForm.title) {
      toast({ title: "Error", description: "Offer title is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("offers").insert({
      title: offerForm.title,
      description: offerForm.description,
      discount_type: offerForm.discount_type,
      discount_value: offerForm.discount_value,
      start_date: offerForm.start_date || null,
      end_date: offerForm.end_date || null,
      status: offerForm.status,
      target_audience: offerForm.target_audience,
      tasks: JSON.parse(JSON.stringify(offerForm.tasks)),
      max_redemptions: offerForm.max_redemptions,
      completion_percentage: getOfferCompletion(),
    } as any);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Offer created successfully" });
      setOfferForm({
        title: "",
        description: "",
        discount_type: "percentage",
        discount_value: 10,
        start_date: "",
        end_date: "",
        status: "draft",
        target_audience: "",
        tasks: [],
        max_redemptions: 100,
      });
    }
  };

  const handleAddContactTag = () => {
    if (!contactTagInput.trim()) return;
    if (!contactForm.tags.includes(contactTagInput.trim())) {
      setContactForm({ ...contactForm, tags: [...contactForm.tags, contactTagInput.trim()] });
    }
    setContactTagInput("");
  };

  const removeContactTag = (tag: string) => {
    setContactForm({ ...contactForm, tags: contactForm.tags.filter((t) => t !== tag) });
  };

  const handleSaveContact = async () => {
    if (!contactForm.first_name) {
      toast({ title: "Error", description: "First name is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { data, error } = await supabase.from("contacts").insert({
      first_name: contactForm.first_name,
      last_name: contactForm.last_name,
      email: contactForm.email || null,
      phone: contactForm.phone || null,
      company: contactForm.company || null,
      source: contactForm.source,
      status: contactForm.status,
      tags: contactForm.tags,
      notes: contactForm.notes || null,
    }).select();

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Contact added to database" });
      if (data) {
        setContacts([...contacts, data[0] as Contact]);
      }
      setContactForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        status: "lead",
        tags: [],
        notes: "",
      });
      setShowContactDialog(false);
    }
  };

  const priorityColors = {
    low: "bg-slate-500/20 text-slate-600",
    medium: "bg-amber-500/20 text-amber-600",
    high: "bg-rose-500/20 text-rose-600",
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create</h1>
              <p className="text-sm text-muted-foreground">Create new content and manage your database</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid grid-cols-5 h-auto p-1 bg-muted/50">
              {creationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "flex flex-col gap-1 py-3 data-[state=active]:bg-background",
                      "data-[state=active]:shadow-sm"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg", tab.bgColor)}>
                      <Icon className={cn("h-5 w-5", tab.color)} />
                    </div>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Property Tab */}
            <TabsContent value="property" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-emerald-500" />
                    Create Property Listing
                  </CardTitle>
                  <CardDescription>Add a new property to your portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Name *</Label>
                      <Input
                        placeholder="e.g., Luxury Beach Villa"
                        value={propertyForm.name}
                        onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g., Marbella, Spain"
                          className="pl-9"
                          value={propertyForm.location}
                          onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Full Address</Label>
                      <Input
                        placeholder="Full street address"
                        value={propertyForm.address}
                        onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select
                        value={propertyForm.type}
                        onValueChange={(v) => setPropertyForm({ ...propertyForm, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="penthouse">Penthouse</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Night (€)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9"
                          value={propertyForm.price_per_night}
                          onChange={(e) => setPropertyForm({ ...propertyForm, price_per_night: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Bed className="h-3 w-3" /> Bedrooms
                        </Label>
                        <Select
                          value={String(propertyForm.bedrooms)}
                          onValueChange={(v) => setPropertyForm({ ...propertyForm, bedrooms: Number(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Bath className="h-3 w-3" /> Bathrooms
                        </Label>
                        <Select
                          value={String(propertyForm.bathrooms)}
                          onValueChange={(v) => setPropertyForm({ ...propertyForm, bathrooms: Number(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> Guests
                        </Label>
                        <Select
                          value={String(propertyForm.guests)}
                          onValueChange={(v) => setPropertyForm({ ...propertyForm, guests: Number(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 4, 6, 8, 10, 12, 14, 16].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your property..."
                        rows={4}
                        value={propertyForm.description}
                        onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProperty} disabled={saving} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Property"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Todo Tab */}
            <TabsContent value="todo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-blue-500" />
                    Todo List
                  </CardTitle>
                  <CardDescription>Create and manage your task list</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new task..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                      className="flex-1"
                    />
                    <Select value={todoPriority} onValueChange={(v) => setTodoPriority(v as "low" | "medium" | "high")}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTodo}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {todos.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No tasks yet. Add your first task above!</p>
                        </div>
                      ) : (
                        todos.map((todo) => (
                          <div
                            key={todo.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all",
                              todo.completed && "opacity-60"
                            )}
                          >
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={() => toggleTodo(todo.id)}
                            />
                            <span className={cn("flex-1", todo.completed && "line-through text-muted-foreground")}>
                              {todo.text}
                            </span>
                            <Badge className={priorityColors[todo.priority]}>{todo.priority}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {todos.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        {todos.filter((t) => t.completed).length} of {todos.length} completed
                      </span>
                      <Progress value={(todos.filter((t) => t.completed).length / todos.length) * 100} className="w-32" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Create Blog Post
                  </CardTitle>
                  <CardDescription>Write and publish blog content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        placeholder="Your blog post title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug (URL)</Label>
                      <Input
                        placeholder="auto-generated-from-title"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={blogForm.category}
                        onValueChange={(v) => setBlogForm({ ...blogForm, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="tips">Tips & Guides</SelectItem>
                          <SelectItem value="market">Market Updates</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="marbella, luxury, property"
                          className="pl-9"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Excerpt</Label>
                      <Textarea
                        placeholder="Brief summary for previews..."
                        rows={2}
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Content *</Label>
                      <Textarea
                        placeholder="Write your blog post content here..."
                        rows={12}
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveBlog} disabled={saving} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save as Draft"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offer Tab */}
            <TabsContent value="offer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-amber-500" />
                    Create Offer
                  </CardTitle>
                  <CardDescription>Create promotional offers with a completion tracker</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Completion Tracker */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Offer Setup Progress</span>
                      <span className="text-sm font-bold text-amber-600">{getOfferCompletion()}%</span>
                    </div>
                    <Progress value={getOfferCompletion()} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Offer Title *</Label>
                      <Input
                        placeholder="e.g., Summer Special 2024"
                        value={offerForm.title}
                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={offerForm.status}
                        onValueChange={(v) => setOfferForm({ ...offerForm, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select
                        value={offerForm.discount_type}
                        onValueChange={(v) => setOfferForm({ ...offerForm, discount_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Off</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="free_nights">Free Nights</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9"
                          value={offerForm.discount_value}
                          onChange={(e) => setOfferForm({ ...offerForm, discount_value: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-9"
                          value={offerForm.start_date}
                          onChange={(e) => setOfferForm({ ...offerForm, start_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-9"
                          value={offerForm.end_date}
                          onChange={(e) => setOfferForm({ ...offerForm, end_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Input
                        placeholder="e.g., Returning guests, First-time bookers"
                        value={offerForm.target_audience}
                        onChange={(e) => setOfferForm({ ...offerForm, target_audience: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Redemptions</Label>
                      <Input
                        type="number"
                        value={offerForm.max_redemptions}
                        onChange={(e) => setOfferForm({ ...offerForm, max_redemptions: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your offer..."
                        rows={3}
                        value={offerForm.description}
                        onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Offer Setup Tasks */}
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Setup Tasks (for tracking completion)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a setup task..."
                        value={newOfferTask}
                        onChange={(e) => setNewOfferTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddOfferTask()}
                        className="flex-1"
                      />
                      <Button variant="secondary" onClick={handleAddOfferTask}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {offerForm.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleOfferTask(task.id)}
                          />
                          <span className={cn("flex-1 text-sm", task.completed && "line-through text-muted-foreground")}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveOffer} disabled={saving} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Offer"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-rose-500" />
                        Contacts Database
                      </CardTitle>
                      <CardDescription>Manage contacts for better ad targeting</CardDescription>
                    </div>
                    <Button onClick={() => setShowContactDialog(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts..."
                      className="pl-9"
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Total", value: contacts.length, color: "bg-blue-500/10 text-blue-600" },
                      { label: "Leads", value: contacts.filter((c) => c.status === "lead").length, color: "bg-amber-500/10 text-amber-600" },
                      { label: "Prospects", value: contacts.filter((c) => c.status === "prospect").length, color: "bg-purple-500/10 text-purple-600" },
                      { label: "Customers", value: contacts.filter((c) => c.status === "customer").length, color: "bg-emerald-500/10 text-emerald-600" },
                    ].map((stat) => (
                      <div key={stat.label} className={cn("p-4 rounded-xl text-center", stat.color)}>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Contacts List */}
                  <ScrollArea className="h-[400px]">
                    {contacts.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No contacts yet</p>
                        <p className="text-sm mt-1">Add your first contact to start building your database</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {contacts
                          .filter((c) =>
                            `${c.first_name} ${c.last_name} ${c.email} ${c.company}`
                              .toLowerCase()
                              .includes(contactSearch.toLowerCase())
                          )
                          .map((contact) => (
                            <div
                              key={contact.id}
                              className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all"
                            >
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center text-sm font-medium">
                                {contact.first_name[0]}{contact.last_name?.[0] || ""}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">
                                  {contact.first_name} {contact.last_name}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  {contact.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" /> {contact.email}
                                    </span>
                                  )}
                                  {contact.company && (
                                    <span className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3" /> {contact.company}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  contact.status === "customer" && "bg-emerald-500/10 text-emerald-600",
                                  contact.status === "lead" && "bg-amber-500/10 text-amber-600",
                                  contact.status === "prospect" && "bg-purple-500/10 text-purple-600"
                                )}
                              >
                                {contact.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {contact.source}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-rose-500" />
              Add New Contact
            </DialogTitle>
            <DialogDescription>Add a contact to your database for better targeting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  placeholder="John"
                  value={contactForm.first_name}
                  onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={contactForm.last_name}
                  onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="pl-9"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+34 612 345 678"
                    className="pl-9"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Company name"
                  className="pl-9"
                  value={contactForm.company}
                  onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={contactForm.source}
                  onValueChange={(v) => setContactForm({ ...contactForm, source: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="ad_campaign">Ad Campaign</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={contactForm.status}
                  onValueChange={(v) => setContactForm({ ...contactForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={contactTagInput}
                  onChange={(e) => setContactTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddContactTag()}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleAddContactTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {contactForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {contactForm.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeContactTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any additional notes..."
                rows={3}
                value={contactForm.notes}
                onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
              />
            </div>
            <Button onClick={handleSaveContact} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
