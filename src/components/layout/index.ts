/**
 * The layout system. One design system → many sections, rather than many
 * sections → many ad-hoc CSS decisions (docs/DESIGN.md §2).
 *
 * A new public section should need nothing beyond these plus the `.t-*` type
 * scale in index.css. If it reaches for a raw `max-w-*`, a `py-<number>` or a
 * hand-rolled `container mx-auto px-4`, that is the signal something is
 * missing here — extend the primitive rather than working around it, or the
 * page drifts back into the state §1 describes.
 */
export { default as Container, type Measure } from "./Container";
export { default as Section } from "./Section";
export { default as Grid } from "./Grid";
export { default as Stack } from "./Stack";
export { default as Surface } from "./Surface";
export { default as Divider } from "./Divider";
export { default as MediaFrame } from "./MediaFrame";
export { default as Panel } from "./Panel";

/** The shared eyebrow + heading + lead header. Predates this folder. */
export { default as SectionIntro, type SectionTone } from "../SectionIntro";
