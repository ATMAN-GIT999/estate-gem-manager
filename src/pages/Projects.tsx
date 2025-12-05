import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Home, Star } from "lucide-react";

const Projects = () => {
  const regions = [
    {
      name: "Spain",
      subtitle: "Costa del Sol",
      description: "Luxury villas and apartments in Marbella, Málaga, and surrounding areas",
      projects: "20+ premium properties under management",
      icon: "🇪🇸",
    },
    {
      name: "Austria",
      subtitle: "Vienna & Carinthia",
      description: "Urban elegance and Alpine retreats with exceptional rental yields",
      projects: "Cosmopolitan apartments and leisure properties",
      icon: "🇦🇹",
    },
    {
      name: "Croatia",
      subtitle: "Istria",
      description: "Mediterranean charm meets modern luxury in this emerging destination",
      projects: "Traditional homes transformed into premium rentals",
      icon: "🇭🇷",
    },
  ];

  const featuredProjects = [
    {
      title: "Villa Hoyo 19",
      location: "La Quinta, Marbella",
      type: "Luxury Villa",
      description:
        "A stunning contemporary villa overlooking the golf course with panoramic sea views. Complete renovation transformed this property into one of the most sought-after rentals in the area.",
      highlights: ["Complete interior redesign", "Infinity pool installation", "Smart home integration", "Professional photography"],
      stats: { occupancy: "85%", revenue: "+120%", rating: "4.9" },
    },
    {
      title: "Soho Boho",
      location: "Soho Arts District, Málaga",
      type: "Urban Apartment",
      description:
        "Transformed from €13,000 to €65,000 annual income through strategic renovation and positioning in Málaga's vibrant Soho Arts District. A perfect example of our value-add approach.",
      highlights: ["Boho-style design with earthy tones", "Optimized layout for guests", "Premium location positioning", "Full staging & photography"],
      stats: { occupancy: "92%", revenue: "+400%", rating: "4.8" },
    },
    {
      title: "Alpine Retreat",
      location: "Carinthia, Austria",
      type: "Mountain Property",
      description:
        "A charming Alpine property converted into a year-round rental with exceptional winter and summer appeal. Combining traditional Austrian elements with modern comfort.",
      highlights: ["Traditional meets modern design", "Ski-in/ski-out access", "Spa facilities added", "Seasonal revenue optimization"],
      stats: { occupancy: "78%", revenue: "+85%", rating: "4.9" },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
              Our Work: Precision, Performance, and Mediterranean Craftsmanship
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Showcasing properties by country with before/after transformations, renovation stories, revenue improvements, and occupancy results.
            </p>
          </div>

          {/* Regions */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Our Destinations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <Card key={index} className="shadow-elegant hover:shadow-gold transition-all hover:scale-105 duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-hero">
                    <div className="text-4xl mb-2">{region.icon}</div>
                    <CardTitle className="font-playfair text-2xl text-primary">{region.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-accent">{region.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-foreground/80 mb-4">{region.description}</p>
                    <p className="text-sm text-muted-foreground">{region.projects}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="max-w-6xl mx-auto">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Featured Transformations</h2>
            <div className="space-y-12">
              {featuredProjects.map((project, index) => (
                <Card key={index} className="shadow-elegant border-accent/20 overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Placeholder */}
                    <div className="bg-gradient-hero p-8 flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <Home className="w-16 h-16 text-accent mx-auto mb-4" />
                        <p className="text-muted-foreground">Before & After Photos</p>
                        <p className="text-sm text-muted-foreground/70">Coming Soon</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-playfair text-2xl font-bold text-primary mb-2">{project.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">{project.type}</Badge>
                      </div>
                      
                      <p className="text-foreground/80 leading-relaxed mb-6">{project.description}</p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-accent font-bold text-xl">
                            <TrendingUp className="w-4 h-4" />
                            {project.stats.occupancy}
                          </div>
                          <p className="text-xs text-muted-foreground">Occupancy</p>
                        </div>
                        <div className="text-center">
                          <div className="text-accent font-bold text-xl">{project.stats.revenue}</div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-accent font-bold text-xl">
                            <Star className="w-4 h-4" />
                            {project.stats.rating}
                          </div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      
                      {/* Highlights */}
                      <div>
                        <h4 className="font-semibold text-primary mb-3">Key Highlights:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <p className="text-sm text-foreground/80">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
