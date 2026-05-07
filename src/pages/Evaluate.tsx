import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ConsultationBooking from "@/components/ConsultationBooking";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Home, DollarSign, Calendar, Percent, CheckCircle2, BarChart3, Sun, Cloud, Snowflake } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageWrapper from "@/components/PageWrapper";

interface PropertyAnalysis {
  monthlyIncome: number;
  annualRevenue: number;
  occupancyRate: number;
  peakSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  midSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  lowSeason: {
    period: string;
    occupancy: number;
    nightlyRate: number;
    monthlyIncome: number;
  };
  monthlyData: Array<{ month: string; revenue: number; occupancy: number }>;
  rentalRates: {
    low: { min: number; max: number };
    mid: { min: number; max: number };
    high: { min: number; max: number };
  };
  expenses: {
    cleaning: number;
    maintenance: number;
    utilities: number;
    insurance: number;
    platformFees: number;
    management: number;
    total: number;
  };
  longTermRental: {
    monthlyRent: number;
    annualIncome: number;
    occupancyRate: number;
  };
  comparison: {
    shortTermAnnual: number;
    longTermAnnual: number;
    recommendation: string;
  };
  marketInsights: string;
}

const EvaluateContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const propertyData = location.state?.propertyData;

  const loadingSteps = [
    { icon: Home, text: "Analyzing property details...", progress: 20 },
    { icon: BarChart3, text: "Searching Airbnb market data...", progress: 40 },
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
        const stepInterval = setInterval(() => {
          setLoadingStep((prev) => {
            if (prev < loadingSteps.length - 1) {
              setProgress(loadingSteps[prev + 1].progress);
              return prev + 1;
            }
            return prev;
          });
        }, 1500);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          clearInterval(stepInterval);
          toast({
            title: "Sign in required",
            description: "Please sign in to run a property analysis.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase.functions.invoke("analyze-property", {
          body: { propertyData },
        });

        clearInterval(stepInterval);

        if (error) {
          throw new Error(error.message || "Analysis failed");
        }
        setAnalysis(data.analysis);
        setProgress(100);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Analysis Error",
          description: error instanceof Error ? error.message : "Failed to analyze property. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeProperty();
  }, [propertyData, navigate, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  // Format occupancy rate - handle both decimal (0.7) and percentage (70) formats
  const formatOccupancy = (rate: number) => {
    if (rate === undefined || rate === null) return 0;
    return rate < 1 ? Math.round(rate * 100) : Math.round(rate);
  };

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
            ) : analysis ? (
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
                    <div className="text-4xl font-bold text-primary mb-1">{formatCurrency(analysis.monthlyIncome)}</div>
                    <p className="text-sm text-foreground/60">Average net income</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 backdrop-blur-sm">
                    <TrendingUp className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">Annual Revenue</h3>
                    <div className="text-4xl font-bold text-primary mb-1">{formatCurrency(analysis.annualRevenue)}</div>
                    <p className="text-sm text-foreground/60">Projected yearly</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20 backdrop-blur-sm">
                    <Percent className="w-10 h-10 text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">Occupancy Rate</h3>
                    <div className="text-4xl font-bold text-primary mb-1">{formatOccupancy(analysis.occupancyRate)}%</div>
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
                          <span className="font-medium">{analysis.peakSeason.period}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-green-500">{formatOccupancy(analysis.peakSeason.occupancy)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">{formatCurrency(analysis.peakSeason.nightlyRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">{formatCurrency(analysis.peakSeason.monthlyIncome)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
                      <Cloud className="w-8 h-8 text-blue-500 mb-3" />
                      <h3 className="font-semibold text-lg mb-3">Mid Season</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Period:</span>
                          <span className="font-medium">{analysis.midSeason.period}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-yellow-500">{formatOccupancy(analysis.midSeason.occupancy)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">{formatCurrency(analysis.midSeason.nightlyRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">{formatCurrency(analysis.midSeason.monthlyIncome)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-to-br from-slate-500/20 to-slate-500/5 border border-slate-500/30">
                      <Snowflake className="w-8 h-8 text-slate-500 mb-3" />
                      <h3 className="font-semibold text-lg mb-3">Low Season</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Period:</span>
                          <span className="font-medium">{analysis.lowSeason.period}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Occupancy:</span>
                          <span className="font-bold text-orange-500">{formatOccupancy(analysis.lowSeason.occupancy)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Nightly Rate:</span>
                          <span className="font-bold">{formatCurrency(analysis.lowSeason.nightlyRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Monthly Income:</span>
                          <span className="font-bold text-accent">{formatCurrency(analysis.lowSeason.monthlyIncome)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Monthly Revenue Projection</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analysis.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                        <YAxis stroke="hsl(var(--foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                          formatter={(value: number) => [formatCurrency(value), 'Revenue']}
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
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(analysis.rentalRates.low.min)} - {formatCurrency(analysis.rentalRates.low.max)}
                        </div>
                        <div className="text-xs text-foreground/60 mt-1">Nov - Mar</div>
                      </Card>
                      <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                        <div className="text-sm text-foreground/70 mb-1">Mid Season</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(analysis.rentalRates.mid.min)} - {formatCurrency(analysis.rentalRates.mid.max)}
                        </div>
                        <div className="text-xs text-foreground/60 mt-1">Apr, May, Sep, Oct</div>
                      </Card>
                      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                        <div className="text-sm text-foreground/70 mb-1">High Season</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(analysis.rentalRates.high.min)} - {formatCurrency(analysis.rentalRates.high.max)}
                        </div>
                        <div className="text-xs text-foreground/60 mt-1">Jun, Jul, Aug</div>
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
                            <span className="text-sm text-foreground/70">Platform Fees</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.platformFees)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Property Management</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.management)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Utilities</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.utilities)}</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-card border-border">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Cleaning</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.cleaning)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Maintenance</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.maintenance)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/70">Insurance</span>
                            <span className="font-semibold">{formatCurrency(analysis.expenses.insurance)}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <Card className="p-4 bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Annual Expenses</span>
                        <span className="text-2xl font-bold text-red-500">{formatCurrency(analysis.expenses.total)}</span>
                      </div>
                    </Card>
                  </div>

                  {/* Short-term vs Long-term Comparison */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Short-term vs Long-term Rental Comparison
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
                        <h4 className="font-semibold mb-4">Short-term Rental (STR)</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Annual Revenue</span>
                            <span className="font-semibold">{formatCurrency(analysis.comparison.shortTermAnnual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Avg. Occupancy</span>
                            <span className="font-semibold">{analysis.occupancyRate}%</span>
                          </div>
                          <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Net Annual Income</span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatCurrency(analysis.comparison.shortTermAnnual - analysis.expenses.total)}
                            </span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                        <h4 className="font-semibold mb-4">Long-term Rental (LTR)</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Monthly Rent</span>
                            <span className="font-semibold">{formatCurrency(analysis.longTermRental.monthlyRent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-foreground/70">Annual Income</span>
                            <span className="font-semibold">{formatCurrency(analysis.longTermRental.annualIncome)}</span>
                          </div>
                          <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Occupancy Rate</span>
                            <span className="text-2xl font-bold text-primary">{analysis.longTermRental.occupancyRate}%</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Market Insights */}
                  <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
                    <h3 className="text-lg font-semibold mb-4">Market Insights & Recommendation</h3>
                    <p className="text-foreground/80 mb-4">{analysis.marketInsights}</p>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Our Recommendation</div>
                        <div className="text-sm text-foreground/70">{analysis.comparison.recommendation}</div>
                      </div>
                    </div>
                  </Card>
                </Card>

              </>
            ) : (
              <Card className="p-12 bg-card/80 backdrop-blur-sm border-border text-center">
                <p className="text-xl text-muted-foreground">No analysis data available. Please try again.</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {!loading && analysis && <ConsultationBooking />}

      <Footer />
    </div>
  );
};

const Evaluate = () => (<PageWrapper slug="site--evaluate"><EvaluateContent /></PageWrapper>);
export default Evaluate;