import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * Guest reviews, rendered as real HTML rather than an embedded widget.
 *
 * That choice is the whole point of the section: an Airbnb or Booking widget
 * arrives in an iframe, which means a crawler sees an empty box and the review
 * text counts for nothing. Written into the page as text, the same reviews can
 * later carry Review/AggregateRating schema and show up as stars in results.
 *
 * ⚠️ PLACEHOLDER COPY. Every quote, name and location below is scaffolding so
 * the layout can be reviewed — none of it is a real review. Replace all three
 * with genuine, attributable reviews (inline editing, ids `gr-*`) before this
 * goes live. Publishing invented reviews is misleading, and in the EU it is
 * also unlawful under the Unfair Commercial Practices Directive. The same
 * applies to the rating in the hero.
 */

type Review = { quote: string; name: string; detail: string };

/**
 * Module scope on purpose: defined inside GuestReviews this would be a new
 * component type on every render, so an EditableText would lose focus after
 * each keystroke in admin edit mode.
 */
const ReviewCard = ({
  review,
  index,
  onChange,
}: {
  review: Review;
  index: number;
  onChange: (index: number, field: keyof Review, value: string) => void;
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
      id={`gr-quote-${index}`}
      value={review.quote}
      onChange={(v) => onChange(index, "quote", v)}
      as="p"
      multiline
      className="text-foreground/80 leading-relaxed flex-grow"
    >
      {review.quote}
    </EditableText>
    <div className="mt-6">
      <EditableText
        id={`gr-name-${index}`}
        value={review.name}
        onChange={(v) => onChange(index, "name", v)}
        as="p"
        className="font-semibold text-primary text-sm"
      >
        {review.name}
      </EditableText>
      <EditableText
        id={`gr-detail-${index}`}
        value={review.detail}
        onChange={(v) => onChange(index, "detail", v)}
        as="p"
        className="text-foreground/60 text-sm"
      >
        {review.detail}
      </EditableText>
    </div>
  </Card>
);

const GuestReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Marbella · via Airbnb",
    },
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Vienna · via Booking.com",
    },
    {
      quote: "Placeholder — replace with a real guest review.",
      name: "Guest name",
      detail: "Istria · booked direct",
    },
  ]);

  const updateReview = (
    index: number,
    field: keyof Review,
    value: string
  ) => {
    const next = [...reviews];
    next[index] = { ...next[index], [field]: value };
    setReviews(next);
  };

  return (
    <section id="reviews" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="gr"
          eyebrow="What guests say"
          heading="The reviews do the selling."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              review={review}
              index={index}
              onChange={updateReview}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuestReviews;
