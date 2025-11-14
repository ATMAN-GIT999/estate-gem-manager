import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const regions = [
    {
      name: "Spain: Costa del Sol",
      description: "Luxury villas and apartments in Marbella and Málaga",
      projects: "Multiple premium properties under management",
    },
    {
      name: "Austria: Vienna & Carinthia",
      description: "Urban elegance and Alpine retreats",
      projects: "Cosmopolitan apartments and leisure properties",
    },
    {
      name: "Croatia: Istria",
      description: "Mediterranean charm meets modern luxury",
      projects: "Traditional homes transformed into premium rentals",
    },
  ];

  const featuredProjects = [
    {
      title: "Blue View Villas",
      location: "Costa del Sol, Spain",
      type: "Villa Renovation",
      description:
        "Stunning upgrades enhancing aesthetic and functional appeal, blending modern luxury with natural beauty of the region.",
      highlights: ["Complete interior redesign", "Pool and outdoor spaces", "Smart home integration"],
    },
    {
      title: "Soho Boho",
      location: "Martínez Campos, 15, Málaga",
      type: "Apartment Transformation",
      description:
        "Transformed from €13,000 to €65,000 annual income through strategic renovation and positioning in Málaga's Soho Arts District.",
      highlights: ["Boho-style design with earthy tones", "Optimized layout", "Premium location positioning"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">Our Projects</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Enhancing real estate value across Europe through strategic renovations and value-add operations
            </p>
          </div>

          {/* Regions */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Our Focus Regions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <Card key={index} className="shadow-elegant hover:shadow-gold transition-all hover:scale-105 duration-300">
                  <CardHeader>
                    <CardTitle className="font-playfair text-xl text-primary">{region.name}</CardTitle>
                    <CardDescription className="text-base">{region.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{region.projects}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Featured Transformations</h2>
            <div className="space-y-8">
              {featuredProjects.map((project, index) => (
                <Card key={index} className="shadow-elegant border-accent/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="font-playfair text-2xl text-primary mb-2">{project.title}</CardTitle>
                        <CardDescription className="text-lg">{project.location}</CardDescription>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">{project.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed mb-6">{project.description}</p>
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Key Highlights:</h4>
                      <div className="space-y-2">
                        {project.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <p className="text-foreground/80">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Placeholder for project images */}
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="aspect-video bg-gradient-hero rounded-lg border border-border flex items-center justify-center"
                        >
                          <p className="text-muted-foreground">Project Image {i}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
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
