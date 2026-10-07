import { useEffect, useState } from "react";
import { BadgePercent, KeyRound, Sparkles, UserRoundCheck, Wifi } from "lucide-react";
import EditableText from "./admin/EditableText";
import { MediaFrame, Section } from "./layout";
import stayImage from "@/assets/wf-stay-includes.webp";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * "What every stay includes" — the guest half's one proof section.
 *
 * Picture on the left, five checkable claims on the right, each on a hairline.
 * Each claim carries a thin gold line icon (Almedin, 26.09.2026 — the same
 * treatment as the two pillars under "Renovations & Investments"). Still no
 * cards: the icon sits in the row, not in a tile, so the claims keep reading
 * as things a guest can verify rather than as features.
 *
 * On white, not the sage band this used to carry. The landing page now spends
 * its one coloured surface on the search band; a second full band here would
 * put the page back to alternating stripes.
 */

const ITEMS = [0, 1, 2, 3, 4] as const;

/** Index-aligned with ITEMS: check-in, Wi-Fi, on-site help, clean, direct. */
const ITEM_ICONS = [KeyRound, Wifi, UserRoundCheck, Sparkles, BadgePercent] as const;

const GuestManagement = () => {
  const { t, language } = useLocale();

  const [heading, setHeading] = useState(t("stay-heading"));
  const [lead, setLead] = useState(t("stay-lead"));
  const [image, setImage] = useState<string | undefined>(stayImage);
  const [items, setItems] = useState(
    ITEMS.map((i) => ({
      title: t(`stay-${i}-title` as TranslationKey),
      desc: t(`stay-${i}-desc` as TranslationKey),
    }))
  );

  useEffect(() => {
    setHeading(t("stay-heading"));
    setLead(t("stay-lead"));
    setItems(
      ITEMS.map((i) => ({
        title: t(`stay-${i}-title` as TranslationKey),
        desc: t(`stay-${i}-desc` as TranslationKey),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (index: number, field: "title" | "desc", value: string) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));

  return (
    <Section size="md">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-center">
        <div className="lg:basis-[46%] lg:shrink-0">
          <MediaFrame
            id="stay-image"
            src={image}
            onChange={setImage}
            alt="A covered terrace with a long dining table, at one of the managed homes"
            note="Covered terrace, long table laid for dinner — the picture the five claims are about"
            aspect="photo"
            className="lg:aspect-auto lg:h-[560px]"
          />
        </div>

        <div className="lg:flex-1">
          {/* Eyebrow and the larger heading role only (Almedin, 07.10.2026):
              the copy below is the checked guest text and is untouched, and the
              layout is as before. The heading takes the chapter size so it does
              not sit lighter than the sections around it. */}
          <p className="t-tag text-accent-strong">{t("eyebrow-stay")}</p>
          <EditableText
            id="stay-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-chapter mt-4 text-foreground text-balance max-w-[16ch]"
          >
            {heading}
          </EditableText>
          <EditableText
            id="stay-lead"
            value={lead}
            onChange={setLead}
            as="p"
            className="t-body text-muted-foreground mt-2.5 max-w-[44ch]"
          >
            {lead}
          </EditableText>

          <dl className="mt-5">
            {items.map((item, index) => {
              const Icon = ITEM_ICONS[index];
              return (
                <div key={index} className="flex items-start gap-4 border-t border-border py-4">
                  <Icon className="w-6 h-6 shrink-0 mt-0.5 text-accent-strong" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <EditableText
                      id={`stay-${index}-title`}
                      value={item.title}
                      onChange={(v) => update(index, "title", v)}
                      as="dt"
                      className="t-item text-foreground"
                    >
                      {item.title}
                    </EditableText>
                    <EditableText
                      id={`stay-${index}-desc`}
                      value={item.desc}
                      onChange={(v) => update(index, "desc", v)}
                      as="dd"
                      className="t-body text-[15px] text-muted-foreground mt-1"
                    >
                      {item.desc}
                    </EditableText>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </Section>
  );
};

export default GuestManagement;
