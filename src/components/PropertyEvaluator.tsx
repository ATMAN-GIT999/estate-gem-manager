import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TrendingUp } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PropertyEvaluator = () => {
  const [loading, setLoading] = useState(false);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    size: "",
    guests: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Editable content state
  const [sectionTitle, setSectionTitle] = useState("Property Cashflow Analysis");
  const [sectionSubtitle, setSectionSubtitle] = useState("Find out your property's short term and long term rental income potential using live market data");
  const [buttonText, setButtonText] = useState("Get Free Cash Flow Analysis");

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
    
    // Navigate immediately - the analysis will happen on the results page
    navigate("/evaluate", { state: { propertyData: formData } });
  };

  const handleAddressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "size" && value === "custom") {
      setShowCustomSize(true);
      setFormData(prev => ({
        ...prev,
        size: ""
      }));
    } else {
      if (field === "size") {
        setShowCustomSize(false);
      }
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      size: e.target.value
    }));
  };

  return (
    <Section id="property-evaluation" size="md" measure="wide">
      <div>
        <div>
          <div className="text-center mb-lg">
            <TrendingUp className="w-12 h-12 text-accent-strong mx-auto mb-sm" strokeWidth={1.5} />
            <EditableText
              id="pe-section-title"
              value={sectionTitle}
              onChange={setSectionTitle}
              as="h2"
              className="t-section text-primary mb-4"
            >
              {sectionTitle}
            </EditableText>
            <EditableText
              id="pe-section-subtitle"
              value={sectionSubtitle}
              onChange={setSectionSubtitle}
              as="p"
              multiline
              className="t-body text-foreground/80 max-w-2xl mx-auto"
            >
              {sectionSubtitle}
            </EditableText>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Property Address *</Label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Start typing an address..."
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => handleSelectChange("bedrooms", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5 Bedrooms</SelectItem>
                      <SelectItem value="6">6 Bedrooms</SelectItem>
                      <SelectItem value="7">7 Bedrooms</SelectItem>
                      <SelectItem value="8">8 Bedrooms</SelectItem>
                      <SelectItem value="9">9 Bedrooms</SelectItem>
                      <SelectItem value="10">10+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => handleSelectChange("bathrooms", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="3">3 Bathrooms</SelectItem>
                      <SelectItem value="4">4 Bathrooms</SelectItem>
                      <SelectItem value="5">5 Bathrooms</SelectItem>
                      <SelectItem value="6">6 Bathrooms</SelectItem>
                      <SelectItem value="7">7 Bathrooms</SelectItem>
                      <SelectItem value="8">8 Bathrooms</SelectItem>
                      <SelectItem value="9">9 Bathrooms</SelectItem>
                      <SelectItem value="10">10+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Multi Unit">Multi Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Size (sqm)</Label>
                  {showCustomSize ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter exact sqm"
                        value={formData.size}
                        onChange={handleCustomSizeChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomSize(false);
                          setFormData(prev => ({ ...prev, size: "" }));
                        }}
                        className="px-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleSelectChange("size", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="75">50-100 sqm</SelectItem>
                        <SelectItem value="125">100-150 sqm</SelectItem>
                        <SelectItem value="175">150-200 sqm</SelectItem>
                        <SelectItem value="250">200-300 sqm</SelectItem>
                        <SelectItem value="400">300-500 sqm</SelectItem>
                        <SelectItem value="600">500+ sqm</SelectItem>
                        <SelectItem value="custom">Custom (enter exact sqm)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="guests">Maximum Guests</Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => handleSelectChange("guests", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select maximum guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="6">6 Guests</SelectItem>
                      <SelectItem value="8">8 Guests</SelectItem>
                      <SelectItem value="10">10 Guests</SelectItem>
                      <SelectItem value="12">12+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Analyzing...
                  </>
                ) : (
                  <EditableText
                    id="pe-button-text"
                    value={buttonText}
                    onChange={setButtonText}
                    as="span"
                  >
                    {buttonText}
                  </EditableText>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default PropertyEvaluator;