import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";

const scrollToForm = () => {
  document.getElementById("owner-contact")?.scrollIntoView({ behavior: "smooth" });
};

/**
 * The last word before the footer — small on purpose. The real form is at
 * the top of the page now, so this isn't a second form, just a short nudge
 * back up to it for anyone who read all the way down without acting.
 */
const GetInTouch = () => {
  const [heading, setHeading] = useState("Get in touch.");
  const [trustText, setTrustText] = useState("No obligation, no pressure — just a conversation about what your property could earn under our management.");
  const [ctaText, setCtaText] = useState("Send enquiry");

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-xl mx-auto">
          <EditableText id="get-in-touch-heading" value={heading} onChange={setHeading} as="h2" className="t-block text-primary mb-3">
            {heading}
          </EditableText>
          <EditableText id="get-in-touch-trust" value={trustText} onChange={setTrustText} as="p" multiline className="t-body text-foreground/70 mb-8">
            {trustText}
          </EditableText>
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
          >
            <EditableText id="get-in-touch-cta" value={ctaText} onChange={setCtaText} as="span">
              {ctaText}
            </EditableText>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
