import { useState } from "react";
import { Building2, TrendingUp, Wrench, BarChart3, ArrowRight, Check, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

interface BusinessAreasProps {
  showHeader?: boolean;
}

const BusinessAreas = ({ showHeader = true }: BusinessAreasProps) => {
  const [sectionTitle, setSectionTitle] = useState("Business Areas");
  const [sectionSubtitle, setSectionSubtitle] = useState("Comprehensive services designed to maximize your property's potential");
  const [expertiseLabel, setExpertiseLabel] = useState("Our Expertise");
  const [pmTitle, setPmTitle] = useState("Property Management");
  const [coreServiceLabel, setCoreServiceLabel] = useState("Our Core Service");
  const [guaranteedIncomeTitle, setGuaranteedIncomeTitle] = useState("Guaranteed Income Program");
  const [guaranteedIncomeLabel, setGuaranteedIncomeLabel] = useState("Included");
  const [guaranteedIncomeDesc, setGuaranteedIncomeDesc] = useState(
    "Effortless ownership with a fixed monthly payment. We lease your property long-term, guaranteeing steady income regardless of occupancy — while maintaining and improving your home."
  );
  const [discoverBtnText, setDiscoverBtnText] = useState("Discover Our Services");
  const [learnMoreText, setLearnMoreText] = useState("Learn more");
  
  // Additional services editable state
  const [renovationsTitle, setRenovationsTitle] = useState("Renovations & Design");
  const [renovationsDesc, setRenovationsDesc] = useState("Timeless Mediterranean interiors designed to elevate your home's value and rental performance.");
  const [renovationsDetails, setRenovationsDetails] = useState("We manage the full process: concept → construction → delivery → staging.");
  const [investmentsTitle, setInvestmentsTitle] = useState("Investments");
  const [investmentsDesc, setInvestmentsDesc] = useState("Curated real estate investments across Spain and Austria.");
  const [investmentsDetails, setInvestmentsDetails] = useState("We guide investors from acquisition to renovation and turnkey operations.");

  const additionalServices = [
    {
      icon: Wrench,
      title: renovationsTitle,
      setTitle: setRenovationsTitle,
      description: renovationsDesc,
      setDescription: setRenovationsDesc,
      details: renovationsDetails,
      setDetails: setRenovationsDetails,
      href: "/renovations",
      id: "renovations"
    },
    {
      icon: BarChart3,
      title: investmentsTitle,
      setTitle: setInvestmentsTitle,
      description: investmentsDesc,
      setDescription: setInvestmentsDesc,
      details: investmentsDetails,
      setDetails: setInvestmentsDetails,
      href: "/investments",
      id: "investments"
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-16 animate-fade-in">
            <EditableText
              id="ba-expertise-label"
              value={expertiseLabel}
              onChange={setExpertiseLabel}
              as="span"
              className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4"
            >
              {expertiseLabel}
            </EditableText>
            <EditableText
              id="ba-title"
              value={sectionTitle}
              onChange={setSectionTitle}
              as="h2"
              className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6"
            >
              {sectionTitle}
            </EditableText>
            <EditableText
              id="ba-subtitle"
              value={sectionSubtitle}
              onChange={setSectionSubtitle}
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {sectionSubtitle}
            </EditableText>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Property Management - Full Width Hero Banner */}
          <div className="group relative">
            <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative p-6 md:p-10 lg:p-12 xl:p-16">
                {/* Top section - Title, subtitle, description */}
                <div className="mb-8 md:mb-10">
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 md:mb-6">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <EditableText
                      id="ba-core-service-label"
                      value={coreServiceLabel}
                      onChange={setCoreServiceLabel}
                      as="span"
                      className="text-white/90 text-xs md:text-sm font-medium"
                    >
                      {coreServiceLabel}
                    </EditableText>
                  </div>
                  
                  <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <EditableText
                        id="ba-pm-title"
                        value={pmTitle}
                        onChange={setPmTitle}
                        as="h3"
                        className="font-playfair text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 md:mb-2"
                      >
                        {pmTitle}
                      </EditableText>
                    </div>
                  </div>
                  {/* The subtitle and description that stood here were the
                      fourth and fifth phrasing of the page's positioning. The
                      boutique-hotel sentence is now the hero's second line. */}
                </div>

                {/* Single box now: the "What's Included" list that used to sit
                    beside this one repeated the Our Services section verbatim. */}
                <div className="mb-8">
                  {/* Guaranteed Income Program Box */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/20 h-full flex flex-col">
                    <div className="flex items-start gap-3 md:gap-4 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <EditableText
                          id="ba-gi-title"
                          value={guaranteedIncomeTitle}
                          onChange={setGuaranteedIncomeTitle}
                          as="h4"
                          className="text-white font-semibold text-base md:text-lg"
                        >
                          {guaranteedIncomeTitle}
                        </EditableText>
                        <EditableText
                          id="ba-gi-label"
                          value={guaranteedIncomeLabel}
                          onChange={setGuaranteedIncomeLabel}
                          as="span"
                          className="px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full border border-white/30"
                        >
                          {guaranteedIncomeLabel}
                        </EditableText>
                      </div>
                    </div>
                    <EditableText
                      id="ba-gi-desc"
                      value={guaranteedIncomeDesc}
                      onChange={setGuaranteedIncomeDesc}
                      as="p"
                      multiline
                      className="text-white/80 text-sm md:text-base leading-relaxed flex-grow"
                    >
                      {guaranteedIncomeDesc}
                    </EditableText>
                    <Link to="/guaranteed-income" className="inline-flex items-center gap-1 text-white text-sm font-medium mt-4 hover:gap-2 transition-all">
                      <EditableText
                        id="ba-gi-learn-more"
                        value={learnMoreText}
                        onChange={setLearnMoreText}
                        as="span"
                      >
                        {learnMoreText}
                      </EditableText>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <Link to="/property-management">
                  <Button 
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold px-6 md:px-8"
                  >
                    <EditableText
                      id="ba-discover-btn"
                      value={discoverBtnText}
                      onChange={setDiscoverBtnText}
                      as="span"
                    >
                      {discoverBtnText}
                    </EditableText>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Services - Two Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative h-full min-h-[280px] md:min-h-[300px] rounded-xl md:rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-accent/30">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Decorative corner accent */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
                    
                    <div className="relative p-5 md:p-6 lg:p-8 h-full flex flex-col">
                      {/* Icon */}
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      
                      {/* Title */}
                      <EditableText
                        id={`ba-${service.id}-title`}
                        value={service.title}
                        onChange={service.setTitle}
                        as="h3"
                        className="font-playfair text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300"
                      >
                        {service.title}
                      </EditableText>
                      
                      {/* Description */}
                      <EditableText
                        id={`ba-${service.id}-desc`}
                        value={service.description}
                        onChange={service.setDescription}
                        as="p"
                        className="text-accent font-medium mb-2 md:mb-3 text-sm md:text-base"
                      >
                        {service.description}
                      </EditableText>
                      
                      {/* Details */}
                      <EditableText
                        id={`ba-${service.id}-details`}
                        value={service.details}
                        onChange={service.setDetails}
                        as="p"
                        className="text-foreground/70 leading-relaxed mb-4 md:mb-6 text-sm md:text-base flex-grow"
                      >
                        {service.details}
                      </EditableText>
                      
                      {/* CTA Button */}
                      <Link to={service.href} className="mt-auto">
                        <Button 
                          variant="ghost" 
                          className="group/btn p-0 h-auto text-primary hover:text-accent hover:bg-transparent font-semibold text-sm md:text-base"
                        >
                          Learn More 
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessAreas;