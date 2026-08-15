import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Home, Star } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import { Section, Grid, Stack, Divider } from "@/components/layout";

/**
 * The work itself: where Frontier operates, and three properties with the
 * numbers attached.
 *
 * Two chapters in one band, with a deliberate step down between them (§17):
 * "Our Destinations" opens at display size as the chapter heading, "Featured
 * Transformations" follows at section size as the act underneath it. They used
 * to be closer in weight, which read as two unrelated sections that happened
 * to share a background.
 *
 * §18 moves the "Before & After" caption out of the placeholder box and under
 * it, where a caption belongs — inside the box it read as the box's own label,
 * which is exactly wrong for a frame that will eventually hold the photographs
 * rather than describe them.
 *
 * The gallery used to break out of the container with `w-screen` and size each
 * project at `30vw`. That put three different widths on one page depending on
 * viewport and was the single least stable piece of layout on the site. It is
 * a normal three-column grid now — at the container's 1440px each project gets
 * ~440px, wider than the 30vw ever gave it below a 1500px screen.
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
  const [beforeAfterLabel, setBeforeAfterLabel] = useState("Before and After");

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
    <Section id="projects" size="lg">
      <Stack gap="xl">
        {/* Chapter opener — display size, larger than anything below it. */}
        <div className="max-w-3xl mx-auto text-center space-y-sm animate-fade-in">
          <EditableText id="projects-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as={headingAs} className="t-display text-primary text-balance">{destinationsTitle}</EditableText>
          <EditableText id="projects-destinations-lead" value={destinationsLead} onChange={setDestinationsLead} as="p" multiline className="t-body text-foreground/70">{destinationsLead}</EditableText>
        </div>

        <Grid cols={2}>
          {regions.map((region, index) => (
            <div key={index} className="border-t border-primary/15 pt-sm">
              {/* Not type — a flag glyph used as an icon, so it is sized in
                  absolute units rather than off the type scale. */}
              <div className="text-[2rem] mb-sm">{region.icon}</div>
              <EditableText id={`proj-region-name-${index}`} value={region.name} onChange={(v) => updateRegion(index, "name", v)} as="h3" className="t-item text-primary">{region.name}</EditableText>
              <EditableText id={`proj-region-sub-${index}`} value={region.subtitle} onChange={(v) => updateRegion(index, "subtitle", v)} as="p" className="t-meta text-accent-strong mt-1 mb-xs">{region.subtitle}</EditableText>
              <EditableText id={`proj-region-desc-${index}`} value={region.description} onChange={(v) => updateRegion(index, "description", v)} as="p" className="t-body text-foreground/70">{region.description}</EditableText>
              <EditableText id={`proj-region-proj-${index}`} value={region.projects} onChange={(v) => updateRegion(index, "projects", v)} as="p" className="t-body text-muted-foreground">{region.projects}</EditableText>
            </div>
          ))}
        </Grid>

        {/* The second act. One gold rule opens it, which is the whole reason
            the line is not scattered between every section on the page. */}
        <div>
          <Divider tone="gold" className="mb-lg" />
          <Stack gap="lg">
            <EditableText id="projects-transformations-title" value={transformationsTitle} onChange={setTransformationsTitle} as="h3" className="t-section text-primary text-center">{transformationsTitle}</EditableText>

            <Grid cols={3}>
              {featuredProjects.map((project, index) => (
                <div key={index}>
                  {/* Placeholder frame. One of the deliberate exceptions to
                      "fewer boxes": an unbounded empty area reads as a layout
                      fault rather than as a picture that has not arrived. */}
                  <div className="bg-muted/40 rounded-2xl aspect-[4/3] flex items-center justify-center">
                    <div className="text-center">
                      <Home className="w-10 h-10 text-accent-strong/60 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="t-meta text-muted-foreground/70">Coming Soon</p>
                    </div>
                  </div>

                  {/* §18: the caption sits under the image area, not inside
                      it. Once real photographs land in the frame above, this
                      line still reads as their caption. */}
                  <EditableText id={`proj-fp-ba-${index}`} value={beforeAfterLabel} onChange={setBeforeAfterLabel} as="p" className="t-meta text-accent-strong mt-xs mb-sm">{beforeAfterLabel}</EditableText>

                  <div className="border-t border-primary/15 pt-sm">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <EditableText id={`proj-fp-title-${index}`} value={project.title} onChange={(v) => updateProject(index, "title", v)} as="h4" className="t-item text-primary">{project.title}</EditableText>
                      <Badge variant="outline" className="border-accent-strong/40 text-accent-strong shrink-0">
                        <EditableText id={`proj-fp-type-${index}`} value={project.type} onChange={(v) => updateProject(index, "type", v)} as="span">{project.type}</EditableText>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-xs">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                      <EditableText id={`proj-fp-loc-${index}`} value={project.location} onChange={(v) => updateProject(index, "location", v)} as="span" className="t-meta">{project.location}</EditableText>
                    </div>

                    <EditableText id={`proj-fp-desc-${index}`} value={project.description} onChange={(v) => updateProject(index, "description", v)} as="p" multiline className="t-body text-foreground/70 mb-sm">{project.description}</EditableText>

                    <div className="flex flex-wrap gap-x-md gap-y-xs">
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
                </div>
              ))}
            </Grid>
          </Stack>
        </div>
      </Stack>
    </Section>
  );
};

export default ProjectsSection;
