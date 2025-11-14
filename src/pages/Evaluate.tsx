import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, TrendingUp, DollarSign, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Evaluate = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [showReport, setShowReport] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate AI evaluation
    setTimeout(() => {
      setShowReport(true);
      toast({
        title: "Evaluation Complete",
        description: "Your property cash flow report has been generated.",
      });
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
              Property Cash Flow Evaluation
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover your property's rental income potential with our AI-powered analysis
            </p>
          </div>

          {!showReport ? (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Property Details</CardTitle>
                <CardDescription>
                  Provide information about your property for a comprehensive evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="images">Property Images</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-accent" />
                        <p className="text-foreground font-medium">Click to upload images</p>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                      </label>
                      {images.length > 0 && (
                        <p className="mt-4 text-accent font-medium">{images.length} images selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, Costa del Sol"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="1"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property's features, location, amenities..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold h-12 text-lg font-semibold"
                  >
                    Generate Cash Flow Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-elegant border-accent">
                <CardHeader className="bg-gradient-gold">
                  <CardTitle className="font-playfair text-3xl text-accent-foreground">
                    Cash Flow Analysis Report
                  </CardTitle>
                  <CardDescription className="text-accent-foreground/80">
                    Based on market data and property characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Monthly Income</p>
                        <p className="text-2xl font-bold text-primary">€3,500 - €4,200</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Revenue Potential</p>
                        <p className="text-2xl font-bold text-primary">€42,000 - €50,400</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Projected Occupancy Rate</p>
                        <p className="text-2xl font-bold text-primary">78-85%</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target Market</p>
                        <p className="text-2xl font-bold text-primary">Premium Travelers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">How We Can Help You Achieve This</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Professional Photography & Staging</h4>
                      <p className="text-foreground/80">
                        Premium listings with professional photos to maximize booking attraction
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Multi-Platform Listing Management</h4>
                      <p className="text-foreground/80">
                        Seamless integration with Airbnb, Booking.com, and direct booking channels
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Dynamic Pricing Strategy</h4>
                      <p className="text-foreground/80">
                        AI-optimized pricing to maximize occupancy and revenue year-round
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Complete Guest Management</h4>
                      <p className="text-foreground/80">
                        24/7 communication, check-in coordination, and exceptional guest experiences
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold h-12 text-lg font-semibold mt-6">
                    List Your Property With Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Evaluate;
