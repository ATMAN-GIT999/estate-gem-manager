import { useState } from "react";
import { Check, Minus, X } from "lucide-react";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";

/**
 * Self-managed vs. a typical agency vs. us.
 *
 * An owner weighing this decision is not choosing between us and nothing —
 * they are choosing between doing it themselves and handing it to someone.
 * A table answers that comparison directly instead of making them hold three
 * service lists in their head, and it is the shape a search engine or an
 * assistant can lift and quote whole.
 *
 * The claims are ours to keep true: every row marked for the Frontier column
 * is something the three pillars above already promise. Add a row here only
 * when the service behind it exists.
 */

type Support = "yes" | "partial" | "no";

const ICONS: Record<Support, { Icon: typeof Check; className: string; label: string }> = {
  yes: { Icon: Check, className: "text-accent-strong", label: "Included" },
  partial: { Icon: Minus, className: "text-foreground/40", label: "Sometimes" },
  no: { Icon: X, className: "text-foreground/25", label: "Not included" },
};

const SupportMark = ({ value }: { value: Support }) => {
  const { Icon, className, label } = ICONS[value];
  return (
    <span className="inline-flex justify-center w-full" title={label}>
      <Icon className={`w-5 h-5 ${className}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
};

const OwnerComparison = () => {
  const [columns, setColumns] = useState([
    "Self-managed",
    "Typical agency",
    "Frontier",
  ]);

  const [rows, setRows] = useState<
    { label: string; support: [Support, Support, Support] }[]
  >([
    { label: "Architectural photography & staging", support: ["no", "partial", "yes"] },
    { label: "Listed on Airbnb, Booking & direct", support: ["partial", "yes", "yes"] },
    { label: "Legal tourist registration (Andalusia)", support: ["no", "partial", "yes"] },
    { label: "Dynamic pricing on live market data", support: ["no", "partial", "yes"] },
    { label: "24/7 multilingual guest support", support: ["no", "partial", "yes"] },
    { label: "Cleaning, laundry & maintenance", support: ["partial", "yes", "yes"] },
    { label: "Transparent monthly reporting", support: ["no", "partial", "yes"] },
    { label: "Guaranteed income option", support: ["no", "no", "yes"] },
  ]);

  const updateColumn = (index: number, value: string) => {
    const next = [...columns];
    next[index] = value;
    setColumns(next);
  };

  const updateRow = (index: number, value: string) => {
    const next = [...rows];
    next[index] = { ...next[index], label: value };
    setRows(next);
  };

  return (
    <section id="comparison" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionIntro
          idPrefix="cmp"
          eyebrow="How we compare"
          heading="Three ways to run a holiday home."
          lead="The difference is rarely one big thing — it is the eight small ones that decide whether a property earns and stays in good condition."
        />

        {/* The table scrolls inside its own box on narrow screens rather than
            pushing the page sideways.

            `relative` is load-bearing, not decoration. Each cell's screen-reader
            label is a Tailwind `sr-only` span, which is `position: absolute` —
            and an absolutely positioned element is only clipped by an ancestor's
            overflow if that ancestor is itself positioned. Without this the
            eight labels escaped the scroll box, resolved against the viewport,
            and dragged the whole page 174px sideways on a phone. */}
        <div className="mt-14 max-w-4xl mx-auto overflow-x-auto relative">
          <table className="w-full min-w-[600px] border-collapse bg-card rounded-2xl shadow-elegant overflow-hidden">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="text-left p-5 font-normal">
                  <span className="sr-only">Service</span>
                </th>
                {columns.map((column, index) => {
                  const isUs = index === columns.length - 1;
                  return (
                    <th
                      key={index}
                      scope="col"
                      className={`p-5 text-center align-bottom ${
                        isUs ? "bg-primary" : ""
                      }`}
                    >
                      <EditableText
                        id={`cmp-column-${index}`}
                        value={column}
                        onChange={(v) => updateColumn(index, v)}
                        as="span"
                        className={
                          isUs
                            ? "font-playfair text-lg font-bold text-primary-foreground"
                            : "text-sm font-medium text-foreground/60"
                        }
                      >
                        {column}
                      </EditableText>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex < rows.length - 1 ? "border-b border-border" : ""}
                >
                  <th scope="row" className="text-left p-5 font-normal">
                    <EditableText
                      id={`cmp-row-${rowIndex}`}
                      value={row.label}
                      onChange={(v) => updateRow(rowIndex, v)}
                      as="span"
                      className="text-sm text-foreground/80"
                    >
                      {row.label}
                    </EditableText>
                  </th>
                  {row.support.map((support, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`p-5 text-center ${
                        columnIndex === row.support.length - 1 ? "bg-primary/5" : ""
                      }`}
                    >
                      <SupportMark value={support} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default OwnerComparison;
