import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import EditableText from "./admin/EditableText";
import SectionIntro from "./SectionIntro";
import { Section, Grid, Stack } from "./layout";

type Member = { name: string; role: string; avatar_url?: string | null };

/**
 * Faces, one paragraph, and a way out to the full story.
 *
 * An owner handing over a house is deciding whether there is anyone behind the
 * company. Four names and four faces answer that faster than a paragraph about
 * values, which is why the copy here is one sentence and the rest of the About
 * page stays on the About page.
 *
 * It reads from `team_members` when that table has rows. It is empty today, so
 * the fallback below carries the same four people the About page already
 * names — editable, so the client can change them in place until the table is
 * populated. Fill `team_members` (including `avatar_url`) and this section
 * switches to real portraits on its own.
 */
const FALLBACK_TEAM: Member[] = [
  { name: "Alejandro Marinetto Rohr", role: "Co-Founder" },
  { name: "Lorenz Aschbacher", role: "Co-Founder" },
  { name: "Olek", role: "Marketing" },
  { name: "Julien", role: "Guest Manager" },
];

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
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-gradient-sage mx-auto mb-4 flex items-center justify-center overflow-hidden">
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
  </div>
);

const AboutMini = () => {
  const [team, setTeam] = useState<Member[]>(FALLBACK_TEAM);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [linkText, setLinkText] = useState("Read our story");

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
    // §19: trust, professionalism, local competence — carried by four faces
    // and one sentence. No cards; the faces are the content.
    <Section id="about-mini" tone="muted" size="md">
      <Stack gap="lg">
        <SectionIntro
          idPrefix="am"
          eyebrow="Who looks after your property"
          heading="A small team, on the ground in every region we host."
          lead="Frontier was founded because owners of exceptional homes were being offered standard management — and their guests could tell."
        />

        <Grid cols={4} className="max-w-3xl mx-auto">
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

        <div className="text-center">
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
