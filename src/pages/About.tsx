import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

const About = () => {
  // Editable content state
  const [pageTitle, setPageTitle] = useState("About Frontier Residences");
  const [pageSubtitle, setPageSubtitle] = useState("Premier property management across Europe's most desirable locations");
  const [missionTitle, setMissionTitle] = useState("Our Mission");
  const [missionText, setMissionText] = useState("Transform property ownership into effortless elegance through bespoke management. We combine international hospitality standards with local expertise to maximize your property's potential while ensuring exceptional guest experiences.");
  const [storyTitle, setStoryTitle] = useState("Our Story");
  const [storyText1, setStoryText1] = useState("Founded with a passion for luxury hospitality and real estate, Frontier Residences emerged from the recognition that property owners deserve more than standard management services. We saw an opportunity to bridge the gap between traditional property management and the personalized, high-touch service that discerning owners and guests expect.");
  const [storyText2, setStoryText2] = useState("Today, we manage a curated portfolio of exceptional properties across Spain's Costa del Sol, Austria's Alpine regions, and Croatia's stunning coastline. Each property in our collection is treated with the same care and attention as if it were our own.");
  const [whyChooseTitle, setWhyChooseTitle] = useState("Why Choose Us");
  const [teamTitle, setTeamTitle] = useState("Meet the Team");
  const [teamSubtitle, setTeamSubtitle] = useState("Our diverse team brings together expertise in hospitality, real estate, technology, and business development.");
  const [howItWorksTitle, setHowItWorksTitle] = useState("How It Works");

  const [whyChooseItems, setWhyChooseItems] = useState([
    "Tailored management plans for each property",
    "International presence across Spain, Austria, and Croatia",
    "Transparent communication and detailed owner reporting",
    "End-to-end services from renovation to rental management",
    "Hotel-level hospitality with real estate expertise",
  ]);

  const teamMembers = [
    {
      name: "Alejandro Marinetto Rohr",
      role: "Founder & CEO",
      description: "Real estate strategy, marketing, and design leadership.",
    },
    {
      name: "Lorenz Aschbacher",
      role: "Co-Founder",
      description: "International hospitality and real estate expertise.",
    },
    {
      name: "Olek",
      role: "Partner",
      description: "Strategic partnerships and business development.",
    },
    {
      name: "Julien",
      role: "Partner",
      description: "Investment strategy and client relations.",
    },
    {
      name: "Carlos",
      role: "Technology Lead",
      description: "Digital innovation and platform development.",
    },
  ];

  const processSteps = [
    { step: "1", title: "Assessment", description: "Property evaluation and strategy." },
    { step: "2", title: "Preparation", description: "Photography and listing optimization." },
    { step: "3", title: "Launch", description: "Multi-platform listing and marketing." },
    { step: "4", title: "Management", description: "Guest service and maintenance." },
    { step: "5", title: "Reporting", description: "Transparent performance updates." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section with Glowing Background */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-beige via-secondary to-beige-dark">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1YTY5NTkiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 animate-fade-in">
            <EditableText
              id="about-page-title"
              value={pageTitle}
              onChange={setPageTitle}
              as="h1"
              className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6"
            >
              {pageTitle}
            </EditableText>
            <EditableText
              id="about-page-subtitle"
              value={pageSubtitle}
              onChange={setPageSubtitle}
              as="p"
              className="text-xl md:text-2xl text-foreground/80 leading-relaxed"
            >
              {pageSubtitle}
            </EditableText>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">

          {/* Mission */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="shadow-elegant border-primary/20">
              <CardContent className="pt-6">
                <EditableText
                  id="about-mission-title"
                  value={missionTitle}
                  onChange={setMissionTitle}
                  as="h2"
                  className="font-playfair text-3xl font-semibold text-primary mb-6 text-center"
                >
                  {missionTitle}
                </EditableText>
                <EditableText
                  id="about-mission-text"
                  value={missionText}
                  onChange={setMissionText}
                  as="p"
                  multiline
                  className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto"
                >
                  {missionText}
                </EditableText>
              </CardContent>
            </Card>
          </div>

          {/* Our Story */}
          <div className="max-w-5xl mx-auto mb-16">
            <EditableText
              id="about-story-title"
              value={storyTitle}
              onChange={setStoryTitle}
              as="h2"
              className="font-playfair text-3xl font-semibold text-primary mb-8 text-center"
            >
              {storyTitle}
            </EditableText>
            <div className="prose prose-lg max-w-none text-foreground/80 text-center">
              <EditableText
                id="about-story-text1"
                value={storyText1}
                onChange={setStoryText1}
                as="p"
                multiline
                className="mb-4"
              >
                {storyText1}
              </EditableText>
              <EditableText
                id="about-story-text2"
                value={storyText2}
                onChange={setStoryText2}
                as="p"
                multiline
              >
                {storyText2}
              </EditableText>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-4xl mx-auto mb-16">
            <EditableText
              id="about-why-choose-title"
              value={whyChooseTitle}
              onChange={setWhyChooseTitle}
              as="h2"
              className="font-playfair text-3xl font-semibold text-primary mb-8 text-center"
            >
              {whyChooseTitle}
            </EditableText>
            <div className="grid md:grid-cols-2 gap-4">
              {whyChooseItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-5 bg-card rounded-lg shadow-sm hover:shadow-elegant transition-all">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <EditableText
                    id={`about-why-item-${index}`}
                    value={item}
                    onChange={(newValue) => {
                      const newItems = [...whyChooseItems];
                      newItems[index] = newValue;
                      setWhyChooseItems(newItems);
                    }}
                    as="p"
                    className="text-base text-foreground"
                  >
                    {item}
                  </EditableText>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <EditableText
              id="about-team-title"
              value={teamTitle}
              onChange={setTeamTitle}
              as="h2"
              className="font-playfair text-3xl font-semibold text-primary mb-4 text-center"
            >
              {teamTitle}
            </EditableText>
            <EditableText
              id="about-team-subtitle"
              value={teamSubtitle}
              onChange={setTeamSubtitle}
              as="p"
              className="text-lg text-foreground/70 text-center mb-12 max-w-2xl mx-auto"
            >
              {teamSubtitle}
            </EditableText>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="shadow-elegant hover:shadow-soft transition-all">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 bg-gradient-sage rounded-full mx-auto mb-4"></div>
                    <h3 className="font-playfair text-xl font-semibold text-primary text-center mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary/80 font-medium text-center text-sm mb-3">{member.role}</p>
                    <p className="text-foreground/70 text-sm leading-relaxed text-center">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* The Listing Process */}
          <div className="max-w-4xl mx-auto">
            <EditableText
              id="about-how-it-works-title"
              value={howItWorksTitle}
              onChange={setHowItWorksTitle}
              as="h2"
              className="font-playfair text-3xl font-semibold text-primary mb-8 text-center"
            >
              {howItWorksTitle}
            </EditableText>
            <div className="grid md:grid-cols-3 gap-6">
              {processSteps.map((item, index) => (
                <Card key={index} className="shadow-sm hover:shadow-elegant transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-foreground/80">{item.description}</p>
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

export default About;