import { useState } from "react";
import { Monitor, Home, Users, DollarSign, CheckCircle2, Shield, Key, Clock, BookOpen, Sparkles, Shirt, Wrench, Package, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import platformConnections from "@/assets/platform-connections.png";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";

const PropertyManagement = () => {
  const [sectionTitle, setSectionTitle] = useState("Short-Term Rental Management");
  const [sectionSubtitle, setSectionSubtitle] = useState("We manage while you relax");
  const [listingTitle, setListingTitle] = useState("Listing management");
  const [listingDesc, setListingDesc] = useState("Your property advertised on all major platforms. We keep listings updated for maximum visibility.");
  const [guestTitle, setGuestTitle] = useState("Guest management");
  const [guestDesc, setGuestDesc] = useState("We ensure satisfied guests and provide support whenever needed. Your guests can contact us 24/7 with any questions or problems.");
  const [propertyTitle, setPropertyTitle] = useState("Property management");
  const [propertyDesc1, setPropertyDesc1] = useState("Your home will be thoroughly inspected and cleaned after each stay. We take great care of your property.");
  const [propertyDesc2, setPropertyDesc2] = useState("Once guests have checked out, we will conduct a thorough inspection of your property to detect any damage.");
  const [platformImage, setPlatformImage] = useState(platformConnections);

  const achievements = [
    { label: "Properties Managed", value: 34, suffix: "", icon: Home },
    { label: "Successful Reservations", value: 570, suffix: "+", icon: CheckCircle2 },
    { label: "Destinations", value: 8, suffix: "", icon: MapPin },
    { label: "Collaborators", value: 50, suffix: "+", icon: Briefcase },
  ];

  const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(increment * currentStep));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return <span>{count}{suffix}</span>;
  };

  const listingManagement = [
    { icon: Monitor, title: "Optimal listing", description: "Your home will be advertised with inviting, clear photos and clear text." },
    { icon: BookOpen, title: "Your house rules", description: "The house rules are communicated through the advertisement to avoid misunderstandings and to prevent any damage." },
    { icon: DollarSign, title: "Dynamic pricing", description: "Prices are adjusted based on location, amenities, and time of year. Certain cancellation policies are also determined." },
    { icon: Package, title: "Admin assistance", description: "We advise you on insurance and legislation relating to the home." },
  ];

  const guestManagement = [
    { icon: Shield, title: "Guest screening", description: "Before a booking is accepted, we review the terms and conditions to avoid unwanted guests." },
    { icon: Key, title: "Self check-in", description: "Guests receive a personal code to retrieve the key to your home from a key box." },
    { icon: Clock, title: "24/7 availability", description: "If guests have any questions, they can contact us at any time. We are responsible for all communication with guests." },
    { icon: BookOpen, title: "Survival guide", description: "A customized handbook will be created to guide guests during their stay. This will include any house rules, Wi-Fi code and activities nearby." },
  ];

  const propertyManagement = [
    { icon: Sparkles, title: "House cleaning", description: "Your home will be thoroughly cleaned after each stay, so that everything is perfect again for the next guests." },
    { icon: Shirt, title: "Laundry service", description: "Sheets and towels are washed and ironed after each stay. A set of towels is provided for each guest." },
    { icon: Wrench, title: "Repair service", description: "Our handyman service is responsible for repairs and any maintenance issues according to the vacation home." },
    { icon: Package, title: "Facilities", description: "We always provide some basic amenities: toilet paper, garbage bags, cleaning products, coffee/tea, soap, shampoo, etc." },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-beige via-background to-beige-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <EditableText
            id="pm-section-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            {sectionTitle}
          </EditableText>
          <EditableText
            id="pm-section-subtitle"
            value={sectionSubtitle}
            onChange={setSectionSubtitle}
            as="p"
            className="text-xl text-foreground/70 max-w-3xl mx-auto"
          >
            {sectionSubtitle}
          </EditableText>
        </div>

        {/* Listing Management Section */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary rounded-full p-3">
                      <Home className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="bg-primary text-secondary px-6 py-2 rounded-full inline-block font-semibold">
                        Listings that stand out
                      </div>
                    </div>
                  </div>
                  
                  <EditableText
                    id="pm-listing-title"
                    value={listingTitle}
                    onChange={setListingTitle}
                    as="h3"
                    className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6"
                  >
                    {listingTitle}
                  </EditableText>
                  <EditableText
                    id="pm-listing-desc"
                    value={listingDesc}
                    onChange={setListingDesc}
                    as="p"
                    className="text-lg text-foreground/80 leading-relaxed"
                  >
                    {listingDesc}
                  </EditableText>
                </div>
                
                <div className="flex justify-center">
                  <EditableImage
                    id="pm-platforms-image"
                    src={platformImage}
                    alt="Connected booking platforms"
                    onChange={setPlatformImage}
                    className="w-full max-w-md animate-fade-in"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {listingManagement.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index} 
                      className="bg-muted/50 backdrop-blur-sm rounded-lg p-6 hover:bg-muted transition-all duration-300 animate-fade-in border border-border"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Icon className="w-10 h-10 text-primary mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <Link to="/book">
                <Button className="bg-secondary hover:bg-secondary/90 text-primary shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                  → Contact us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Guest Management Section */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-primary border-none shadow-elegant overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-secondary rounded-full p-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="bg-secondary text-primary px-6 py-2 rounded-full inline-block mb-4 font-semibold">
                      Stays that impress
                    </div>
                  </div>
                </div>
                
                <EditableText
                  id="pm-guest-title"
                  value={guestTitle}
                  onChange={setGuestTitle}
                  as="h3"
                  className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-6"
                >
                  {guestTitle}
                </EditableText>
                <EditableText
                  id="pm-guest-desc"
                  value={guestDesc}
                  onChange={setGuestDesc}
                  as="p"
                  multiline
                  className="text-xl text-primary-foreground/90 mb-8 leading-relaxed"
                >
                  {guestDesc}
                </EditableText>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {guestManagement.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index} 
                        className="bg-card/10 backdrop-blur-sm rounded-lg p-6 hover:bg-card/20 transition-all duration-300 animate-fade-in border border-primary-foreground/20"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Icon className="w-10 h-10 text-secondary mb-4" />
                        <h4 className="text-lg font-semibold text-primary-foreground mb-2">{item.title}</h4>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="text-secondary text-lg font-medium flex items-center gap-2">
                    → Listing management
                  </div>
                  <div className="text-secondary text-lg font-medium flex items-center gap-2">
                    → Property management
                  </div>
                </div>

                <Link to="/book">
                  <Button className="bg-secondary hover:bg-secondary/90 text-primary shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                    → Contact us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Management Section */}
        <div>
          <div className="max-w-6xl mx-auto">
            <Card className="bg-primary border-none shadow-elegant overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-secondary rounded-full p-3">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="bg-secondary text-primary px-6 py-2 rounded-full inline-block mb-4 font-semibold">
                      Homes in good hands
                    </div>
                  </div>
                </div>
                
                <EditableText
                  id="pm-property-title"
                  value={propertyTitle}
                  onChange={setPropertyTitle}
                  as="h3"
                  className="font-playfair text-4xl md:text-5xl font-bold text-primary-foreground mb-6"
                >
                  {propertyTitle}
                </EditableText>
                <div className="space-y-4 mb-8">
                  <EditableText
                    id="pm-property-desc1"
                    value={propertyDesc1}
                    onChange={setPropertyDesc1}
                    as="p"
                    className="text-xl text-primary-foreground/90 leading-relaxed"
                  >
                    {propertyDesc1}
                  </EditableText>
                  <EditableText
                    id="pm-property-desc2"
                    value={propertyDesc2}
                    onChange={setPropertyDesc2}
                    as="p"
                    className="text-xl text-primary-foreground/90 leading-relaxed"
                  >
                    {propertyDesc2}
                  </EditableText>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {propertyManagement.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index} 
                        className="bg-card/10 backdrop-blur-sm rounded-lg p-6 hover:bg-card/20 transition-all duration-300 animate-fade-in border border-primary-foreground/20"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Icon className="w-10 h-10 text-secondary mb-4" />
                        <h4 className="text-lg font-semibold text-primary-foreground mb-2">{item.title}</h4>
                        <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="text-secondary text-lg font-medium flex items-center gap-2">
                    → Listing management
                  </div>
                  <div className="text-secondary text-lg font-medium flex items-center gap-2">
                    → Guest management
                  </div>
                </div>

                <Link to="/book">
                  <Button className="bg-secondary hover:bg-secondary/90 text-primary shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg">
                    → Contact us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;
