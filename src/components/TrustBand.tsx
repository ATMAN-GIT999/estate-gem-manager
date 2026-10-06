import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/translations";

/**
 * Four numbers on the one beige band of the owner page.
 *
 * The four that used to stand here ("41 Properties Managed · 1500+ Successful
 * Reservations · 8 Destinations · 50+ Collaborators") said less than they
 * looked like they said: nothing separated the total ever managed from the
 * portfolio as it stands, so "41" read as a claim about today while the
 * sitemap listed 23. These four keep that distinction visible — what we have
 * handled since 2019, and what is under management right now.
 *
 * Grid-with-dividers layout, not centred text, matches a design reference
 * Almedin pointed to (Lovable property-management rebuild, 06.10.2026) — left
 * instead of centre, a hairline between cells instead of open space. Its own
 * tiny "01/02/03/04" eyebrow above each number was dropped on explicit
 * instruction; the rest of that cell's structure (number, label, border
 * logic) is otherwise a straight port.
 *
 * ⚠️ Still hard-coded copy, not live data. Changing a number here changes
 * nothing anywhere else; see docs/PROJECT.md D4.
 */

const STATS = [0, 1, 2, 3] as const;

const TrustBand = () => {
  const { t, language } = useLocale();
  const [stats, setStats] = useState(
    STATS.map((i) => ({
      num: t(`trust-${i}-num` as TranslationKey),
      label: t(`trust-${i}-label` as TranslationKey),
    }))
  );

  useEffect(() => {
    setStats(
      STATS.map((i) => ({
        num: t(`trust-${i}-num` as TranslationKey),
        label: t(`trust-${i}-label` as TranslationKey),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (index: number, field: "num" | "label", value: string) =>
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  return (
    <Section tone="quiet" size="sm">
      <dl className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "px-md py-lg",
              index % 2 === 0 && "border-r border-border",
              index < 2 && "border-b border-border md:border-b-0",
              index === 1 && "md:border-r"
            )}
          >
            <EditableText
              id={`trust-${index}-num`}
              value={stat.num}
              onChange={(v) => update(index, "num", v)}
              as="dt"
              className="t-section text-foreground"
            >
              {stat.num}
            </EditableText>
            <EditableText
              id={`trust-${index}-label`}
              value={stat.label}
              onChange={(v) => update(index, "label", v)}
              as="dd"
              className="t-body text-muted-foreground mt-1"
            >
              {stat.label}
            </EditableText>
          </div>
        ))}
      </dl>
    </Section>
  );
};

export default TrustBand;
