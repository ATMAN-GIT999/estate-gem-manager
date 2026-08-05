import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * Social proof for both audiences, which is why it sits last: by this point a
 * guest has seen the homes and an owner has seen the offer, and each needs the
 * same reassurance from someone who is not us.
 *
 * ⚠️ PLACEHOLDER COPY. Every quote and name below is invented scaffolding so
 * the layout can be reviewed — none of it is a real review. Replace all six
 * with genuine, attributable testimonials (inline editing, ids `tst-*`) before
 * this goes live. Publishing fabricated reviews would be misleading, and in
 * the EU it is also unlawful under the Unfair Commercial Practices Directive.
 */

type Testimonial = { quote: string; name: string; detail: string };

/**
 * Module scope on purpose: defined inside Testimonials this would be a new
 * component type on every render, so an EditableText would lose focus after
 * each keystroke in admin edit mode.
 */
const TestimonialCard = ({
  testimonial,
  idPrefix,
  index,
  onChange,
}: {
  testimonial: Testimonial;
  idPrefix: string;
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
      id={`${idPrefix}-quote-${index}`}
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
        id={`${idPrefix}-name-${index}`}
        value={testimonial.name}
        onChange={(v) => onChange(index, "name", v)}
        as="p"
        className="font-semibold text-primary text-sm"
      >
        {testimonial.name}
      </EditableText>
      <EditableText
        id={`${idPrefix}-detail-${index}`}
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

const Testimonials = () => {
  const [guestsLabel, setGuestsLabel] = useState("Guests");
  const [ownersLabel, setOwnersLabel] = useState("Owners");

  const [guestQuotes, setGuestQuotes] = useState<Testimonial[]>([
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Stayed in Marbella",
    },
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Stayed in Vienna",
    },
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Stayed in Istria",
    },
  ]);

  const [ownerQuotes, setOwnerQuotes] = useState<Testimonial[]>([
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

  const updateIn =
    (
      items: Testimonial[],
      setItems: (next: Testimonial[]) => void
    ) =>
    (index: number, field: keyof Testimonial, value: string) => {
      const next = [...items];
      next[index] = { ...next[index], [field]: value };
      setItems(next);
    };

  return (
    <section id="testimonials" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="tst"
          eyebrow="What people say"
          heading="Trusted by guests and owners alike."
        />

        <Tabs defaultValue="guests" className="mt-14 max-w-6xl mx-auto">
          <TabsList className="mx-auto flex w-fit mb-12">
            <TabsTrigger value="guests">
              <EditableText
                id="tst-tab-guests"
                value={guestsLabel}
                onChange={setGuestsLabel}
                as="span"
              >
                {guestsLabel}
              </EditableText>
            </TabsTrigger>
            <TabsTrigger value="owners">
              <EditableText
                id="tst-tab-owners"
                value={ownersLabel}
                onChange={setOwnersLabel}
                as="span"
              >
                {ownersLabel}
              </EditableText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="mt-0">
            <div className="grid gap-6 md:grid-cols-3">
              {guestQuotes.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  idPrefix="tst-guest"
                  index={index}
                  onChange={updateIn(guestQuotes, setGuestQuotes)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="owners" className="mt-0">
            <div className="grid gap-6 md:grid-cols-3">
              {ownerQuotes.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  idPrefix="tst-owner"
                  index={index}
                  onChange={updateIn(ownerQuotes, setOwnerQuotes)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Testimonials;
