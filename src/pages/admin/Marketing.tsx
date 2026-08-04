import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Target, 
  Plus, 
  BarChart3,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface CampaignMetrics {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  leads: number;
  bookings: number;
  revenue: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  conversion_rate: number;
}

interface AggregatedMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalBookings: number;
  totalRevenue: number;
  totalSpend: number;
  avgCtr: number;
  avgCpc: number;
  avgCpa: number;
  avgRoas: number;
  avgConversionRate: number;
}

const Marketing = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<CampaignMetrics[]>([]);
  const [aggregated, setAggregated] = useState<AggregatedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    platform: "google",
    budget: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, metricsRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('campaign_metrics').select('*').order('date', { ascending: false }).limit(100)
      ]);

      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (metricsRes.data) {
        setMetrics(metricsRes.data);
        calculateAggregated(metricsRes.data);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAggregated = (data: CampaignMetrics[]) => {
    if (data.length === 0) {
      setAggregated(null);
      return;
    }

    const totals = data.reduce((acc, m) => ({
      totalImpressions: acc.totalImpressions + m.impressions,
      totalClicks: acc.totalClicks + m.clicks,
      totalLeads: acc.totalLeads + m.leads,
      totalBookings: acc.totalBookings + m.bookings,
      totalRevenue: acc.totalRevenue + Number(m.revenue),
      totalSpend: acc.totalSpend + Number(m.spend),
    }), {
      totalImpressions: 0,
      totalClicks: 0,
      totalLeads: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalSpend: 0,
    });

    setAggregated({
      ...totals,
      avgCtr: totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0,
      avgCpc: totals.totalClicks > 0 ? totals.totalSpend / totals.totalClicks : 0,
      avgCpa: totals.totalBookings > 0 ? totals.totalSpend / totals.totalBookings : 0,
      avgRoas: totals.totalSpend > 0 ? totals.totalRevenue / totals.totalSpend : 0,
      avgConversionRate: totals.totalClicks > 0 ? (totals.totalBookings / totals.totalClicks) * 100 : 0,
    });
  };

  const createCampaign = async () => {
    try {
      const { error } = await supabase.from('campaigns').insert({
        name: newCampaign.name,
        platform: newCampaign.platform,
        budget: parseFloat(newCampaign.budget) || 0,
        start_date: newCampaign.start_date,
        end_date: newCampaign.end_date || null,
        utm_source: newCampaign.utm_source || newCampaign.platform,
        utm_medium: newCampaign.utm_medium || 'cpc',
        utm_campaign: newCampaign.utm_campaign || newCampaign.name.toLowerCase().replace(/\s+/g, '_')
      });

      if (error) throw error;

      toast({ title: "Campaign created", description: "Your campaign has been created successfully." });
      setDialogOpen(false);
      setNewCampaign({
        name: "", platform: "google", budget: "", start_date: new Date().toISOString().split('T')[0],
        end_date: "", utm_source: "", utm_medium: "", utm_campaign: ""
      });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const calculateScore = (campaign: Campaign) => {
    const campaignMetrics = metrics.filter(m => m.campaign_id === campaign.id);
    if (campaignMetrics.length === 0) return 0;

    const avgRoas = campaignMetrics.reduce((acc, m) => acc + Number(m.roas), 0) / campaignMetrics.length;
    const avgConv = campaignMetrics.reduce((acc, m) => acc + Number(m.conversion_rate), 0) / campaignMetrics.length;
    const avgCpa = campaignMetrics.reduce((acc, m) => acc + Number(m.cpa), 0) / campaignMetrics.length;

    // Score calculation matching database function
    let score = 0;
    score += avgRoas >= 3 ? 40 : avgRoas >= 2 ? 30 : avgRoas >= 1.5 ? 20 : avgRoas >= 1 ? 10 : 0;
    score += avgConv >= 5 ? 30 : avgConv >= 3 ? 20 : avgConv >= 1 ? 10 : 0;
    score += avgCpa <= 50 ? 30 : avgCpa <= 75 ? 20 : avgCpa <= 100 ? 10 : 0;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: "Excellent", icon: CheckCircle, color: "bg-green-100 text-green-800" };
    if (score >= 40) return { label: "Good", icon: AlertTriangle, color: "bg-amber-100 text-amber-800" };
    return { label: "Needs Work", icon: XCircle, color: "bg-red-100 text-red-800" };
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      google: "bg-blue-100 text-blue-800",
      meta: "bg-indigo-100 text-indigo-800",
      tiktok: "bg-pink-100 text-pink-800",
      linkedin: "bg-sky-100 text-sky-800",
    };
    return colors[platform] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-primary mb-2">Marketing Analytics</h1>
              <p className="text-muted-foreground">Track campaigns, conversions, and profitability</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>Set up a new advertising campaign to track</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="Summer Villa Promotion"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Platform</Label>
                      <Select value={newCampaign.platform} onValueChange={(v) => setNewCampaign({ ...newCampaign, platform: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Ads</SelectItem>
                          <SelectItem value="meta">Meta (Facebook/Instagram)</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Budget (€)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start">Start Date</Label>
                      <Input
                        id="start"
                        type="date"
                        value={newCampaign.start_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end">End Date (Optional)</Label>
                      <Input
                        id="end"
                        type="date"
                        value={newCampaign.end_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>UTM Parameters (Auto-generated if empty)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="utm_source"
                        value={newCampaign.utm_source}
                        onChange={(e) => setNewCampaign({ ...newCampaign, utm_source: e.target.value })}
                      />
                      <Input
                        placeholder="utm_medium"
                        value={newCampaign.utm_medium}
                        onChange={(e) => setNewCampaign({ ...newCampaign, utm_medium: e.target.value })}
                      />
                      <Input
                        placeholder="utm_campaign"
                        value={newCampaign.utm_campaign}
                        onChange={(e) => setNewCampaign({ ...newCampaign, utm_campaign: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={createCampaign} disabled={!newCampaign.name}>Create Campaign</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                    {loading ? <Skeleton className="h-8 w-20 mt-1" /> : (
                      <p className="text-2xl font-bold">{formatCurrency(aggregated?.totalSpend || 0)}</p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    {loading ? <Skeleton className="h-8 w-20 mt-1" /> : (
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(aggregated?.totalRevenue || 0)}
                      </p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                    {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                      <p className={`text-2xl font-bold ${(aggregated?.avgRoas || 0) >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {(aggregated?.avgRoas || 0).toFixed(2)}x
                      </p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                    {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                      <p className="text-2xl font-bold">{aggregated?.totalBookings || 0}</p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conv. Rate</p>
                    {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                      <p className="text-2xl font-bold">{(aggregated?.avgConversionRate || 0).toFixed(2)}%</p>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <MousePointer className="h-5 w-5 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="campaigns" className="space-y-6">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="scoring">Profitability Scoring</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid gap-4">
                  {campaigns.map((campaign) => {
                    const score = calculateScore(campaign);
                    const scoreInfo = getScoreLabel(score);
                    const budgetUsed = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

                    return (
                      <Card key={campaign.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{campaign.name}</h3>
                                <Badge className={getPlatformColor(campaign.platform)}>
                                  {campaign.platform}
                                </Badge>
                                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                  {campaign.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(campaign.start_date).toLocaleDateString()} 
                                {campaign.end_date ? ` - ${new Date(campaign.end_date).toLocaleDateString()}` : ' - Ongoing'}
                              </p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="font-semibold">{formatCurrency(campaign.budget)}</p>
                                <Progress value={budgetUsed} className="h-1 w-20 mt-1" />
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Spent</p>
                                <p className="font-semibold">{formatCurrency(campaign.spent)}</p>
                              </div>
                              <div className="text-center min-w-[80px]">
                                <p className="text-xs text-muted-foreground">Score</p>
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}</span>
                                  <span className="text-xs text-muted-foreground">/100</span>
                                </div>
                                <Badge className={scoreInfo.color} variant="secondary">
                                  <scoreInfo.icon className="h-3 w-3 mr-1" />
                                  {scoreInfo.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first campaign to start tracking conversions</p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clicks & Impressions</CardTitle>
                    <CardDescription>Daily traffic performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics.slice(0, 30).reverse()}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Impressions" />
                          <Line type="monotone" dataKey="clicks" stroke="hsl(220, 90%, 56%)" strokeWidth={2} dot={false} name="Clicks" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No performance data yet
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue vs Spend</CardTitle>
                    <CardDescription>Track your return on ad spend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics.slice(0, 14).reverse()}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="spend" fill="hsl(0, 84%, 60%)" name="Spend" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" name="Revenue" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No revenue data yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Metrics Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Date</th>
                          <th className="text-right py-3 px-2 font-medium">Impressions</th>
                          <th className="text-right py-3 px-2 font-medium">Clicks</th>
                          <th className="text-right py-3 px-2 font-medium">CTR</th>
                          <th className="text-right py-3 px-2 font-medium">CPC</th>
                          <th className="text-right py-3 px-2 font-medium">Bookings</th>
                          <th className="text-right py-3 px-2 font-medium">CPA</th>
                          <th className="text-right py-3 px-2 font-medium">Revenue</th>
                          <th className="text-right py-3 px-2 font-medium">ROAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.slice(0, 10).map((m, i) => (
                          <tr key={i} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{new Date(m.date).toLocaleDateString()}</td>
                            <td className="text-right py-3 px-2">{formatNumber(m.impressions)}</td>
                            <td className="text-right py-3 px-2">{formatNumber(m.clicks)}</td>
                            <td className="text-right py-3 px-2">{Number(m.ctr).toFixed(2)}%</td>
                            <td className="text-right py-3 px-2">{formatCurrency(Number(m.cpc))}</td>
                            <td className="text-right py-3 px-2">{m.bookings}</td>
                            <td className="text-right py-3 px-2">{formatCurrency(Number(m.cpa))}</td>
                            <td className="text-right py-3 px-2 text-green-600">{formatCurrency(Number(m.revenue))}</td>
                            <td className="text-right py-3 px-2 font-semibold">{Number(m.roas).toFixed(2)}x</td>
                          </tr>
                        ))}
                        {metrics.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-muted-foreground">
                              No metrics data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scoring Tab */}
            <TabsContent value="scoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Profitability Scoring Guide
                  </CardTitle>
                  <CardDescription>How we calculate campaign profitability scores (0-100)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" /> ROAS Score (0-40 pts)
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>≥3x ROAS = 40 points</li>
                        <li>≥2x ROAS = 30 points</li>
                        <li>≥1.5x ROAS = 20 points</li>
                        <li>≥1x ROAS = 10 points</li>
                        <li>&lt;1x ROAS = 0 points</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" /> Conversion Rate (0-30 pts)
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>≥5% conversion = 30 points</li>
                        <li>≥3% conversion = 20 points</li>
                        <li>≥1% conversion = 10 points</li>
                        <li>&lt;1% conversion = 0 points</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" /> CPA Efficiency (0-30 pts)
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>≤€50 CPA = 30 points</li>
                        <li>≤€75 CPA = 20 points</li>
                        <li>≤€100 CPA = 10 points</li>
                        <li>&gt;€100 CPA = 0 points</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-semibold mb-4">Score Interpretation</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">70-100: Excellent</p>
                          <p className="text-sm text-green-700">Scale this campaign</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                        <div>
                          <p className="font-semibold text-amber-800">40-69: Good</p>
                          <p className="text-sm text-amber-700">Optimize & monitor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50">
                        <XCircle className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="font-semibold text-red-800">0-39: Needs Work</p>
                          <p className="text-sm text-red-700">Review or pause</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Scores */}
              {campaigns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Profitability Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaigns
                        .map(c => ({ ...c, score: calculateScore(c) }))
                        .sort((a, b) => b.score - a.score)
                        .map((campaign, index) => {
                          const scoreInfo = getScoreLabel(campaign.score);
                          return (
                            <div key={campaign.id} className="flex items-center gap-4 p-4 rounded-lg border">
                              <span className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</span>
                              <div className="flex-1">
                                <p className="font-semibold">{campaign.name}</p>
                                <Badge className={getPlatformColor(campaign.platform)} variant="secondary">
                                  {campaign.platform}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <Progress value={campaign.score} className="w-32 h-2" />
                                <span className={`text-2xl font-bold ${getScoreColor(campaign.score)}`}>
                                  {campaign.score}
                                </span>
                                <Badge className={scoreInfo.color}>
                                  <scoreInfo.icon className="h-3 w-3 mr-1" />
                                  {scoreInfo.label}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Marketing;
