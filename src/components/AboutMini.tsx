import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";
import { Section, Grid, Stack, Panel } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";
import teamAlejandro from "@/assets/team-alejandro.webp";
import teamLorenz from "@/assets/team-lorenz.webp";
import teamJulien from "@/assets/team-julien.webp";

type Member = { name: string; role: string; avatar_url?: string | null };

/**
 * Faces, one paragraph, and a way out to the full story.
 *
 * An owner handing over a house is deciding whether there is anyone behind the
 * company. Three names and three faces answer that faster than a paragraph
 * about values, which is why the copy here is one sentence and the rest of
 * the About page stays on the About page.
 *
 * It reads from `team_members` when that table has rows. It is empty today,
 * so the fallback below carries the same three people the About page names
 * (Olek left the team, removed here too on 22.08.2026 — see
 * docs/DECISIONS.md §41/§43) — editable, so the client can change them in
 * place until the table is populated. Fill `team_members` (including
 * `avatar_url`) and this section switches to real portraits on its own.
 */
const TEAM_NAMES = ["Alejandro Marinetto Rohr", "Lorenz Aschbacher", "Julien"];
/** Index-aligned with TEAM_NAMES — the same crops About.tsx uses. */
const TEAM_PHOTOS = [teamAlejandro, teamLorenz, teamJulien];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Module scope on purpose: defined inside AboutMini this would be a new
 * component type on every render, so an EditableText would lose focus after
 * each keystroke in admin edit mode.
 *
 * Wrapped in `Panel` since 22.08.2026 (DECISIONS §45) — Almedin asked for
 * the same card treatment `About.tsx`'s team section already uses, instead
 * of faces floating directly on the section's own background.
 */
const TeamFace = ({
  member,
  index,
  editable,
  onChange,
}: {
  member: Member;
  index: number;
  editable: boolean;
  onChange: (index: number, field: "name" | "role", value: string) => void;
}) => (
  <Panel className="text-center">
    <div className="w-40 h-40 rounded-full bg-gradient-sage mx-auto mb-4 flex items-center justify-center overflow-hidden">
      {member.avatar_url ? (
        <img
          src={member.avatar_url}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="t-item text-primary-foreground">
          {initialsOf(member.name)}
        </span>
      )}
    </div>
    {editable ? (
      <>
        <EditableText
          id={`am-member-name-${index}`}
          value={member.name}
          onChange={(v) => onChange(index, "name", v)}
          as="p"
          className="t-item text-primary"
        >
          {member.name}
        </EditableText>
        <EditableText
          id={`am-member-role-${index}`}
          value={member.role}
          onChange={(v) => onChange(index, "role", v)}
          as="p"
          className="t-body text-foreground/60"
        >
          {member.role}
        </EditableText>
      </>
    ) : (
      <>
        <p className="t-item text-primary">{member.name}</p>
        <p className="t-body text-foreground/60">{member.role}</p>
      </>
    )}
  </Panel>
);

const AboutMini = () => {
  const { t, language } = useLocale();
  const buildFallbackTeam = (): Member[] =>
    TEAM_NAMES.map((name, i) => ({
      name,
      role: t(`am-member-role-${i}` as TranslationKey),
      avatar_url: TEAM_PHOTOS[i],
    }));

  const [team, setTeam] = useState<Member[]>(buildFallbackTeam());
  const [fromDatabase, setFromDatabase] = useState(false);
  const [linkText, setLinkText] = useState(t("am-link"));
  const [ctaText, setCtaText] = useState(t("am-cta"));

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("name, role, avatar_url")
        .limit(6);

      if (data && data.length > 0) {
        setTeam(data.map((m) => ({ ...m, role: m.role ?? "" })));
        setFromDatabase(true);
      }
    };

    fetchTeam();
  }, []);

  useEffect(() => {
    setLinkText(t("am-link"));
    setCtaText(t("am-cta"));
    // Real team data from Supabase is never overwritten by a language
    // switch — only the placeholder fallback re-translates.
    if (!fromDatabase) setTeam(buildFallbackTeam());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateMember = (
    index: number,
    field: "name" | "role",
    value: string
  ) => {
    const next = [...team];
    next[index] = { ...next[index], [field]: value };
    setTeam(next);
  };

  return (
    // §19: trust, professionalism, local competence — carried by three faces
    // and one sentence. Cards since 22.08.2026 (DECISIONS §45) — matches
    // About.tsx's own team section instead of floating unframed.
    <Section id="about-mini" tone="muted" size="md">
      <Stack gap="lg">
        {/* "About Ourselves" replaces the eyebrow, not the heading below it.
            "A small team, on the ground in every region we host." is one of
            the few substantiated differentiators the site has (see the
            text-derivation notes in docs/DECISIONS.md) — it stays exactly as
            it is; only the short label above it changes. */}
        {/* max-w-none: SectionIntro's own "normal" measure (max-w-3xl) was
            wrapping this specific heading onto two lines — this sentence is
            the whole point of the section and reads better as one line
            spanning the full width than balanced across two. The lead
            paragraph underneath keeps its own separate, narrower cap either
            way, so this only widens the heading/eyebrow. */}
        <SectionIntro
          idPrefix="am"
          eyebrow={t("am-eyebrow")}
          heading={t("am-heading")}
          lead={t("am-lead")}
          className="max-w-none"
        />

        {/* max-w-5xl, not max-w-3xl: matches Container's own "wide" measure,
            the width About.tsx's team grid sits in — so a card here is the
            same size as its counterpart there, not a scaled-down copy. */}
        <Grid cols={3} className="max-w-5xl mx-auto">
          {team.map((member, index) => (
            <TeamFace
              key={index}
              member={member}
              index={index}
              editable={!fromDatabase}
              onChange={updateMember}
            />
          ))}
        </Grid>

        {/* The one call to action in the middle of the page. It sits here
            rather than anywhere else because this is the section that answers
            the question an owner actually decides on — who am I giving the
            keys to — and that is the moment to offer them a person. */}
        <div className="flex flex-col items-center gap-sm">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
          >
            <a href="#get-in-touch">
              <EditableText id="am-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
            </a>
          </Button>

          <Link
            to="/about"
            className="t-meta text-accent-strong hover:underline"
          >
            <EditableText
              id="am-link"
              value={linkText}
              onChange={setLinkText}
              as="span"
            >
              {linkText}
            </EditableText>
            {" →"}
          </Link>
        </div>
      </Stack>
    </Section>
  );
};

export default AboutMini;
