import { useRef, useState } from "react";
import { Building2, TrendingUp, Wrench, BarChart3, ArrowRight, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditableText from "./admin/EditableText";
import TechnologySection from "./TechnologySection";

interface BusinessAreasProps {
  showHeader?: boolean;
}

/**
 * Title + description list shared by three of the four detail panels.
 *
 * Declared at module scope on purpose. Defined inside BusinessAreas it would be
 * a new component type on every render, so React would unmount and remount the
 * whole list each time an EditableText fired onChange — which in admin edit
 * mode means losing focus after every single keystroke.
 */
const DetailList = ({
  items,
  idPrefix,
  onChange,
}: {
  items: { title: string; description: string }[];
  idPrefix: string;
  onChange: (index: number, field: "title" | "description", value: string) => void;
}) => (
  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
    {items.map((item, index) => (
      <div key={index} className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-accent-strong" />
        </div>
        <div>
          <EditableText
            id={`${idPrefix}-title-${index}`}
            value={item.title}
            onChange={(v) => onChange(index, "title", v)}
            as="h4"
            className="font-semibold text-primary text-sm md:text-base"
          >
            {item.title}
          </EditableText>
          <EditableText
            id={`${idPrefix}-desc-${index}`}
            value={item.description}
            onChange={(v) => onChange(index, "description", v)}
            as="p"
            className="text-foreground/70 text-sm mt-1"
          >
            {item.description}
          </EditableText>
        </div>
      </div>
    ))}
  </div>
);

/**
 * The single services section for owners. Three things used to say the same
 * thing in three places and now live here together:
 *
 *  1. this section (the offer),
 *  2. the old `PropertyManagement` block (12 near-identical cards repeating
 *     listings / pricing / housekeeping / guest comms — now dissolved, with its
 *     genuinely distinct hospitality details folded into "What's Included"),
 *  3. `TechnologySection` (the "how", rendered below as a panel).
 *
 * The four former sub-routes (/property-management, /guaranteed-income,
 * /renovations, /investments) are folded into the accordion at the bottom, so
 * the detail is one click away instead of one navigation away. The routes now
 * redirect here — which is exactly why nothing in this file links to them any
 * more: those links would have pointed at the section the reader is already in.
 */
const BusinessAreas = ({ showHeader = true }: BusinessAreasProps) => {
  const [sectionTitle, setSectionTitle] = useState("What We Take Off Your Hands");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "One team for the letting, the upkeep, the guests and the numbers — so owning the place stays enjoyable."
  );
  const [expertiseLabel, setExpertiseLabel] = useState("Our Expertise");
  const [pmTitle, setPmTitle] = useState("Property Management");
  const [pmSubtitle, setPmSubtitle] = useState("Bespoke management for villas and luxury residences");
  const [pmDescription, setPmDescription] = useState(
    "We manage your home with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset."
  );
  const [coreServiceLabel, setCoreServiceLabel] = useState("Our Core Service");
  const [whatsIncludedLabel, setWhatsIncludedLabel] = useState("What's Included");
  const [guaranteedIncomeTitle, setGuaranteedIncomeTitle] = useState("Guaranteed Income Program");
  const [guaranteedIncomeLabel, setGuaranteedIncomeLabel] = useState("Included");
  const [guaranteedIncomeDesc, setGuaranteedIncomeDesc] = useState(
    "Effortless ownership with a fixed monthly payment. We lease your property long-term, guaranteeing steady income regardless of occupancy — while maintaining and improving your home."
  );
  const [discoverBtnText, setDiscoverBtnText] = useState("Get your free cash flow analysis");
  const [learnMoreText, setLearnMoreText] = useState("Learn more");
  const [detailsHeading, setDetailsHeading] = useState("The detail, if you want it");

  // Additional services editable state
  const [renovationsTitle, setRenovationsTitle] = useState("Renovations & Design");
  const [renovationsDesc, setRenovationsDesc] = useState("Timeless Mediterranean interiors designed to elevate your home's value and rental performance.");
  const [renovationsDetails, setRenovationsDetails] = useState("We manage the full process: concept → construction → delivery → staging.");
  const [investmentsTitle, setInvestmentsTitle] = useState("Investments");
  const [investmentsDesc, setInvestmentsDesc] = useState("Curated real estate investments across Spain, Austria, and Croatia.");
  const [investmentsDetails, setInvestmentsDetails] = useState("We guide investors from acquisition to renovation and turnkey operations.");

  // The last four entries were lifted out of the dissolved PropertyManagement
  // block: they are the concrete, guest-facing promises that section had and
  // this one didn't. Everything else it listed was already covered above.
  const [propertyManagementServices, setPropertyManagementServices] = useState([
    "Architectural photography & luxury staging",
    "High-converting listings (Airbnb, Booking, & direct)",
    "24/7 guest communication & personalised check-ins",
    "Legal traveller registration & compliance",
    "Dynamic pricing & revenue optimisation",
    "Housekeeping, maintenance & inspections",
    "Transparent monthly financial reporting",
    "Self check-in with a personal key-box code",
    "A tailored survival guide: house rules, Wi-Fi, what's worth doing nearby",
    "Linens and towels washed and pressed after every stay",
    "Everyday essentials restocked — coffee, tea, soap, cleaning supplies",
  ]);

  /** Controlled so the "Learn more" links can open the matching panel. */
  const [openDetail, setOpenDetail] = useState<string>("");
  const detailsRef = useRef<HTMLDivElement>(null);

  const openDetailPanel = (value: string) => {
    setOpenDetail(value);
    // Let the panel mount before scrolling, otherwise we scroll to its
    // collapsed height and the content opens below the fold.
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const additionalServices = [
    {
      icon: Wrench,
      title: renovationsTitle,
      setTitle: setRenovationsTitle,
      description: renovationsDesc,
      setDescription: setRenovationsDesc,
      details: renovationsDetails,
      setDetails: setRenovationsDetails,
      detailValue: "renovations",
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
      detailValue: "investments",
      id: "investments"
    },
  ];

  // ---- Detail level, carried over from the four former sub-pages ----------
  // Editable ids keep their original prefixes (pmp-/gip-/reno-/inv-) so inline
  // edits made against those pages still address the same content.

  // Deliberately the *outcomes* from the old /property-management page rather
  // than its service list, which was a near word-for-word repeat of
  // "What's Included" above. "Zero operational gaps" was softened for the same
  // reason as the Technology block's "zero errors" claim.
  const [pmOutcomes, setPmOutcomes] = useState([
    "Higher occupancy",
    "Better nightly rates",
    "Faster responses",
    "Fewer gaps in day-to-day operations",
    "Increased long-term value",
  ]);

  const [giBenefits, setGiBenefits] = useState([
    { title: "Predictable monthly earnings", description: "Receive a fixed payment every month, regardless of bookings or occupancy rates." },
    { title: "Zero vacancy risk", description: "No more worrying about empty periods — your income is guaranteed." },
    { title: "Professional upkeep", description: "We maintain your property to the highest standards, protecting its long-term value." },
    { title: "Optional interior upgrades", description: "We can invest in design improvements to enhance your property's appeal." },
    { title: "AI-enhanced pricing & premium guest standards", description: "For hybrid models, benefit from our advanced technology and hospitality expertise." },
  ]);

  const [renoServices, setRenoServices] = useState([
    { title: "Architectural concept & mood boards", description: "We create inspiring visual concepts that capture the Mediterranean essence." },
    { title: "Budget planning", description: "Transparent cost estimation and financial planning for your project." },
    { title: "Renovation management", description: "End-to-end project oversight ensuring quality and timely delivery." },
    { title: "Material & furniture sourcing", description: "Curated selection of premium materials and furnishings." },
    { title: "Full interior design", description: "Complete design solutions from layout to final styling." },
    { title: "Styling & photography", description: "Professional staging and photography to showcase your property." },
    { title: "Rental optimisation post-renovation", description: "Maximise your return with strategic positioning and pricing." },
  ]);

  const [renoSteps, setRenoSteps] = useState(["Concept", "Construction", "Delivery", "Staging"]);

  // The old /investments page also listed the three countries; that story is
  // told once, by the country cards in the projects section.
  const [invServices, setInvServices] = useState([
    { title: "Market research & due diligence", description: "Comprehensive analysis of opportunities and risk assessment." },
    { title: "Revenue & ROI analysis", description: "Detailed financial projections and return calculations." },
    { title: "Purchase coordination", description: "Full support through the acquisition process." },
    { title: "Renovation strategy", description: "Value-add improvements to maximise property potential." },
    { title: "Full operational management", description: "Turnkey rental operations from day one." },
  ]);

  const updateAt = <T,>(items: T[], index: number, next: T, setter: (v: T[]) => void) => {
    const copy = [...items];
    copy[index] = next;
    setter(copy);
  };

  return (
    <section
      id="business-areas"
      className="py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-16 animate-fade-in">
            <EditableText
              id="ba-expertise-label"
              value={expertiseLabel}
              onChange={setExpertiseLabel}
              as="span"
              className="inline-block px-4 py-1.5 bg-accent/10 text-accent-strong text-sm font-medium rounded-full mb-4"
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
                      <EditableText
                        id="ba-pm-subtitle"
                        value={pmSubtitle}
                        onChange={setPmSubtitle}
                        as="p"
                        className="text-base md:text-lg lg:text-xl text-white/80 font-medium"
                      >
                        {pmSubtitle}
                      </EditableText>
                    </div>
                  </div>

                  <EditableText
                    id="ba-pm-desc"
                    value={pmDescription}
                    onChange={setPmDescription}
                    as="p"
                    multiline
                    className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl"
                  >
                    {pmDescription}
                  </EditableText>
                </div>

                {/* Two symmetrical boxes below */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                  {/* What's Included Box */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/20 h-full">
                    <h4 className="text-white font-semibold text-base md:text-lg mb-4 md:mb-5 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-white" />
                      <EditableText
                        id="ba-whats-included-label"
                        value={whatsIncludedLabel}
                        onChange={setWhatsIncludedLabel}
                        as="span"
                      >
                        {whatsIncludedLabel}
                      </EditableText>
                    </h4>
                    {/* Two columns from md up: eleven items in a single column
                        made this box roughly twice as tall as the one beside it. */}
                    <ul className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3">
                      {propertyManagementServices.map((service, i) => (
                        <li key={i} className="flex items-start gap-2.5 md:gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <EditableText
                            id={`ba-pm-service-${i}`}
                            value={service}
                            onChange={(newValue) => {
                              const newServices = [...propertyManagementServices];
                              newServices[i] = newValue;
                              setPropertyManagementServices(newServices);
                            }}
                            as="span"
                            className="text-white/90 text-xs md:text-sm"
                          >
                            {service}
                          </EditableText>
                        </li>
                      ))}
                    </ul>
                  </div>

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
                    <button
                      type="button"
                      onClick={() => openDetailPanel("guaranteed-income")}
                      className="inline-flex items-center gap-1 text-white text-sm font-medium mt-4 hover:gap-2 transition-all self-start"
                    >
                      <EditableText
                        id="ba-gi-learn-more"
                        value={learnMoreText}
                        onChange={setLearnMoreText}
                        as="span"
                      >
                        {learnMoreText}
                      </EditableText>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The old CTA pointed at /property-management, which now
                    redirects back into this very section. It sends readers to
                    the lead magnet instead. */}
                <a href="#property-evaluation">
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
                </a>
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
                        className="font-playfair text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3 group-hover:text-accent-strong transition-colors duration-300"
                      >
                        {service.title}
                      </EditableText>

                      {/* Description */}
                      <EditableText
                        id={`ba-${service.id}-desc`}
                        value={service.description}
                        onChange={service.setDescription}
                        as="p"
                        className="text-accent-strong font-medium mb-2 md:mb-3 text-sm md:text-base"
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
                      <div className="mt-auto">
                        <Button
                          variant="ghost"
                          onClick={() => openDetailPanel(service.detailValue)}
                          className="group/btn p-0 h-auto text-primary hover:text-accent-strong hover:bg-transparent font-semibold text-sm md:text-base"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How we deliver it — formerly its own full-page section */}
          <TechnologySection />

          {/* Detail level — replaces the four former sub-routes */}
          <div ref={detailsRef} className="pt-4 scroll-mt-24">
            <EditableText
              id="ba-details-heading"
              value={detailsHeading}
              onChange={setDetailsHeading}
              as="h3"
              className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-6 text-center"
            >
              {detailsHeading}
            </EditableText>

            <Accordion
              type="single"
              collapsible
              value={openDetail}
              onValueChange={setOpenDetail}
              className="bg-card border border-border rounded-2xl px-4 md:px-6"
            >
              <AccordionItem value="property-management">
                <AccordionTrigger className="text-left font-semibold text-primary">
                  Property Management — what it delivers
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 pb-2">
                    {pmOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-accent-strong shrink-0" />
                        <EditableText
                          id={`pmp-benefit-${index}`}
                          value={outcome}
                          onChange={(v) => updateAt(pmOutcomes, index, v, setPmOutcomes)}
                          as="span"
                          className="text-foreground/80 text-sm md:text-base"
                        >
                          {outcome}
                        </EditableText>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="guaranteed-income">
                <AccordionTrigger className="text-left font-semibold text-primary">
                  Guaranteed Income Program — how it works
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <DetailList
                    items={giBenefits}
                    idPrefix="gip-benefit"
                    onChange={(index, field, value) =>
                      updateAt(giBenefits, index, { ...giBenefits[index], [field]: value }, setGiBenefits)
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="renovations">
                <AccordionTrigger className="text-left font-semibold text-primary">
                  Renovations &amp; Design — what we handle
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <DetailList
                    items={renoServices}
                    idPrefix="reno-service"
                    onChange={(index, field, value) =>
                      updateAt(renoServices, index, { ...renoServices[index], [field]: value }, setRenoServices)
                    }
                  />
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    {renoSteps.map((step, index) => (
                      <span key={index} className="flex items-center gap-3">
                        <EditableText
                          id={`reno-step-${index}`}
                          value={step}
                          onChange={(v) => updateAt(renoSteps, index, v, setRenoSteps)}
                          as="span"
                          className="font-semibold text-accent-strong"
                        >
                          {step}
                        </EditableText>
                        {index < renoSteps.length - 1 && <span className="text-accent-strong">→</span>}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="investments" className="border-b-0">
                <AccordionTrigger className="text-left font-semibold text-primary">
                  Investments — how we support buyers
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <DetailList
                    items={invServices}
                    idPrefix="inv-service"
                    onChange={(index, field, value) =>
                      updateAt(invServices, index, { ...invServices[index], [field]: value }, setInvServices)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessAreas;
