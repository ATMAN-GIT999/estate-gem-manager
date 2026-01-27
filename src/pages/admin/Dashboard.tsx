import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, BarChart3, Calendar, Settings, TrendingUp, Users, Home, ArrowRight, Eye, DollarSign, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  propertyCount: number;
  bookingCount: number;
  blogCount: number;
  weeklyEvents: number;
  totalRevenue: number;
}

interface Property {
  name: string;
  location: string;
  price_per_night: number;
  bedrooms: number;
  featured: boolean;
}

interface Booking {
  guest_name: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const [propRes, bookRes, blogRes, eventsRes] = await Promise.all([
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        ]);

        // Fetch recent data
        const [propsData, bookingsData, revenueData] = await Promise.all([
          supabase.from('properties').select('name, location, price_per_night, bedrooms, featured').order('created_at', { ascending: false }).limit(4),
          supabase.from('bookings').select('guest_name, check_in, check_out, status, total_price').order('created_at', { ascending: false }).limit(4),
          supabase.from('bookings').select('total_price'),
        ]);

        const totalRevenue = revenueData.data?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0;

        setStats({
          propertyCount: propRes.count || 0,
          bookingCount: bookRes.count || 0,
          blogCount: blogRes.count || 0,
          weeklyEvents: eventsRes.count || 0,
          totalRevenue,
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your luxury property portfolio</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live data
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Properties</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
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
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
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
                    {loading ? (
                      <Skeleton className="h-8 w-24 mt-1" />
                    ) : (
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
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
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

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Properties Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Properties</CardTitle>
                      <CardDescription>Manage property listings</CardDescription>
                    </div>
                  </div>
                  <Link to="/admin/properties" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : properties.length > 0 ? (
                  <div className="divide-y">
                    {properties.map((property, index) => (
                      <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{property.name}</p>
                              {property.featured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{property.location} • {property.bedrooms} beds</p>
                          </div>
                          <p className="font-semibold text-primary">{formatCurrency(property.price_per_night)}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No properties yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Recent Bookings</CardTitle>
                      <CardDescription>View and manage bookings</CardDescription>
                    </div>
                  </div>
                  <Link to="/admin/bookings" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="divide-y">
                    {bookings.map((booking, index) => (
                      <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{booking.guest_name}</p>
                              <Badge className={getStatusColor(booking.status)} variant="secondary">
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No bookings yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/blog">
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Blog Posts</h3>
                      <p className="text-sm text-muted-foreground">
                        {loading ? '...' : `${stats?.blogCount} posts`} • Create and edit content
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/analytics">
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Analytics</h3>
                      <p className="text-sm text-muted-foreground">View website statistics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/settings">
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Homepage Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure homepage layout</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/marketing">
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Megaphone className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Marketing Analytics</h3>
                      <p className="text-sm text-muted-foreground">Campaigns & conversions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
