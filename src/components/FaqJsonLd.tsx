import { Helmet } from "react-helmet-async";

export type FaqItem = { question: string; answer: string };

/**
 * Emits schema.org FAQPage data for an accordion.
 *
 * The accordion itself is not enough. Radix keeps closed panels out of the
 * DOM, so a prerendered page ships the questions and none of the answers —
 * and the answers are the part worth having, both for the rich result Google
 * can build from them and for an AI assistant looking for something quotable.
 * Structured data says the same thing in a form that does not depend on
 * whether anything was clicked.
 *
 * Radix's `forceMount` looked like the tidier fix — keep the panels mounted
 * and let the prerender pick up the visible text — but the accordion's closed
 * state is a height animation with no fill mode, not `display: none`, so every
 * answer simply stayed open. This carries the same content without touching
 * the interface.
 *
 * Answers still marked DRAFT are withheld. The owner FAQ carries provisional
 * commercial terms — fees, notice periods — and publishing those as structured
 * data hands Google a version of the contract to show in search results before
 * anyone has agreed to it. Clear the DRAFT prefix and the entry starts
 * publishing itself; nothing else has to change.
 */
const isPublishable = (item: FaqItem) =>
  item.question.trim().length > 0 &&
  item.answer.trim().length > 0 &&
  !/^\s*draft\b/i.test(item.answer);

const FaqJsonLd = ({ items }: { items: FaqItem[] }) => {
  const publishable = items.filter(isPublishable);
  if (publishable.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishable.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default FaqJsonLd;
