import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Home, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Evaluate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>("");
  const propertyData = location.state?.propertyData;

  useEffect(() => {
    if (!propertyData) {
      navigate("/");
      return;
    }

    const analyzeProperty = async () => {
      try {
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

        if (!response.ok) {
          throw new Error("Analysis failed");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
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
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <Card className="p-12 text-center bg-card/80 backdrop-blur-sm border-border">
                <Loader2 className="w-16 h-16 text-accent mx-auto mb-6 animate-spin" />
                <h2 className="font-playfair text-3xl font-bold text-primary mb-4">
                  Analyzing Your Property
                </h2>
                <p className="text-foreground/70 text-lg">
                  Checking live data from Airbnb, Booking.com, and other platforms...
                </p>
              </Card>
            ) : (
              <>
                <div className="text-center mb-8">
                  <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
                    Cash Flow Analysis
                  </h1>
                  <p className="text-xl text-foreground/80">
                    {propertyData?.address}
                  </p>
                </div>

                <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant mb-8">
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{propertyData?.bedrooms}</div>
                      <div className="text-sm text-foreground/70">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{propertyData?.bathrooms}</div>
                      <div className="text-sm text-foreground/70">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{propertyData?.propertyType || "N/A"}</div>
                      <div className="text-sm text-foreground/70">Type</div>
                    </div>
                    <div className="text-center">
                      <Home className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{propertyData?.size || "N/A"}</div>
                      <div className="text-sm text-foreground/70">sqm</div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {analysis}
                    </div>
                  </div>
                </Card>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => navigate("/admin/properties")}
                    className="bg-accent hover:bg-accent/90 text-white shadow-elegant"
                  >
                    List Your Property
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Evaluate;
