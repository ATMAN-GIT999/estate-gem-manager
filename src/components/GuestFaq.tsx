import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditableText from "./admin/EditableText";
import FaqJsonLd from "./FaqJsonLd";
import SectionIntro from "./SectionIntro";

/**
 * Guest questions, answered at the bottom of the page.
 *
 * An accordion is the right shape twice over: it lets a reader who has already
 * decided scroll straight past, and it puts the questions people actually type
 * into a search box on the page as text. This is the section most likely to be
 * quoted back by a search engine or an assistant, so the answers are written
 * to stand on their own, out of context.
 *
 * ⚠️ The answers are drafts. They describe how the service is meant to work,
 * but nobody has confirmed the specifics — the cancellation window in
 * particular. Have the client check every one before this goes live.
 */
const GuestFaq = () => {
  const [items, setItems] = useState([
    {
      question: "Is it cheaper to book direct than on Airbnb or Booking.com?",
      answer:
        "Yes. The same home costs less booked here, because there is no platform commission on top of the nightly rate. You are also dealing with the team that manages the house, not a call centre.",
    },
    {
      question: "Who looks after the property while I'm staying?",
      answer:
        "We do. Every home in the collection is managed by Frontier directly, with a local team in each region. If something needs fixing during your stay, one message reaches the people who can fix it.",
    },
    {
      question: "How does check-in work?",
      answer:
        "Self check-in with your own keybox code, sent before you travel, so there is no waiting for a key handover after a late flight. If you would rather be met in person, tell us and we will arrange it.",
    },
    {
      question: "What if I need to cancel?",
      answer:
        "Cancellation terms are shown on each property before you confirm, and they follow the terms of the channel you book through. Booked direct, get in touch as early as you can and we will do what we can to help.",
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
    <section id="faq" className="py-24 bg-background scroll-mt-20">
      <FaqJsonLd items={items} />
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="gfaq"
          eyebrow="Good to know"
          heading="Questions guests ask before they book."
        />

        <Accordion
          type="single"
          collapsible
          className="mt-14 max-w-3xl mx-auto bg-card border border-border rounded-2xl px-4 md:px-6"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className={index === items.length - 1 ? "border-b-0" : ""}
            >
              <AccordionTrigger className="text-left font-semibold text-primary">
                <EditableText
                  id={`gfaq-question-${index}`}
                  value={item.question}
                  onChange={(v) => updateItem(index, "question", v)}
                  as="span"
                >
                  {item.question}
                </EditableText>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <EditableText
                  id={`gfaq-answer-${index}`}
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

export default GuestFaq;
