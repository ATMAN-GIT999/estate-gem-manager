import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Home, Star } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

/**
 * The work itself: where Frontier operates, and three properties with the
 * numbers attached.
 *
 * Lifted out of the Projects page so it can sit on the property management
 * page without the content existing twice — the page now renders this too.
 * `headingAs` is why: the standalone page needs the top line to be its h1,
 * the property management page needs it to be one h2 among many.
 */
const ProjectsSection = ({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) => {
  const [title, setTitle] = useState("Our Work: Precision, Performance, and Mediterranean Craftsmanship");
  const [subtitle, setSubtitle] = useState("Showcasing properties by country with before/after transformations, renovation stories, revenue improvements, and occupancy results.");
  const [destinationsTitle, setDestinationsTitle] = useState("Our Destinations");
  const [transformationsTitle, setTransformationsTitle] = useState("Featured Transformations");

  const [regions, setRegions] = useState([
    { name: "Spain", subtitle: "Costa del Sol", description: "Luxury villas and apartments in Marbella, Málaga, and surrounding areas", projects: "20+ premium properties under management", icon: "🇪🇸" },
    { name: "Austria", subtitle: "Vienna & Carinthia", description: "Urban elegance and Alpine retreats with exceptional rental yields", projects: "Cosmopolitan apartments and leisure properties", icon: "🇦🇹" },
  ]);

  const [featuredProjects, setFeaturedProjects] = useState([
    {
      title: "Villa Hoyo 19", location: "La Quinta, Marbella", type: "Luxury Villa",
      description: "A stunning contemporary villa overlooking the golf course with panoramic sea views. Complete renovation transformed this property into one of the most sought-after rentals in the area.",
      highlights: ["Complete interior redesign", "Infinity pool installation", "Smart home integration", "Professional photography"],
      stats: { occupancy: "85%", revenue: "+120%", rating: "4.9" },
    },
    {
      title: "Soho Boho", location: "Soho Arts District, Málaga", type: "Urban Apartment",
      description: "Transformed from €13,000 to €65,000 annual income through strategic renovation and positioning in Málaga's vibrant Soho Arts District.",
      highlights: ["Boho-style design with earthy tones", "Optimized layout for guests", "Premium location positioning", "Full staging & photography"],
      stats: { occupancy: "92%", revenue: "+400%", rating: "4.8" },
    },
    {
      title: "Alpine Retreat", location: "Carinthia, Austria", type: "Mountain Property",
      description: "A charming Alpine property converted into a year-round rental with exceptional winter and summer appeal.",
      highlights: ["Traditional meets modern design", "Ski-in/ski-out access", "Spa facilities added", "Seasonal revenue optimization"],
      stats: { occupancy: "78%", revenue: "+85%", rating: "4.9" },
    },
  ]);

  const updateRegion = (index: number, field: string, value: string) => {
    const u = [...regions]; u[index] = { ...u[index], [field]: value }; setRegions(u);
  };
  const updateProject = (index: number, field: string, value: string) => {
    const u = [...featuredProjects]; u[index] = { ...u[index], [field]: value }; setFeaturedProjects(u);
  };
  const updateHighlight = (pi: number, hi: number, value: string) => {
    const u = [...featuredProjects];
    const h = [...u[pi].highlights]; h[hi] = value;
    u[pi] = { ...u[pi], highlights: h };
    setFeaturedProjects(u);
  };
  const updateStat = (pi: number, field: string, value: string) => {
    const u = [...featuredProjects];
    u[pi] = { ...u[pi], stats: { ...u[pi].stats, [field]: value } };
    setFeaturedProjects(u);
  };

  return (
    <section id="projects" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <EditableText id="projects-page-title" value={title} onChange={setTitle} as={headingAs} className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">{title}</EditableText>
          <EditableText id="projects-page-subtitle" value={subtitle} onChange={setSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed">{subtitle}</EditableText>
        </div>

        {/* Regions */}
        <div className="max-w-6xl mx-auto mb-20">
          <EditableText id="projects-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as="h3" className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">{destinationsTitle}</EditableText>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {regions.map((region, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-gold transition-all hover:scale-105 duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-hero">
                  <div className="text-4xl mb-2">{region.icon}</div>
                  <CardTitle className="font-playfair text-2xl text-primary">
                    <EditableText id={`proj-region-name-${index}`} value={region.name} onChange={(v) => updateRegion(index, "name", v)} as="span">{region.name}</EditableText>
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-accent-strong">
                    <EditableText id={`proj-region-sub-${index}`} value={region.subtitle} onChange={(v) => updateRegion(index, "subtitle", v)} as="span">{region.subtitle}</EditableText>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <EditableText id={`proj-region-desc-${index}`} value={region.description} onChange={(v) => updateRegion(index, "description", v)} as="p" className="text-foreground/80 mb-4">{region.description}</EditableText>
                  <EditableText id={`proj-region-proj-${index}`} value={region.projects} onChange={(v) => updateRegion(index, "projects", v)} as="p" className="text-sm text-muted-foreground">{region.projects}</EditableText>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="max-w-6xl mx-auto">
          <EditableText id="projects-transformations-title" value={transformationsTitle} onChange={setTransformationsTitle} as="h3" className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">{transformationsTitle}</EditableText>
          <div className="space-y-12">
            {featuredProjects.map((project, index) => (
              <Card key={index} className="shadow-elegant border-accent/20 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="bg-gradient-hero p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <Home className="w-16 h-16 text-accent-strong mx-auto mb-4" />
                      <p className="text-muted-foreground">Before &amp; After Photos</p>
                      <p className="text-sm text-muted-foreground/70">Coming Soon</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <EditableText id={`proj-fp-title-${index}`} value={project.title} onChange={(v) => updateProject(index, "title", v)} as="h4" className="font-playfair text-2xl font-bold text-primary mb-2">{project.title}</EditableText>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <EditableText id={`proj-fp-loc-${index}`} value={project.location} onChange={(v) => updateProject(index, "location", v)} as="span">{project.location}</EditableText>
                        </div>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        <EditableText id={`proj-fp-type-${index}`} value={project.type} onChange={(v) => updateProject(index, "type", v)} as="span">{project.type}</EditableText>
                      </Badge>
                    </div>
                    <EditableText id={`proj-fp-desc-${index}`} value={project.description} onChange={(v) => updateProject(index, "description", v)} as="p" multiline className="text-foreground/80 leading-relaxed mb-6">{project.description}</EditableText>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-accent-strong font-bold text-xl">
                          <TrendingUp className="w-4 h-4" />
                          <EditableText id={`proj-fp-occ-${index}`} value={project.stats.occupancy} onChange={(v) => updateStat(index, "occupancy", v)} as="span">{project.stats.occupancy}</EditableText>
                        </div>
                        <p className="text-xs text-muted-foreground">Occupancy</p>
                      </div>
                      <div className="text-center">
                        <EditableText id={`proj-fp-rev-${index}`} value={project.stats.revenue} onChange={(v) => updateStat(index, "revenue", v)} as="span" className="text-accent-strong font-bold text-xl">{project.stats.revenue}</EditableText>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-accent-strong font-bold text-xl">
                          <Star className="w-4 h-4" />
                          <EditableText id={`proj-fp-rating-${index}`} value={project.stats.rating} onChange={(v) => updateStat(index, "rating", v)} as="span">{project.stats.rating}</EditableText>
                        </div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h5 className="font-semibold text-primary mb-3">Key Highlights:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {project.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <EditableText
                              id={`proj-fp-hl-${index}-${idx}`}
                              value={highlight}
                              onChange={(v) => updateHighlight(index, idx, v)}
                              as="p"
                              className="text-sm text-foreground/80"
                            >{highlight}</EditableText>
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
    </section>
  );
};

export default ProjectsSection;
