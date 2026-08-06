import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * The objections, answered before the form.
 *
 * An owner does not hesitate because they are unconvinced by the service —
 * they hesitate because of the fee, the contract, and whether they can still
 * use their own house at Easter. Answering those in writing does more for
 * conversion than another paragraph about hospitality, and it is the section
 * most likely to be quoted back by a search engine or an assistant, so each
 * answer is written to stand alone.
 *
 * ⚠️ EVERY ANSWER IS A DRAFT. The commercial terms below — fee percentage,
 * notice period, owner-use policy, onboarding time — are placeholders written
 * to show the shape of the section. They are NOT the agreed terms. Have the
 * client confirm each one, in writing, before this goes live: published terms
 * an owner relies on are hard to walk back.
 */
const OwnerFaq = () => {
  const [items, setItems] = useState([
    {
      question: "What does management cost?",
      answer:
        "DRAFT — confirm before publishing. A percentage of the revenue we generate, charged only on nights that are actually booked. No setup fee, no monthly retainer, no charge for the photography or the listing work.",
    },
    {
      question: "Do you handle the tourist licence and guest registration in Andalusia?",
      answer:
        "Yes. Short-term lets in Andalusia need a registered tourist licence, and every guest has to be reported to the authorities within 24 hours of arrival. We register each stay for you and keep the paperwork in order.",
    },
    {
      question: "Can I still use my own property?",
      answer:
        "DRAFT — confirm before publishing. Yes. Block the dates you want in the owner dashboard and we work around them. The earlier you block, the less it costs you in high-season bookings.",
    },
    {
      question: "How long is the contract, and how do I leave?",
      answer:
        "DRAFT — confirm before publishing. A rolling agreement with a notice period, not a multi-year lock-in. Existing guest bookings are honoured after notice; everything else stops.",
    },
    {
      question: "How long does it take to go live?",
      answer:
        "DRAFT — confirm before publishing. Typically a few weeks from first visit to first booking: inspection and any prep work, then photography, then listings across the channels.",
    },
  ]);

  const updateItem = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  return (
    <section id="owner-faq" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="ofaq"
          eyebrow="Before you ask"
          heading="What owners want to know first."
        />

        <Accordion
          type="single"
          collapsible
          className="mt-14 max-w-3xl mx-auto bg-card border border-border rounded-2xl px-4 md:px-6"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`owner-faq-${index}`}
              className={index === items.length - 1 ? "border-b-0" : ""}
            >
              <AccordionTrigger className="text-left font-semibold text-primary">
                <EditableText
                  id={`ofaq-question-${index}`}
                  value={item.question}
                  onChange={(v) => updateItem(index, "question", v)}
                  as="span"
                >
                  {item.question}
                </EditableText>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <EditableText
                  id={`ofaq-answer-${index}`}
                  value={item.answer}
                  onChange={(v) => updateItem(index, "answer", v)}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed"
                >
                  {item.answer}
                </EditableText>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default OwnerFaq;
