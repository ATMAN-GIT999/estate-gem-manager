import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Home, Star } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

/**
 * The work itself: where Frontier operates, and three properties with the
 * numbers attached.
 *
 * "Our Destinations" opens the section as the chapter heading — bigger,
 * centred, its own moment — with "Featured Transformations" as the
 * secondary act underneath. The "Before & After" label lives inside each
 * project's own placeholder box rather than as one shared headline over the
 * whole gallery, so it reads as a caption per box, not a second section
 * title.
 *
 * Lifted out of the Projects page so it can sit on the property management
 * page without the content existing twice — the page now renders this too.
 * `headingAs` is why: the standalone page needs "Our Destinations" to be its
 * h1, the property management page needs it to be one h2 among many.
 */
const ProjectsSection = ({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) => {
  const [destinationsTitle, setDestinationsTitle] = useState("Our Destinations");
  const [destinationsLead, setDestinationsLead] = useState("Where Frontier operates — and what each destination means for an owner.");
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
  const updateStat = (pi: number, field: string, value: string) => {
    const u = [...featuredProjects];
    u[pi] = { ...u[pi], stats: { ...u[pi].stats, [field]: value } };
    setFeaturedProjects(u);
  };

  return (
    <section id="projects" className="py-24 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Chapter opener — larger than the section below it on purpose. */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in">
          <EditableText id="projects-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as={headingAs} className="t-display text-primary mb-5 text-balance">{destinationsTitle}</EditableText>
          <EditableText id="projects-destinations-lead" value={destinationsLead} onChange={setDestinationsLead} as="p" multiline className="t-body text-foreground/70">{destinationsLead}</EditableText>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto mb-28">
          {regions.map((region, index) => (
            <div key={index} className="border-t border-primary/15 pt-6">
              {/* Not type — a flag glyph used as an icon, so it is sized in
                  absolute units rather than off the type scale. */}
              <div className="text-[2rem] mb-4">{region.icon}</div>
              <EditableText id={`proj-region-name-${index}`} value={region.name} onChange={(v) => updateRegion(index, "name", v)} as="h4" className="t-item text-primary">{region.name}</EditableText>
              <EditableText id={`proj-region-sub-${index}`} value={region.subtitle} onChange={(v) => updateRegion(index, "subtitle", v)} as="p" className="t-meta text-accent-strong mt-1 mb-3">{region.subtitle}</EditableText>
              <EditableText id={`proj-region-desc-${index}`} value={region.description} onChange={(v) => updateRegion(index, "description", v)} as="p" className="t-body text-foreground/70 mb-2">{region.description}</EditableText>
              <EditableText id={`proj-region-proj-${index}`} value={region.projects} onChange={(v) => updateRegion(index, "projects", v)} as="p" className="t-body text-muted-foreground">{region.projects}</EditableText>
            </div>
          ))}
        </div>

        {/* Featured Transformations — the secondary act, smaller heading.
            The gallery itself breaks out of the standard container: three
            boxes at a fixed share of the viewport (not the container) read
            as a real gallery instead of three cards squeezed into 1152px. */}
        <div>
          <EditableText id="projects-transformations-title" value={transformationsTitle} onChange={setTransformationsTitle} as="h3" className="t-block text-primary mb-8 text-center">{transformationsTitle}</EditableText>
          <div className="w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 md:px-10">
            <div className="flex flex-col md:flex-row md:justify-center gap-x-10 gap-y-14">
              {featuredProjects.map((project, index) => (
              <div key={index} className="md:w-[30vw] border-t border-primary/15 pt-8">
                <div className="bg-muted/40 rounded-2xl aspect-[4/3] flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Home className="w-10 h-10 text-accent-strong/60 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="t-meta text-muted-foreground">Before &amp; After</p>
                    <p className="t-meta text-muted-foreground/70 mt-1">Coming Soon</p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <EditableText id={`proj-fp-title-${index}`} value={project.title} onChange={(v) => updateProject(index, "title", v)} as="h4" className="t-item text-primary">{project.title}</EditableText>
                  <Badge variant="outline" className="border-accent-strong/40 text-accent-strong shrink-0">
                    <EditableText id={`proj-fp-type-${index}`} value={project.type} onChange={(v) => updateProject(index, "type", v)} as="span">{project.type}</EditableText>
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  <EditableText id={`proj-fp-loc-${index}`} value={project.location} onChange={(v) => updateProject(index, "location", v)} as="span" className="t-meta">{project.location}</EditableText>
                </div>

                <EditableText id={`proj-fp-desc-${index}`} value={project.description} onChange={(v) => updateProject(index, "description", v)} as="p" multiline className="t-body text-foreground/70 mb-6">{project.description}</EditableText>

                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-accent-strong t-block">
                      <TrendingUp className="w-4 h-4" strokeWidth={2} />
                      <EditableText id={`proj-fp-occ-${index}`} value={project.stats.occupancy} onChange={(v) => updateStat(index, "occupancy", v)} as="span">{project.stats.occupancy}</EditableText>
                    </div>
                    <p className="t-meta text-muted-foreground mt-1">Occupancy</p>
                  </div>
                  <div>
                    <EditableText id={`proj-fp-rev-${index}`} value={project.stats.revenue} onChange={(v) => updateStat(index, "revenue", v)} as="p" className="text-accent-strong t-block">{project.stats.revenue}</EditableText>
                    <p className="t-meta text-muted-foreground mt-1">Revenue</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-accent-strong t-block">
                      <Star className="w-4 h-4" strokeWidth={2} />
                      <EditableText id={`proj-fp-rating-${index}`} value={project.stats.rating} onChange={(v) => updateStat(index, "rating", v)} as="span">{project.stats.rating}</EditableText>
                    </div>
                    <p className="t-meta text-muted-foreground mt-1">Rating</p>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
