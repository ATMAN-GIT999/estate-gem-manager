import { useState } from "react";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame } from "./layout";

/**
 * The page exhaling.
 *
 * Everything above this is dense: six steps of an operation, four numbers and
 * three case studies. This is the counterweight — one picture, one sentence,
 * nothing to read carefully. §14 has always asked for the two halves of the
 * offer to carry unequal weight, and the way that is expressed changed with
 * this rebuild: the money argument is no longer a section of its own to be
 * quieter than, so "relax" now earns its contrast against the whole first half
 * of the page rather than against the block above it.
 *
 * Which is why it is a photograph and eleven words, and why it must not grow.
 * The moment it explains anything, it becomes a seventh step (DECISIONS §3:
 * the relax section is not allowed to re-explain revenue).
 *
 * `pm-listing-desc` used to live here — the platforms sentence. It is now step
 * 3 of TheSystem, where distribution belongs; the id went with the sentence.
 */
const PropertyManagement = () => {
  const [sectionTitle, setSectionTitle] = useState("We manage while you relax.");
  const [relaxLine, setRelaxLine] = useState("Less to manage. Nothing to worry about.");
  const [relaxImage, setRelaxImage] = useState("");

  return (
    // Shorter than the hero on purpose — this is a breath, not a second
    // opening. Not a <Section>: like the hero, it is a picture with text on it
    // rather than a container of content.
    //
    // Trimmed ~15% further on Almedin's direction (24/60/34 → 20/50/29): it
    // still needs to hold a two-line heading plus one sentence without
    // crowding, which is the floor on how short "a breath" can get.
    <section className="relative flex items-center justify-center overflow-hidden min-h-[clamp(20rem,50vh,29rem)]">
      <MediaFrame
        id="pm-relax-image"
        src={relaxImage}
        onChange={setRelaxImage}
        alt="A terrace at one of the managed properties"
        note="Relax — sunlit rooftop terrace, golden hour"
        fill
      />
      <div className="absolute inset-0 overlay-media" aria-hidden="true" />

      <Container measure="text" className="relative z-10 text-center">
        <EditableText
          id="pm-section-title"
          value={sectionTitle}
          onChange={setSectionTitle}
          as="h2"
          className="t-section text-white text-balance drop-shadow-2xl"
        >
          {sectionTitle}
        </EditableText>
        <EditableText
          id="pm-relax-line"
          value={relaxLine}
          onChange={setRelaxLine}
          as="p"
          multiline
          className="t-body text-white/90 mt-sm drop-shadow-lg"
        >
          {relaxLine}
        </EditableText>
      </Container>
    </section>
  );
};

export default PropertyManagement;
