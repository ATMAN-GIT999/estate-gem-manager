import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";
import teamAlejandro from "@/assets/team-alejandro.webp";
import teamLorenz from "@/assets/team-lorenz.webp";
import teamJulien from "@/assets/team-julien.webp";

/**
 * Three faces, three languages, and the one thing an owner is actually asking:
 * is there a person behind this.
 *
 * Fixed-width cards, centred, rather than three columns stretched across the
 * container — at 1440px a stretched row turns three portraits into three
 * posters. On a phone they sit in an even three-column strip instead of a
 * 2 × 2 grid, which stranded the third face on its own line looking like a
 * missing fourth.
 *
 * Reads from `team_members` when that table has rows; the fallback below
 * carries the same three people About.tsx names.
 */

type Member = { name: string; role: string; languages: string; avatar_url?: string | null };

const TEAM_NAMES = ["Lorenz Aschbacher", "Alejandro Marinetto Rohr", "Julien"];
const TEAM_PHOTOS = [teamLorenz, teamAlejandro, teamJulien];
const TEAM_LANGUAGES = ["EN · DE · ES", "EN · ES", "ES · FR"];

const AboutMini = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("team-eyebrow"));
  const [heading, setHeading] = useState(t("team-heading"));
  const [lead, setLead] = useState(t("team-lead"));
  const [region, setRegion] = useState(t("team-region"));
  const [team, setTeam] = useState<Member[]>(
    TEAM_NAMES.map((name, i) => ({
      name,
      role: t(`am-member-role-${i}` as TranslationKey),
      languages: TEAM_LANGUAGES[i],
      avatar_url: TEAM_PHOTOS[i],
    }))
  );

  useEffect(() => {
    setEyebrow(t("team-eyebrow"));
    setHeading(t("team-heading"));
    setLead(t("team-lead"));
    setRegion(t("team-region"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("team_members").select("name, role, avatar_url");
      if (data && data.length > 0) {
        setTeam(
          data.map((m, i) => ({
            name: m.name,
            role: m.role ?? "",
            languages: TEAM_LANGUAGES[i] ?? "",
            // The table can carry a row without a portrait. Falling back to
            // the bundled crop keeps three faces on screen instead of three
            // hatched rectangles — an empty frame here reads as the company
            // having nobody, which is the opposite of the section's job.
            avatar_url: m.avatar_url ?? TEAM_PHOTOS[i] ?? null,
          }))
        );
      }
    };
    load();
  }, []);

  const update = (index: number, field: "name" | "role", value: string) =>
    setTeam((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  return (
    // size="lg" (Almedin, 02.10.2026) — see TheSystem.tsx's note.
    <Section id="about-mini" size="lg">
      <div className="grid gap-4 border-b border-foreground pb-md md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <EditableText
            id="team-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-strong"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="team-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-foreground text-balance mt-3"
          >
            {heading}
          </EditableText>
        </div>
        <EditableText
          id="team-lead"
          value={lead}
          onChange={setLead}
          as="p"
          className="t-body text-muted-foreground md:col-span-4 md:col-start-9"
        >
          {lead}
        </EditableText>
      </div>
      {/* `region` (the small "Spain · Austria" tag) has no slot in the
          reference header — kept as a quiet line under the grid rather than
          dropped, since it is still real, editable content. */}
      <EditableText
        id="team-region"
        value={region}
        onChange={setRegion}
        as="p"
        className="t-meta text-muted-foreground mt-3"
      >
        {region}
      </EditableText>

      {/* Fixed 320px cards on a 64px gap, centred — not a stretched grid.
          At 1440 a three-column grid would make each portrait 400px wide and
          the row would read as three posters. On a phone they stay three
          across rather than 2 + 1, which strands the third face on its own
          line looking like a missing fourth. */}
      <ul className="mt-[44px] flex justify-center gap-4 sm:gap-8 lg:gap-16">
        {team.slice(0, 3).map((member, index) => (
          <li key={index} className="w-full max-w-[320px]">
            <div className="aspect-[4/5] overflow-hidden bg-secondary">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  width={640}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover object-[50%_28%]"
                />
              ) : (
                <div className="w-full h-full bg-placeholder-hatch" aria-hidden="true" />
              )}
            </div>
            <EditableText
              id={`am-member-name-${index}`}
              value={member.name}
              onChange={(v) => update(index, "name", v)}
              as="h3"
              className="t-item text-foreground mt-3 sm:mt-[18px]"
            >
              {member.name}
            </EditableText>
            <EditableText
              id={`am-member-role-${index}`}
              value={member.role}
              onChange={(v) => update(index, "role", v)}
              as="p"
              className="t-body text-muted-foreground"
            >
              {member.role}
            </EditableText>
            <p className="t-tag text-muted-foreground/75 mt-1">{member.languages}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default AboutMini;
