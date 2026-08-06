import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * Owner testimonials, kept apart from the guest reviews on the landing page.
 *
 * They are different evidence for different decisions: a guest review says the
 * house was clean, which tells an owner nothing about whether the money
 * arrives. Mixing them into one carousel — which the old Testimonials
 * component did, behind tabs — meant an owner had to click past three reviews
 * about the pool before reaching anything addressed to them.
 *
 * ⚠️ PLACEHOLDER COPY. Every quote and name below is scaffolding so the layout
 * can be reviewed — none of it is real. Replace all three with genuine,
 * attributable testimonials (inline editing, ids `ot-*`) before this goes
 * live. Publishing invented testimonials is misleading, and in the EU it is
 * also unlawful under the Unfair Commercial Practices Directive.
 */

type Testimonial = { quote: string; name: string; detail: string };

/**
 * Module scope on purpose: defined inside OwnerTestimonials this would be a
 * new component type on every render, so an EditableText would lose focus
 * after each keystroke in admin edit mode.
 */
const TestimonialCard = ({
  testimonial,
  index,
  onChange,
}: {
  testimonial: Testimonial;
  index: number;
  onChange: (index: number, field: keyof Testimonial, value: string) => void;
}) => (
  <Card className="p-8 bg-card border-border shadow-elegant flex flex-col">
    <div className="flex gap-1 mb-5" aria-label="Five out of five stars">
      {[0, 1, 2, 3, 4].map((star) => (
        <Star
          key={star}
          className="w-4 h-4 fill-accent text-accent"
          aria-hidden="true"
        />
      ))}
    </div>
    <EditableText
      id={`ot-quote-${index}`}
      value={testimonial.quote}
      onChange={(v) => onChange(index, "quote", v)}
      as="p"
      multiline
      className="text-foreground/80 leading-relaxed flex-grow"
    >
      {testimonial.quote}
    </EditableText>
    <div className="mt-6">
      <EditableText
        id={`ot-name-${index}`}
        value={testimonial.name}
        onChange={(v) => onChange(index, "name", v)}
        as="p"
        className="font-semibold text-primary text-sm"
      >
        {testimonial.name}
      </EditableText>
      <EditableText
        id={`ot-detail-${index}`}
        value={testimonial.detail}
        onChange={(v) => onChange(index, "detail", v)}
        as="p"
        className="text-foreground/60 text-sm"
      >
        {testimonial.detail}
      </EditableText>
    </div>
  </Card>
);

const OwnerTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      quote: "Placeholder — replace with a real owner testimonial.",
      name: "Owner name",
      detail: "Villa owner, Costa del Sol",
    },
    {
      quote: "Placeholder — replace with a real owner testimonial.",
      name: "Owner name",
      detail: "Apartment owner, Vienna",
    },
    {
      quote: "Placeholder — replace with a real owner testimonial.",
      name: "Owner name",
      detail: "Guaranteed Income Program",
    },
  ]);

  const updateTestimonial = (
    index: number,
    field: keyof Testimonial,
    value: string
  ) => {
    const next = [...testimonials];
    next[index] = { ...next[index], [field]: value };
    setTestimonials(next);
  };

  return (
    <section id="owner-testimonials" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="ot"
          eyebrow="What owners say"
          heading="Handed over, and glad they did."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              onChange={updateTestimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OwnerTestimonials;
