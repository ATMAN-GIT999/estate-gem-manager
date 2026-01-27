import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, FileText, BarChart3, Calendar, Settings, TrendingUp, Users, 
  ArrowRight, Eye, DollarSign, Megaphone, MessageCircle, Plus, Edit, 
  Trash2, CheckCircle2, Clock, AlertCircle, Instagram, Youtube, Globe,
  Target, Zap, ClipboardList, UserPlus, Mail, Phone, Search, RefreshCw,
  Sparkles, TrendingDown, Activity, LayoutGrid, List, PenSquare, Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import MessengerButton from "@/components/admin/MessengerButton";
import EditModeToggle from "@/components/admin/EditModeToggle";
import EditableText from "@/components/admin/EditableText";

interface DashboardStats {
  propertyCount: number;
  bookingCount: number;
  blogCount: number;
  weeklyEvents: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
}

interface Property {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  featured: boolean;
  available: boolean;
  images: any;
  type: string;
}

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
  property_id: string;
  properties?: { name: string };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [propertyView, setPropertyView] = useState<"grid" | "list">("grid");
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, task: "Check new booking inquiries", completed: false, priority: "high" },
    { id: 2, task: "Respond to guest messages (< 1 hour)", completed: false, priority: "high" },
    { id: 3, task: "Review today's check-ins/check-outs", completed: false, priority: "high" },
    { id: 4, task: "Update property availability calendars", completed: false, priority: "medium" },
    { id: 5, task: "Post on Instagram (property showcase)", completed: false, priority: "medium" },
    { id: 6, task: "Review and respond to new reviews", completed: false, priority: "medium" },
    { id: 7, task: "Check cleaning team schedule", completed: false, priority: "low" },
    { id: 8, task: "Scrape 10 new potential owner contacts", completed: false, priority: "low" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, bookRes, blogRes, eventsRes] = await Promise.all([
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        ]);

        const [propsData, bookingsData, revenueData, pendingData, confirmedData] = await Promise.all([
          supabase.from('properties').select('*').order('created_at', { ascending: false }),
          supabase.from('bookings').select('*, properties(name)').order('created_at', { ascending: false }),
          supabase.from('bookings').select('total_price'),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        ]);

        const totalRevenue = revenueData.data?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0;

        setStats({
          propertyCount: propRes.count || 0,
          bookingCount: bookRes.count || 0,
          blogCount: blogRes.count || 0,
          weeklyEvents: eventsRes.count || 0,
          totalRevenue,
          pendingBookings: pendingData.count || 0,
          confirmedBookings: confirmedData.count || 0,
        });

        setProperties(propsData.data || []);
        setBookings(bookingsData.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  const toggleTask = (id: number) => {
    setDailyTasks(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const taskProgress = (completedTasks / dailyTasks.length) * 100;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <EditableText
                  id="dashboard-title"
                  value="Admin Dashboard"
                  onChange={() => {}}
                  as="h1"
                  className="font-playfair text-4xl font-bold text-primary mb-2"
                >
                  Admin Dashboard
                </EditableText>
                <EditableText
                  id="dashboard-subtitle"
                  value="Manage your luxury property portfolio"
                  onChange={() => {}}
                  as="p"
                  className="text-muted-foreground"
                >
                  Manage your luxury property portfolio
                </EditableText>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live data
              </div>
            </div>
            
            {/* Edit Mode Toggle Button */}
            <EditModeToggle />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Properties</p>
                      {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                        <p className="text-3xl font-bold text-primary">{stats?.propertyCount}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                      {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.bookingCount}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      {loading ? <Skeleton className="h-8 w-24 mt-1" /> : (
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                          {formatCurrency(stats?.totalRevenue || 0)}
                        </p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                      {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                        <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats?.weeklyEvents}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="properties" className="gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Properties</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="actions" className="gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Actions</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Daily SOP Checklist */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Daily SOP Checklist</CardTitle>
                            <CardDescription>Standard operating procedures for growth</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {completedTasks}/{dailyTasks.length} completed
                        </Badge>
                      </div>
                      <Progress value={taskProgress} className="mt-3" />
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {dailyTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className={`p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${task.completed ? 'opacity-60' : ''}`}
                          >
                            <Checkbox 
                              checked={task.completed} 
                              onCheckedChange={() => toggleTask(task.id)}
                            />
                            <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.task}
                            </span>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats Summary */}
                  <Card>
                    <CardHeader className="border-b bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span>Confirmed Bookings</span>
                        </div>
                        <span className="font-bold text-green-600">{stats?.confirmedBookings || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <span>Pending Bookings</span>
                        </div>
                        <span className="font-bold text-amber-600">{stats?.pendingBookings || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span>Blog Posts</span>
                        </div>
                        <span className="font-bold text-blue-600">{stats?.blogCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-violet-600" />
                          <span>Page Views</span>
                        </div>
                        <span className="font-bold text-violet-600">{stats?.weeklyEvents || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={propertyView === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyView("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={propertyView === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link to="/admin/properties">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                  </div>
                ) : propertyView === "grid" ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-muted relative">
                          {property.images?.[0] ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {property.featured && (
                              <Badge className="bg-amber-500">Featured</Badge>
                            )}
                            <Badge variant={property.available ? "default" : "destructive"}>
                              {property.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold truncate">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span>{property.bedrooms} beds</span>
                            <span>•</span>
                            <span>{property.bathrooms} baths</span>
                            <span>•</span>
                            <span>{property.guests} guests</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="font-bold text-primary">{formatCurrency(property.price_per_night)}/night</p>
                            <Link to="/admin/properties">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="divide-y">
                      {properties.map((property) => (
                        <div key={property.id} className="p-4 flex items-center gap-4 hover:bg-muted/50">
                          <div className="w-20 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                            {property.images?.[0] ? (
                              <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-6 w-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{property.name}</h3>
                              {property.featured && <Badge variant="secondary">Featured</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {property.location} • {property.type} • {property.bedrooms} beds
                            </p>
                          </div>
                          <Badge variant={property.available ? "default" : "destructive"}>
                            {property.available ? "Available" : "Unavailable"}
                          </Badge>
                          <p className="font-bold text-primary shrink-0">{formatCurrency(property.price_per_night)}</p>
                          <Link to="/admin/properties">
                            <Button size="sm" variant="outline">Edit</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1.5">
                      All: {bookings.length}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1.5">
                      Confirmed: {bookings.filter(b => b.status === 'confirmed').length}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-3 py-1.5">
                      Pending: {bookings.filter(b => b.status === 'pending').length}
                    </Badge>
                  </div>
                  <Link to="/admin/bookings">
                    <Button variant="outline">
                      View All Bookings
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-4">
                  {loading ? (
                    [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg">{booking.guest_name}</h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Property: <span className="font-medium">{booking.properties?.name || 'Unknown'}</span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <p className="text-2xl font-bold text-primary">{formatCurrency(booking.total_price)}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                {/* Website Performance */}
                <Card>
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Website Performance</CardTitle>
                        <CardDescription>Traffic and engagement metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <Eye className="h-6 w-6 mx-auto mb-2 text-violet-600" />
                        <p className="text-2xl font-bold">{stats?.weeklyEvents || 0}</p>
                        <p className="text-sm text-muted-foreground">Page Views</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">{Math.floor((stats?.weeklyEvents || 0) * 0.6)}</p>
                        <p className="text-sm text-muted-foreground">Unique Visitors</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">2.4%</p>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                        <p className="text-2xl font-bold">3:24</p>
                        <p className="text-sm text-muted-foreground">Avg. Session</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Paid Ads Performance */}
                <Card>
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Paid Ads Performance</CardTitle>
                        <CardDescription>Google Ads, Meta Ads, and more</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <Megaphone className="h-6 w-6 mx-auto mb-2 text-pink-600" />
                        <p className="text-2xl font-bold">€2,450</p>
                        <p className="text-sm text-muted-foreground">Ad Spend</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">45.2K</p>
                        <p className="text-sm text-muted-foreground">Impressions</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">3.8x</p>
                        <p className="text-sm text-muted-foreground">ROAS</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                        <p className="text-2xl font-bold">€24.50</p>
                        <p className="text-sm text-muted-foreground">CPA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Organic Traffic Sources */}
                <Card>
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Organic Traffic Sources</CardTitle>
                        <CardDescription>Social media and search performance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Instagram className="h-5 w-5 text-pink-600" />
                          <span className="font-semibold">Instagram</span>
                        </div>
                        <p className="text-2xl font-bold">1,234</p>
                        <p className="text-sm text-muted-foreground">Visits</p>
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3" />
                          +12.5%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Youtube className="h-5 w-5 text-red-600" />
                          <span className="font-semibold">YouTube</span>
                        </div>
                        <p className="text-2xl font-bold">567</p>
                        <p className="text-sm text-muted-foreground">Visits</p>
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3" />
                          +8.2%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          <span className="font-semibold">TikTok</span>
                        </div>
                        <p className="text-2xl font-bold">892</p>
                        <p className="text-sm text-muted-foreground">Visits</p>
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3" />
                          +45.3%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Search className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">Google</span>
                        </div>
                        <p className="text-2xl font-bold">3,456</p>
                        <p className="text-sm text-muted-foreground">Visits</p>
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                          <TrendingUp className="h-3 w-3" />
                          +5.7%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Actions Tab */}
              <TabsContent value="actions" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Content Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-orange-50 dark:bg-orange-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-orange-600" />
                        Content Creation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link to="/admin/blog">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <FileText className="h-4 w-4" />
                          Write Blog Post
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Instagram className="h-4 w-4" />
                        Create Instagram Post
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Youtube className="h-4 w-4" />
                        Plan YouTube Video
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Marketing Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-pink-50 dark:bg-pink-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-pink-600" />
                        Marketing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link to="/admin/marketing">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Target className="h-4 w-4" />
                          Create Ad Campaign
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Mail className="h-4 w-4" />
                        Send Newsletter
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Retargeting Setup
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Sales Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-green-50 dark:bg-green-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-green-600" />
                        Lead Generation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Search className="h-4 w-4" />
                        Scrape Owner Contacts
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Phone className="h-4 w-4" />
                        Cold Outreach List
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Send className="h-4 w-4" />
                        Send Owner Proposal
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Operations Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-blue-50 dark:bg-blue-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Operations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link to="/admin/bookings">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Process Bookings
                        </Button>
                      </Link>
                      <Link to="/admin/calendar">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Calendar className="h-4 w-4" />
                          Manage Calendar
                        </Button>
                      </Link>
                      <Link to="/admin/messages">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Reply to Guests
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Property Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-violet-50 dark:bg-violet-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5 text-violet-600" />
                        Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link to="/admin/properties">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Property
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Edit className="h-4 w-4" />
                        Update Pricing
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Sync with Guesty
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Settings Actions */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/20">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-slate-600" />
                        Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Link to="/admin/settings">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Settings className="h-4 w-4" />
                          Homepage Settings
                        </Button>
                      </Link>
                      <Link to="/admin/analytics">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <BarChart3 className="h-4 w-4" />
                          View Analytics
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Globe className="h-4 w-4" />
                        SEO Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <MessengerButton />
    </div>
  );
};

export default AdminDashboard;
