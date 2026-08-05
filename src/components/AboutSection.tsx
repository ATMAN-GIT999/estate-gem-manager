import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import EditableText from "@/components/admin/EditableText";

/**
 * Who we are and how working with us actually runs — condensed from the former
 * /about page into one block.
 *
 * Cut on the way in:
 *  - "Why Choose Us" (5 bullets) restated, almost word for word, claims already
 *    made by the services section, the trust band and the technology panel.
 *  - "Our Story" was two paragraphs of founding prose; the part that carries
 *    information is kept, the rest is gone.
 *
 * The team cards render initials rather than the empty grey circles they used
 * to show. Swap in a `photo` per member when the client supplies portraits —
 * an obviously-unfinished avatar undercuts the one section whose entire job is
 * building trust.
 */

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const AboutSection = () => {
  const [sectionTitle, setSectionTitle] = useState("The Team Behind Your Property");
  const [missionTitle, setMissionTitle] = useState("Our Mission");
  const [missionText, setMissionText] = useState(
    "Turn property ownership into effortless elegance — international hospitality standards, applied with local expertise."
  );
  const [storyText, setStoryText] = useState(
    "Frontier Residences was founded on a simple observation: owners of exceptional homes were being offered standard management. Today we look after a curated portfolio across Spain's Costa del Sol, Austria's Alpine regions and the Croatian coast — each property treated as if it were our own."
  );
  const [teamSubtitle, setTeamSubtitle] = useState(
    "Hospitality, real estate, technology and business development — the people you actually deal with."
  );
  const [howItWorksTitle, setHowItWorksTitle] = useState("How It Works");

  const [teamMembers, setTeamMembers] = useState([
    { name: "Alejandro Marinetto Rohr", role: "Co-Founder", description: "Real estate strategy, marketing, and design leadership." },
    { name: "Lorenz Aschbacher", role: "Co-Founder", description: "Business development, investment strategy, client relations, and scale & growth." },
    { name: "Olek", role: "Marketing", description: "Brand strategy, digital marketing, and demand generation." },
    { name: "Julien", role: "Guest Manager", description: "Guest experience, hospitality operations, and end-to-end stay management." },
  ]);

  const [processSteps, setProcessSteps] = useState([
    { step: "1", title: "Assessment", description: "Property evaluation and strategy." },
    { step: "2", title: "Preparation", description: "Photography and listing optimization." },
    { step: "3", title: "Launch", description: "Multi-platform listing and marketing." },
    { step: "4", title: "Management", description: "Guest service and maintenance." },
    { step: "5", title: "Reporting", description: "Transparent performance updates." },
  ]);

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const updateProcessStep = (index: number, field: string, value: string) => {
    const updated = [...processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setProcessSteps(updated);
  };

  return (
    <section id="about" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <EditableText
            id="about-page-title"
            value={sectionTitle}
            onChange={setSectionTitle}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            {sectionTitle}
          </EditableText>
          <EditableText
            id="about-mission-text"
            value={missionText}
            onChange={setMissionText}
            as="p"
            multiline
            className="text-xl text-foreground/80 leading-relaxed mb-4"
          >
            {missionText}
          </EditableText>
          <EditableText
            id="about-story-text1"
            value={storyText}
            onChange={setStoryText}
            as="p"
            multiline
            className="text-base text-foreground/70 leading-relaxed"
          >
            {storyText}
          </EditableText>
          {/* Kept mounted but visually hidden: the admin inline editor addresses
              content by id, and dropping these ids would orphan any edits the
              client already made to the mission/story headings. */}
          <span className="sr-only">
            <EditableText id="about-mission-title" value={missionTitle} onChange={setMissionTitle} as="span">{missionTitle}</EditableText>
          </span>
        </div>

        {/* Team */}
        <div className="max-w-5xl mx-auto mb-16">
          <EditableText
            id="about-team-subtitle"
            value={teamSubtitle}
            onChange={setTeamSubtitle}
            as="p"
            className="text-lg text-foreground/70 text-center mb-10 max-w-2xl mx-auto"
          >
            {teamSubtitle}
          </EditableText>
          {/* Four columns for four people. The old grid went to five and left a
              visible hole at the end of the row. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-soft transition-all">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-sage rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-playfair text-2xl font-bold text-primary-foreground">
                      {initialsOf(member.name)}
                    </span>
                  </div>
                  <EditableText
                    id={`about-team-name-${index}`}
                    value={member.name}
                    onChange={(v) => updateTeamMember(index, "name", v)}
                    as="h3"
                    className="font-playfair text-xl font-semibold text-primary text-center mb-1"
                  >{member.name}</EditableText>
                  <EditableText
                    id={`about-team-role-${index}`}
                    value={member.role}
                    onChange={(v) => updateTeamMember(index, "role", v)}
                    as="p"
                    className="text-primary/80 font-medium text-center text-sm mb-3"
                  >{member.role}</EditableText>
                  <EditableText
                    id={`about-team-desc-${index}`}
                    value={member.description}
                    onChange={(v) => updateTeamMember(index, "description", v)}
                    as="p"
                    className="text-foreground/70 text-sm leading-relaxed text-center"
                  >{member.description}</EditableText>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The Listing Process */}
        <div className="max-w-5xl mx-auto">
          <EditableText
            id="about-how-it-works-title"
            value={howItWorksTitle}
            onChange={setHowItWorksTitle}
            as="h3"
            className="font-playfair text-3xl font-semibold text-primary mb-8 text-center"
          >
            {howItWorksTitle}
          </EditableText>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((item, index) => (
              <Card key={index} className="shadow-sm hover:shadow-elegant transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <EditableText
                    id={`about-step-title-${index}`}
                    value={item.title}
                    onChange={(v) => updateProcessStep(index, "title", v)}
                    as="h4"
                    className="font-semibold text-lg text-primary mb-2"
                  >{item.title}</EditableText>
                  <EditableText
                    id={`about-step-desc-${index}`}
                    value={item.description}
                    onChange={(v) => updateProcessStep(index, "description", v)}
                    as="p"
                    className="text-sm text-foreground/80"
                  >{item.description}</EditableText>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
