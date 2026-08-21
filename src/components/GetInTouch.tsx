import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Section, Stack } from "./layout";

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
    // `size="sm"` — the closing note, the one place a short band is correct.
    // A full measure of air around three lines would leave it stranded.
    <Section size="sm" measure="narrow">
      <Stack gap="sm" align="center">
        <div className="space-y-xs">
          <EditableText id="get-in-touch-heading" value={heading} onChange={setHeading} as="h2" className="t-block text-primary">
            {heading}
          </EditableText>
          <EditableText id="get-in-touch-trust" value={trustText} onChange={setTrustText} as="p" multiline className="t-body text-foreground/70">
            {trustText}
          </EditableText>
        </div>
        <div>
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
      </Stack>
    </Section>
  );
};

export default GetInTouch;
