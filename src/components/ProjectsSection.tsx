import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Star } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

/**
 * The proof section, placed directly after the offer: here is what we just
 * promised, and here is what it did to three real properties.
 *
 * Two things changed when this moved off its own route:
 *  - every project used to render a "Before & After Photos / Coming Soon"
 *    placeholder where the images should be. On a section whose whole job is
 *    selling transformations, an empty promise was worse than no image at all,
 *    so the layout now leads with the numbers. Drop real photography in as a
 *    `beforeAfter` image per project when the client supplies it.
 *  - the Spain card claimed "20+ premium properties under management" while the
 *    trust band a few sections up said 41. The count is now quoted once, there.
 */
const ProjectsSection = () => {
  const [sectionTitle, setSectionTitle] = useState("Results That Speak for Themselves");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "Three properties we took over, renovated and re-positioned — with the occupancy and revenue that followed."
  );
  const [destinationsTitle, setDestinationsTitle] = useState("Our Destinations");
  const [transformationsTitle, setTransformationsTitle] = useState("Featured Transformations");

  const [regions, setRegions] = useState([
    { name: "Spain", subtitle: "Costa del Sol", description: "Luxury villas and apartments in Marbella, Málaga, and surrounding areas", projects: "Our largest market, and where the company started", icon: "🇪🇸" },
    { name: "Austria", subtitle: "Vienna & Carinthia", description: "Urban elegance and Alpine retreats with exceptional rental yields", projects: "Cosmopolitan apartments and leisure properties", icon: "🇦🇹" },
    { name: "Croatia", subtitle: "Istria", description: "Mediterranean charm meets modern luxury in this emerging destination", projects: "Traditional homes transformed into premium rentals", icon: "🇭🇷" },
  ]);

  const [featuredProjects, setFeaturedProjects] = useState([
    {
      title: "Villa Hoyo 19", location: "La Quinta, Marbella", type: "Luxury Villa",
      description: "A stunning contemporary villa overlooking the golf course with panoramic sea views. Complete renovation transformed this property into one of the most sought-after rentals in the area.",
      highlights: ["Complete interior redesign", "Infinity pool installation", "Smart home integration", "Professional photography"],
      stats: { occupancy: "85%", revenue: "+120%", rating: "4.9" },
      headline: "",
    },
    {
      title: "Soho Boho", location: "Soho Arts District, Málaga", type: "Urban Apartment",
      description: "Transformed from €13,000 to €65,000 annual income through strategic renovation and positioning in Málaga's vibrant Soho Arts District.",
      highlights: ["Boho-style design with earthy tones", "Optimized layout for guests", "Premium location positioning", "Full staging & photography"],
      stats: { occupancy: "92%", revenue: "+400%", rating: "4.8" },
      // The single most quotable number on the site — given its own line.
      headline: "€13,000 → €65,000 a year",
    },
    {
      title: "Alpine Retreat", location: "Carinthia, Austria", type: "Mountain Property",
      description: "A charming Alpine property converted into a year-round rental with exceptional winter and summer appeal.",
      highlights: ["Traditional meets modern design", "Ski-in/ski-out access", "Spa facilities added", "Seasonal revenue optimization"],
      stats: { occupancy: "78%", revenue: "+85%", rating: "4.9" },
      headline: "",
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
    // secondary/30 rather than plain background: the evaluation section that
    // follows is background, and two untinted sections in a row read as one
    // very long stretch with no seam between proof and call to action.
    <section id="projects" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <EditableText id="projects-page-title" value={sectionTitle} onChange={setSectionTitle} as="h2" className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">{sectionTitle}</EditableText>
          <EditableText id="projects-page-subtitle" value={sectionSubtitle} onChange={setSectionSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed">{sectionSubtitle}</EditableText>
        </div>

        {/* Featured Projects — the proof leads, the geography follows */}
        <div className="max-w-6xl mx-auto mb-20">
          <EditableText id="projects-transformations-title" value={transformationsTitle} onChange={setTransformationsTitle} as="h3" className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">{transformationsTitle}</EditableText>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <Card key={index} className="shadow-elegant border-accent/20 overflow-hidden flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <EditableText id={`proj-fp-title-${index}`} value={project.title} onChange={(v) => updateProject(index, "title", v)} as="h4" className="font-playfair text-xl font-bold text-primary mb-1">{project.title}</EditableText>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <EditableText id={`proj-fp-loc-${index}`} value={project.location} onChange={(v) => updateProject(index, "location", v)} as="span">{project.location}</EditableText>
                      </div>
                    </div>
                    <Badge className="bg-accent text-accent-foreground shrink-0">
                      <EditableText id={`proj-fp-type-${index}`} value={project.type} onChange={(v) => updateProject(index, "type", v)} as="span">{project.type}</EditableText>
                    </Badge>
                  </div>

                  {project.headline && (
                    <EditableText
                      id={`proj-fp-headline-${index}`}
                      value={project.headline}
                      onChange={(v) => updateProject(index, "headline", v)}
                      as="p"
                      className="font-playfair text-2xl font-bold text-accent-strong mb-3"
                    >
                      {project.headline}
                    </EditableText>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-secondary/30 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-accent-strong font-bold text-lg">
                        <TrendingUp className="w-4 h-4" />
                        <EditableText id={`proj-fp-occ-${index}`} value={project.stats.occupancy} onChange={(v) => updateStat(index, "occupancy", v)} as="span">{project.stats.occupancy}</EditableText>
                      </div>
                      <p className="text-xs text-muted-foreground">Occupancy</p>
                    </div>
                    <div className="text-center">
                      <EditableText id={`proj-fp-rev-${index}`} value={project.stats.revenue} onChange={(v) => updateStat(index, "revenue", v)} as="span" className="text-accent-strong font-bold text-lg">{project.stats.revenue}</EditableText>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-accent-strong font-bold text-lg">
                        <Star className="w-4 h-4" />
                        <EditableText id={`proj-fp-rating-${index}`} value={project.stats.rating} onChange={(v) => updateStat(index, "rating", v)} as="span">{project.stats.rating}</EditableText>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <EditableText id={`proj-fp-desc-${index}`} value={project.description} onChange={(v) => updateProject(index, "description", v)} as="p" multiline className="text-foreground/80 text-sm leading-relaxed mb-4">{project.description}</EditableText>

                  {/* Highlights */}
                  <div className="mt-auto">
                    <div className="space-y-1.5">
                      {project.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0"></div>
                          <EditableText
                            id={`proj-fp-hl-${index}-${idx}`}
                            value={highlight}
                            onChange={(v) => updateHighlight(index, idx, v)}
                            as="p"
                            className="text-sm text-foreground/70"
                          >{highlight}</EditableText>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="max-w-6xl mx-auto">
          <EditableText id="projects-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as="h3" className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">{destinationsTitle}</EditableText>
          <div className="grid md:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
};

export default ProjectsSection;
