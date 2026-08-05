import { useState } from "react";
import EditableText from "./admin/EditableText";

/**
 * Short bridge between the hero and the owner track. Deliberately kept to a
 * heading plus two lines — it sets the frame, the sections below carry the
 * argument. The heading is the point: without it the two sentences floated with
 * no indication of what the page was about.
 */
const IntroSection = () => {
  const [heading, setHeading] = useState("More Than Property Management");
  const [mainText, setMainText] = useState(
    "Your home deserves more than management — it deserves care, strategy, and master craftsmanship."
  );
  // Condensed from a three-clause sentence whose promises (financial
  // performance, flawless operations, curated guest experience) are all made
  // again — with substance — in the services section below.
  const [subText, setSubText] = useState(
    "Five-star hospitality and real estate intelligence, applied to every part of owning your property."
  );

  return (
    <section id="intro" className="py-16 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <EditableText
            id="intro-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-6"
          >
            {heading}
          </EditableText>
          <EditableText
            id="intro-main"
            value={mainText}
            onChange={setMainText}
            as="p"
            className="font-playfair text-2xl md:text-3xl text-primary leading-relaxed"
          >
            {mainText}
          </EditableText>
          <EditableText
            id="intro-sub"
            value={subText}
            onChange={setSubText}
            as="p"
            multiline
            className="mt-6 text-lg text-foreground/80 leading-relaxed"
          >
            {subText}
          </EditableText>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
