import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  ArrowLeft,
  Eye,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Link2,
  Globe,
  Gauge,
  Target,
  Zap,
  BarChart3,
  Activity,
  MousePointer,
  Clock,
  FileSearch,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Workflow,
  Magnet,
  UserPlus,
  Mail,
  Filter,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for demonstration
const performanceData = [
  { date: "Mon", visitors: 120, pageViews: 340, bounceRate: 42 },
  { date: "Tue", visitors: 150, pageViews: 420, bounceRate: 38 },
  { date: "Wed", visitors: 180, pageViews: 510, bounceRate: 35 },
  { date: "Thu", visitors: 140, pageViews: 380, bounceRate: 40 },
  { date: "Fri", visitors: 200, pageViews: 580, bounceRate: 32 },
  { date: "Sat", visitors: 280, pageViews: 720, bounceRate: 28 },
  { date: "Sun", visitors: 220, pageViews: 600, bounceRate: 30 },
];

const seoMetrics = [
  { name: "Meta Tags", score: 92, status: "good", issues: 2 },
  { name: "Page Speed", score: 78, status: "warning", issues: 5 },
  { name: "Mobile Friendly", score: 95, status: "good", issues: 1 },
  { name: "Content Quality", score: 85, status: "good", issues: 3 },
  { name: "Structured Data", score: 70, status: "warning", issues: 4 },
  { name: "Internal Links", score: 88, status: "good", issues: 2 },
];

const backlinks = [
  { domain: "realestate-spain.com", authority: 72, status: "active", type: "dofollow" },
  { domain: "marbella-guide.es", authority: 65, status: "active", type: "dofollow" },
  { domain: "luxury-homes.eu", authority: 58, status: "pending", type: "dofollow" },
  { domain: "travel-costa.com", authority: 45, status: "active", type: "nofollow" },
  { domain: "invest-spain.net", authority: 52, status: "lost", type: "dofollow" },
];

const visitorWorkflows = [
  {
    id: "1",
    name: "Property Inquiry Capture",
    description: "Capture leads from property detail page visits",
    trigger: "Page view > 30 seconds",
    action: "Show contact popup",
    conversions: 127,
    status: "active",
  },
  {
    id: "2", 
    name: "Exit Intent Offer",
    description: "Show special offer when visitor is about to leave",
    trigger: "Exit intent detected",
    action: "Display 10% discount",
    conversions: 89,
    status: "active",
  },
  {
    id: "3",
    name: "Returning Visitor Recognition",
    description: "Personalize experience for returning visitors",
    trigger: "Cookie detection",
    action: "Show saved properties",
    conversions: 56,
    status: "paused",
  },
  {
    id: "4",
    name: "Booking Abandonment",
    description: "Follow up on incomplete bookings",
    trigger: "Cart abandonment",
    action: "Send reminder email",
    conversions: 34,
    status: "active",
  },
];

const scrapedContacts = [
  { source: "LinkedIn", count: 245, quality: "high", lastSync: "2 hours ago" },
  { source: "Instagram", count: 189, quality: "medium", lastSync: "5 hours ago" },
  { source: "Website Forms", count: 512, quality: "high", lastSync: "Live" },
  { source: "Booking Inquiries", count: 78, quality: "high", lastSync: "1 hour ago" },
];

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ pageViews: 0, uniqueVisitors: 0, bookings: 0 });
  const [activeTab, setActiveTab] = useState("overview");
  const [newBacklinkUrl, setNewBacklinkUrl] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const { data: events } = await supabase.from("analytics_events").select("*");
      const { data: bookings } = await supabase.from("bookings").select("id");
      
      setStats({
        pageViews: events?.length || 0,
        uniqueVisitors: new Set(events?.map(e => e.session_id)).size,
        bookings: bookings?.length || 0,
      });
    };
    fetchStats();
  }, []);

  const overallSeoScore = Math.round(seoMetrics.reduce((acc, m) => acc + m.score, 0) / seoMetrics.length);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10";
    if (score >= 60) return "bg-amber-500/10";
    return "bg-rose-500/10";
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics & Performance</h1>
              <p className="text-sm text-muted-foreground">
                Track website performance, SEO metrics, and visitor conversion workflows
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* How It Works Section */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  How Analytics & Visitor Extraction Works
                </CardTitle>
                <CardDescription className="text-base">
                  Generate attention and extract actionable outputs from every website visitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-background/80 border space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Magnet className="h-5 w-5 text-blue-500" />
                    </div>
                    <h4 className="font-semibold">1. Attract Traffic</h4>
                    <p className="text-sm text-muted-foreground">
                      SEO optimization & backlinks drive organic visitors to your properties
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/80 border space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-amber-500" />
                    </div>
                    <h4 className="font-semibold">2. Track Behavior</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor page views, time on site, clicks, and engagement patterns
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/80 border space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-purple-500" />
                    </div>
                    <h4 className="font-semibold">3. Capture Leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated workflows trigger popups, forms & offers at optimal moments
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/80 border space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h4 className="font-semibold">4. Convert & Retarget</h4>
                    <p className="text-sm text-muted-foreground">
                      Export contacts to CRM, run targeted ads & email campaigns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{stats.pageViews || 1247}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+12% vs last week</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unique Visitors</p>
                      <p className="text-2xl font-bold">{stats.uniqueVisitors || 438}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+8% vs last week</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Session</p>
                      <p className="text-2xl font-bold">3m 42s</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-rose-600">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>-5% vs last week</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">{stats.bookings || 23}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+18% vs last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="backlinks" className="gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Backlinks</span>
                </TabsTrigger>
                <TabsTrigger value="contacts" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Scrapers</span>
                </TabsTrigger>
                <TabsTrigger value="workflows" className="gap-2">
                  <Workflow className="h-4 w-4" />
                  <span className="hidden sm:inline">Workflows</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Traffic Overview</CardTitle>
                      <CardDescription>Visitors and page views this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{ visitors: { color: "hsl(var(--primary))" }, pageViews: { color: "hsl(var(--muted-foreground))" } }} className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" strokeWidth={2} />
                            <Area type="monotone" dataKey="pageViews" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground)/0.1)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Pages</CardTitle>
                      <CardDescription>Most visited pages this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { page: "/properties", views: 423, change: "+15%" },
                          { page: "/", views: 312, change: "+8%" },
                          { page: "/property/villa-higueron", views: 189, change: "+22%" },
                          { page: "/about", views: 145, change: "-3%" },
                          { page: "/evaluate", views: 98, change: "+45%" },
                        ].map((item) => (
                          <div key={item.page} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <FileSearch className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="font-mono text-sm">{item.page}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{item.views}</span>
                              <Badge variant={item.change.startsWith("+") ? "default" : "secondary"} className={cn("text-xs", item.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                                {item.change}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Overall SEO Score */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Overall SEO Score</CardTitle>
                      <CardDescription>Based on 6 key metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className={cn("relative h-32 w-32 rounded-full flex items-center justify-center", getScoreBg(overallSeoScore))}>
                        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                          <span className={cn("text-4xl font-bold", getScoreColor(overallSeoScore))}>{overallSeoScore}</span>
                        </div>
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                          <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${overallSeoScore * 3.52} 352`} className={getScoreColor(overallSeoScore)} />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground text-center">
                        {overallSeoScore >= 80 ? "Great! Your site is well optimized" : overallSeoScore >= 60 ? "Good, but there's room for improvement" : "Needs attention to improve rankings"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* SEO Metrics Breakdown */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">SEO Metrics Breakdown</CardTitle>
                      <CardDescription>Individual scores and issues to fix</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {seoMetrics.map((metric) => (
                          <div key={metric.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {metric.status === "good" ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : metric.status === "warning" ? (
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-rose-500" />
                                )}
                                <span className="font-medium">{metric.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-xs">
                                  {metric.issues} issues
                                </Badge>
                                <span className={cn("font-bold", getScoreColor(metric.score))}>{metric.score}%</span>
                              </div>
                            </div>
                            <Progress value={metric.score} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* SEO Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Fixes</CardTitle>
                    <CardDescription>Top recommendations to improve your SEO score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: "Add alt text to 12 images", impact: "high", effort: "low" },
                        { title: "Compress images to improve load time", impact: "high", effort: "medium" },
                        { title: "Add meta descriptions to 3 pages", impact: "medium", effort: "low" },
                        { title: "Fix 2 broken internal links", impact: "medium", effort: "low" },
                      ].map((rec, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                          <span className="text-sm">{rec.title}</span>
                          <div className="flex gap-2">
                            <Badge className={cn("text-xs", rec.impact === "high" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600")}>
                              {rec.impact} impact
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.effort} effort
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backlinks Tab */}
              <TabsContent value="backlinks" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Total Backlinks</p>
                      <p className="text-3xl font-bold text-primary">47</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Dofollow</p>
                      <p className="text-3xl font-bold text-emerald-500">38</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Avg. Authority</p>
                      <p className="text-3xl font-bold text-amber-500">58</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">New This Month</p>
                      <p className="text-3xl font-bold text-blue-500">+12</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Backlink Portfolio</CardTitle>
                        <CardDescription>Track and manage your incoming links</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Add new backlink URL..." value={newBacklinkUrl} onChange={(e) => setNewBacklinkUrl(e.target.value)} className="w-64" />
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backlinks.map((link, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{link.domain}</span>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <span className="text-xs text-muted-foreground">Domain Authority: {link.authority}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{link.type}</Badge>
                            <Badge className={cn("text-xs", link.status === "active" ? "bg-emerald-500/10 text-emerald-600" : link.status === "pending" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600")}>
                              {link.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Scrapers Tab */}
              <TabsContent value="contacts" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-rose-500" />
                      Contact Scraping Sources
                    </CardTitle>
                    <CardDescription>
                      Automatically collect and organize contacts from multiple channels for ad targeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scrapedContacts.map((source) => (
                        <div key={source.source} className="p-4 rounded-xl border bg-gradient-to-br from-background to-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{source.source}</h4>
                                <p className="text-xs text-muted-foreground">Last sync: {source.lastSync}</p>
                              </div>
                            </div>
                            <Badge className={cn("text-xs", source.quality === "high" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                              {source.quality} quality
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{source.count}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Sync
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold mb-2">Total Contacts Available for Targeting</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold text-primary">
                          {scrapedContacts.reduce((acc, s) => acc + s.count, 0)}
                        </span>
                        <Button>
                          <Target className="h-4 w-4 mr-2" />
                          Create Audience
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Workflows Tab */}
              <TabsContent value="workflows" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Workflow className="h-5 w-5 text-purple-500" />
                          Visitor Conversion Workflows
                        </CardTitle>
                        <CardDescription>
                          Automated triggers to capture attention and extract outputs from visitors
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Workflow
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {visitorWorkflows.map((workflow) => (
                        <div key={workflow.id} className="p-4 rounded-xl border bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{workflow.name}</h4>
                                <Badge className={cn("text-xs", workflow.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                                  {workflow.status === "active" ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                                  {workflow.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{workflow.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-primary">{workflow.conversions}</span>
                              <p className="text-xs text-muted-foreground">conversions</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600">
                              <Zap className="h-3 w-3" />
                              <span>Trigger: {workflow.trigger}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600">
                              <Target className="h-3 w-3" />
                              <span>Action: {workflow.action}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminAnalytics;
