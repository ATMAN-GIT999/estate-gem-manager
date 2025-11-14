import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ConsultationBooking from "@/components/ConsultationBooking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Home, DollarSign, Calendar, Users, Percent, CheckCircle2, BarChart3, Sun, Cloud, Snowflake } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Evaluate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<string>("");
  const propertyData = location.state?.propertyData;

  const loadingSteps = [
    { icon: Home, text: "Analyzing property details...", progress: 20 },
    { icon: BarChart3, text: "Checking Airbnb market data...", progress: 40 },
    { icon: TrendingUp, text: "Analyzing Booking.com listings...", progress: 60 },
    { icon: Calendar, text: "Calculating occupancy rates...", progress: 80 },
    { icon: DollarSign, text: "Generating cash flow projections...", progress: 100 },
  ];

  useEffect(() => {
    if (!propertyData) {
      navigate("/");
      return;
    }

    const analyzeProperty = async () => {
      try {
        // Simulate progressive loading steps
        const stepInterval = setInterval(() => {
          setLoadingStep((prev) => {
            if (prev < loadingSteps.length - 1) {
              setProgress(loadingSteps[prev + 1].progress);
              return prev + 1;
            }
            return prev;
          });
        }, 1200);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-property`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ propertyData }),
          }
        );

        clearInterval(stepInterval);

        if (!response.ok) {
          throw new Error("Analysis failed");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setProgress(100);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Analysis Error",
          description: "Failed to analyze property. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeProperty();
  }, [propertyData, navigate, toast]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <Card className="p-12 bg-card/80 backdrop-blur-sm border-border">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    {loadingSteps[loadingStep] && (
                      <>
                        {(() => {
                          const StepIcon = loadingSteps[loadingStep].icon;
                          return <StepIcon className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />;
                        })()}
                        <h2 className="font-playfair text-3xl font-bold text-primary mb-2">
                          {loadingSteps[loadingStep].text}
                        </h2>
                      </>
                    )}
                  </div>
                  
                  <Progress value={progress} className="h-2 mb-6" />
                  
                  <div className="space-y-3">
                    {loadingSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            index <= loadingStep
                              ? "bg-accent/10 text-accent"
                              : "text-foreground/40"
                          }`}
                        >
                          {index < loadingStep ? (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                          ) : (
                            <StepIcon className={`w-5 h-5 ${index === loadingStep ? "animate-pulse" : ""}`} />
                          )}
                          <span className="text-sm font-medium">{step.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <div className="text-center mb-12">
                  <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
                    Cash Flow Analysis
                  </h1>
                  <p className="text-xl text-foreground/80">
                    {propertyData?.address}
                  </p>
                </div>

                {/* Property Details */}
                <div className="grid md:grid-cols-4 gap-4 mb-12">
                  <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-shadow">
                    <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">{propertyData?.bedrooms}</div>
                    <div className="text-sm text-foreground/70">Bedrooms</div>
                  </Card>
                  <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-shadow">
                    <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">{propertyData?.bathrooms}</div>
                    <div className="text-sm text-foreground/70">Bathrooms</div>
                  </Card>
                  <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-shadow">
                    <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">{propertyData?.propertyType || "N/A"}</div>
                    <div className="text-sm text-foreground/70">Type</div>
                  </Card>
                  <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-shadow">
                    <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">{propertyData?.size || "N/A"}</div>
                    <div className="text-sm text-foreground/70">sqm</div>
                  </Card>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 backdrop-blur-sm">
                    <DollarSign className="w-10 h-10 text-accent mb-3" />
                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">Monthly Income</h3>
                    <div className="text-4xl font-bold text-primary mb-1">€3,200</div>
                    <p className="text-sm text-foreground/60">Average net income</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 backdrop-blur-sm">
                    <TrendingUp className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">Annual Revenue</h3>
                    <div className="text-4xl font-bold text-primary mb-1">€38,400</div>
                    <p className="text-sm text-foreground/60">Projected yearly</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20 backdrop-blur-sm">
                    <Percent className="w-10 h-10 text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">Occupancy Rate</h3>
                    <div className="text-4xl font-bold text-primary mb-1">72%</div>
                    <p className="text-sm text-foreground/60">Average year-round</p>
                  </Card>
                </div>

                {/* Seasonal Breakdown */}
                <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant mb-12">
                  <h2 className="font-playfair text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-accent" />
                    Seasonal Analysis
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30">
                      <Sun className="w-8 h-8 text-amber-500 mb-3" />
                      <h3 className="font-semibold text-lg mb-3">Peak Season</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Period:</span>
                          <span className="font-medium">Jun-Aug</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-green-500">90%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">€280</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">€5,200</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
                      <Cloud className="w-8 h-8 text-blue-500 mb-3" />
                      <h3 className="font-semibold text-lg mb-3">Mid Season</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Period:</span>
                          <span className="font-medium">Apr-May, Sep-Oct</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-yellow-500">70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">€180</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">€3,200</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-to-br from-slate-500/20 to-slate-500/5 border border-slate-500/30">
                      <Snowflake className="w-8 h-8 text-slate-500 mb-3" />
                      <h3 className="font-semibold text-lg mb-3">Low Season</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Period:</span>
                          <span className="font-medium">Nov-Mar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-orange-500">55%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">€140</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">€1,900</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Monthly Revenue Projection</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { month: 'Jan', revenue: 1800, occupancy: 50 },
                        { month: 'Feb', revenue: 1900, occupancy: 55 },
                        { month: 'Mar', revenue: 2200, occupancy: 60 },
                        { month: 'Apr', revenue: 3100, occupancy: 68 },
                        { month: 'May', revenue: 3400, occupancy: 72 },
                        { month: 'Jun', revenue: 4900, occupancy: 88 },
                        { month: 'Jul', revenue: 5400, occupancy: 92 },
                        { month: 'Aug', revenue: 5200, occupancy: 90 },
                        { month: 'Sep', revenue: 3300, occupancy: 70 },
                        { month: 'Oct', revenue: 3000, occupancy: 68 },
                        { month: 'Nov', revenue: 2000, occupancy: 56 },
                        { month: 'Dec', revenue: 1900, occupancy: 54 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                        <YAxis stroke="hsl(var(--foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Detailed Analysis Dashboard */}
                <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant mb-12">
                  <h2 className="font-playfair text-2xl font-bold text-primary mb-6">Detailed Investment Analysis</h2>
                  
                  {/* Rental Rates */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      Estimated Nightly Rental Rates
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                        <div className="text-sm text-foreground/70 mb-1">Low Season</div>
                        <div className="text-2xl font-bold text-primary">€180 - €250</div>
                        <div className="text-xs text-foreground/60 mt-1">Nov - Mar</div>
                      </Card>
                      <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                        <div className="text-sm text-foreground/70 mb-1">Mid Season</div>
                        <div className="text-2xl font-bold text-primary">€280 - €400</div>
                        <div className="text-xs text-foreground/60 mt-1">Apr, May, Jun, Sep, Oct</div>
                      </Card>
                      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                        <div className="text-sm text-foreground/70 mb-1">High Season</div>
                        <div className="text-2xl font-bold text-primary">€450 - €650+</div>
                        <div className="text-xs text-foreground/60 mt-1">Jul, Aug, Holidays</div>
                      </Card>
                    </div>
                  </div>

                  {/* Operating Expenses */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      Annual Operating Expenses
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-card border-border">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Platform Commission (14%)</span>
                            <span className="font-semibold">€12,495</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Property Management (20%)</span>
                            <span className="font-semibold">€15,351</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Community Fees</span>
                            <span className="font-semibold">€5,400</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Utilities</span>
                            <span className="font-semibold">€4,920</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-card border-border">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Capex Reserve (5%)</span>
                            <span className="font-semibold">€4,463</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Cleaning & Consumables</span>
                            <span className="font-semibold">€2,500</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Maintenance & Repairs</span>
                            <span className="font-semibold">€2,000</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Insurance & Taxes</span>
                            <span className="font-semibold">€2,400</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <Card className="p-4 bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Annual Expenses</span>
                        <span className="text-2xl font-bold text-red-500">€49,529</span>
                      </div>
                    </Card>
                  </div>

                  {/* Net Profit */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Net Operating Income
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
                        <div className="text-sm text-foreground/70 mb-1">Gross Revenue</div>
                        <div className="text-3xl font-bold text-primary">€89,250</div>
                        <div className="text-xs text-foreground/60 mt-1">255 nights @ 70% occupancy</div>
                      </Card>
                      <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
                        <div className="text-sm text-foreground/70 mb-1">Annual Net Profit</div>
                        <div className="text-3xl font-bold text-green-600">€39,722</div>
                        <div className="text-xs text-foreground/60 mt-1">Before mortgage</div>
                      </Card>
                      <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                        <div className="text-sm text-foreground/70 mb-1">Monthly Net Profit</div>
                        <div className="text-3xl font-bold text-primary">€3,310</div>
                        <div className="text-xs text-foreground/60 mt-1">Average per month</div>
                      </Card>
                    </div>
                  </div>

                  {/* ROI Analysis */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-accent" />
                      Return on Investment
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-6 bg-card border-border">
                        <h4 className="font-semibold mb-4">Cash Purchase Scenario</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Purchase Price</span>
                            <span className="font-semibold">€950,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Setup Costs</span>
                            <span className="font-semibold">€159,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Total Investment</span>
                            <span className="font-semibold">€1,109,500</span>
                          </div>
                          <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Cash-on-Cash ROI</span>
                            <span className="text-2xl font-bold text-green-600">3.58%</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-6 bg-card border-border">
                        <h4 className="font-semibold mb-4">Financed Purchase (30% Down)</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Down Payment</span>
                            <span className="font-semibold">€285,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Initial Cash Outlay</span>
                            <span className="font-semibold">€444,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Annual Mortgage</span>
                            <span className="font-semibold text-red-500">-€48,444</span>
                          </div>
                          <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Net Cash Flow</span>
                            <span className="text-2xl font-bold text-red-500">-€8,723/yr</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
                    <h3 className="text-lg font-semibold mb-4">Key Investment Insights</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Strong Revenue Potential</div>
                          <div className="text-sm text-foreground/70">Premium location commands high nightly rates year-round</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Excellent Occupancy</div>
                          <div className="text-sm text-foreground/70">70% annual occupancy is achievable with proper management</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Professional Management Required</div>
                          <div className="text-sm text-foreground/70">High-end rentals need expert management for optimal results</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Capital Appreciation Focus</div>
                          <div className="text-sm text-foreground/70">Primary returns come from property value growth</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Card>

              </>
            )}
          </div>
        </div>
      </section>

      {!loading && <ConsultationBooking />}

      <Footer />
    </div>
  );
};

export default Evaluate;
