import { useState } from "react";
import EditableText from "./admin/EditableText";

const IntroSection = () => {
  const [mainText, setMainText] = useState(
    "Your home deserves more than management — it deserves care, strategy, and master craftsmanship."
  );
  const [subText, setSubText] = useState(
    "Frontier Residences combines five-star hospitality with real estate intelligence to elevate every aspect of property ownership — ensuring financial performance, flawless operations, and a beautifully curated guest experience."
  );

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
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
