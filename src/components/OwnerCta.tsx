import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

/**
 * The close of the owner page, which until now simply stopped.
 *
 * It deliberately does not repeat the calculator directly above it. That path
 * is for an owner who wants a number on their own; this one is for an owner who
 * would rather talk to someone, which is usually the reader who has scrolled
 * this far.
 *
 * ⚠️ The action is a mailto because it is the only owner-facing channel the site
 * actually has — the address is the one in the footer. A booking link or a
 * contact form would convert better and is the client's call to make.
 *
 * `bg-gradient-hero` rather than the primary green: the footer immediately
 * below is already green, and two greens in a row would read as one block.
 */
const CONTACT_EMAIL = "Hello@frontier-residences.com";

const OwnerCta = () => {
  const [heading, setHeading] = useState("Less hassle, higher income, protected value.");
  const [lead, setLead] = useState("Tell us about your property and we'll walk you through what managing it with us would look like.");
  const [ctaText, setCtaText] = useState("Talk to us");

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <EditableText
            id="owner-cta-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4 text-balance"
          >
            {heading}
          </EditableText>

          <EditableText
            id="owner-cta-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="text-lg text-foreground/70 leading-relaxed mb-8"
          >
            {lead}
          </EditableText>

          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
            >
              <EditableText id="owner-cta-btn" value={ctaText} onChange={setCtaText} as="span">
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

export default OwnerCta;
