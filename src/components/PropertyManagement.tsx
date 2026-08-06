import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ClipboardCheck,
  FileCheck,
  Globe,
  KeyRound,
  LineChart,
  MessagesSquare,
  PackageCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * The whole owner offer, in one section.
 *
 * It replaces three blocks that each said the same thing in different words —
 * the old `PropertyManagement` cards, `BusinessAreas` ("What's Included") and
 * `TechnologySection` ("how we deliver it"). Listings, pricing, housekeeping
 * and guest comms appeared in all three; a reader who scrolled through them in
 * order was told about dynamic pricing three times.
 *
 * Here the same material is three pillars — get it let, look after the guests,
 * look after the house — with the technology reduced to the one-line proof
 * strip underneath, because it is a reason to believe, not a fourth service.
 *
 * Every CTA in this section points at the cash-flow tool. The old ones pointed
 * at /book, which is the guest booking flow: an owner who clicked "contact us"
 * landed on a form asking which nights they wanted to stay.
 */

/** Icons per pillar, parallel to `pillars` below. Not editable content. */
const PILLAR_ICONS = [
  [Camera, Globe, LineChart, FileCheck],
  [UserCheck, KeyRound, MessagesSquare, BookOpen],
  [Sparkles, Wrench, ClipboardCheck, PackageCheck],
];

const PropertyManagement = () => {
  const [pillars, setPillars] = useState([
    {
      title: "Listing & revenue",
      lead: "Your home, presented to sell out — and priced to earn.",
      items: [
        "Architectural photography & staging",
        "Listed on Airbnb, Booking & direct",
        "Dynamic pricing on live market data",
        "Legal registration & compliance",
      ],
    },
    {
      title: "Guests, handled",
      lead: "Every guest screened, welcomed, and supported around the clock.",
      items: [
        "Screening before every booking",
        "Self check-in via keybox codes",
        "24/7 multilingual communication",
        "Personalised digital guest guide",
      ],
    },
    {
      title: "Your property, cared for",
      lead: "Cleaned, maintained, and inspected after every single stay.",
      items: [
        "Hotel-standard cleaning & laundry",
        "Handyman & maintenance on call",
        "Post-stay damage inspection",
        "Essentials restocked every turn",
      ],
    },
  ]);

  const [proofPoints, setProofPoints] = useState([
    "Live owner dashboard",
    "Dynamic pricing",
    "Automated multilingual guest comms",
    "Transparent monthly reporting",
  ]);

  const [giTitle, setGiTitle] = useState("Guaranteed Income Program");
  const [giDescription, setGiDescription] = useState(
    "Prefer certainty? We lease your property long-term and pay a fixed monthly income regardless of occupancy — while maintaining and improving your home."
  );
  const [giLinkText, setGiLinkText] = useState("Learn more");
  const [ctaText, setCtaText] = useState("Get your free cash flow analysis");

  const updatePillar = (
    index: number,
    field: "title" | "lead",
    value: string
  ) => {
    const next = [...pillars];
    next[index] = { ...next[index], [field]: value };
    setPillars(next);
  };

  const updatePillarItem = (
    pillarIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const next = [...pillars];
    const items = [...next[pillarIndex].items];
    items[itemIndex] = value;
    next[pillarIndex] = { ...next[pillarIndex], items };
    setPillars(next);
  };

  const updateProofPoint = (index: number, value: string) => {
    const next = [...proofPoints];
    next[index] = value;
    setProofPoints(next);
  };

  const scrollToEvaluator = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("property-evaluation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="property-management"
      className="py-24 bg-background scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        {/* The page hero above carries the "boutique hotel" headline this
            section used to open with. Two identical headings a screen apart
            read as a page that lost its place, so this one names the work. */}
        <SectionIntro
          idPrefix="pm2"
          eyebrow="What we do"
          heading="Everything a hotel does, for one house."
          lead="Three jobs, run as one: get it let at the right price, look after the guests, and look after the building."
        />

        <div className="mt-20 grid gap-12 md:gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {pillars.map((pillar, pillarIndex) => (
            <div key={pillarIndex}>
              <EditableText
                id={`pm2-pillar-${pillarIndex}-title`}
                value={pillar.title}
                onChange={(v) => updatePillar(pillarIndex, "title", v)}
                as="h3"
                className="font-playfair text-2xl font-bold text-primary mb-3"
              >
                {pillar.title}
              </EditableText>
              <EditableText
                id={`pm2-pillar-${pillarIndex}-lead`}
                value={pillar.lead}
                onChange={(v) => updatePillar(pillarIndex, "lead", v)}
                as="p"
                multiline
                className="text-foreground/70 leading-relaxed mb-8"
              >
                {pillar.lead}
              </EditableText>

              <ul className="space-y-4">
                {pillar.items.map((item, itemIndex) => {
                  const Icon =
                    PILLAR_ICONS[pillarIndex]?.[itemIndex] ?? Sparkles;
                  return (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-accent-strong shrink-0 mt-1" />
                      <EditableText
                        id={`pm2-pillar-${pillarIndex}-item-${itemIndex}`}
                        value={item}
                        onChange={(v) =>
                          updatePillarItem(pillarIndex, itemIndex, v)
                        }
                        as="span"
                        className="text-sm text-foreground/80"
                      >
                        {item}
                      </EditableText>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* The technology story, reduced to a single line. It used to be a
            full dark section of its own, three scroll-lengths from the
            services it explains — reasons to believe don't need a chapter. */}
        <div className="mt-20 max-w-6xl mx-auto border-y border-border py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-foreground/60">
            {proofPoints.map((point, index) => (
              <span key={index} className="flex items-center gap-3">
                <EditableText
                  id={`pm2-proof-${index}`}
                  value={point}
                  onChange={(v) => updateProofPoint(index, v)}
                  as="span"
                >
                  {point}
                </EditableText>
                {index < proofPoints.length - 1 && (
                  <span aria-hidden="true" className="text-accent-strong">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Guaranteed Income — the one genuinely separate offer, and the only
            piece of the old BusinessAreas block kept intact. */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card border border-border shadow-elegant p-8 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <EditableText
                  id="pm2-gi-title"
                  value={giTitle}
                  onChange={setGiTitle}
                  as="h3"
                  className="font-playfair text-2xl font-bold text-primary mb-3"
                >
                  {giTitle}
                </EditableText>
                <EditableText
                  id="pm2-gi-desc"
                  value={giDescription}
                  onChange={setGiDescription}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed"
                >
                  {giDescription}
                </EditableText>
                <Link
                  to="/guaranteed-income"
                  className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-accent-strong hover:gap-2 transition-all"
                >
                  <EditableText
                    id="pm2-gi-link"
                    value={giLinkText}
                    onChange={setGiLinkText}
                    as="span"
                  >
                    {giLinkText}
                  </EditableText>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="#property-evaluation" onClick={scrollToEvaluator}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant font-semibold px-8"
            >
              <EditableText
                id="pm2-cta"
                value={ctaText}
                onChange={setCtaText}
                as="span"
              >
                {ctaText}
              </EditableText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;
