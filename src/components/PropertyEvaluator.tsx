import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TrendingUp } from "lucide-react";

const PropertyEvaluator = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    size: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.bedrooms || !formData.bathrooms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate analysis with timeout
    setTimeout(() => {
      navigate("/evaluate", { state: { propertyData: formData } });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <TrendingUp className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
              Evaluate Your Property Value with AI
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Get instant cash flow analysis using live market data from Airbnb, Booking.com, and more
            </p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Property Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., Calle Marbella, Marbella, Spain"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="3"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Input
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    placeholder="e.g., Villa, Apartment"
                  />
                </div>

                <div>
                  <Label htmlFor="size">Size (sqm)</Label>
                  <Input
                    id="size"
                    name="size"
                    type="number"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="150"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white shadow-elegant"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Market Data...
                  </>
                ) : (
                  "Get Free Cash Flow Analysis"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PropertyEvaluator;
