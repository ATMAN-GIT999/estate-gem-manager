/**
 * Cuts an article's Markdown into the pieces the page lays out differently.
 *
 * An article is written as plain Markdown so it stays easy to write and to
 * review in a diff. The page does not render it as one stream: each `##`
 * becomes a row with its heading in a side column, a photo on its own line
 * becomes a wide figure with a caption, and a list whose every item starts
 * with a bold label becomes a table of "if this, then that". Doing the cutting
 * here keeps the Markdown free of layout markup.
 *
 * Deliberately small and line-based. It understands exactly the shapes the
 * articles use; anything else stays Markdown and is rendered as such.
 */
export type JournalBlock =
  | { type: "text"; md: string }
  | { type: "image"; alt: string; src: string; caption: string | null }
  | { type: "choices"; rows: Array<{ label: string; answer: string }> };

export interface JournalSection {
  /** null for what comes before the first heading — the introduction. */
  title: string | null;
  blocks: JournalBlock[];
}

/** `![alt](src "caption")` alone on its line. */
const IMAGE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\s*$/;
const HEADING = /^#{1,2}\s+(.+?)\s*$/;
/** `- **Label:** the answer` */
const CHOICE = /^-\s+\*\*(.+?)\*\*\s*(.*)$/;

export const splitJournalBody = (markdown: string): JournalSection[] => {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const sections: JournalSection[] = [{ title: null, blocks: [] }];
  const current = () => sections[sections.length - 1];

  let text: string[] = [];
  const flush = () => {
    const md = text.join("\n").trim();
    if (md) current().blocks.push({ type: "text", md });
    text = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const heading = line.match(HEADING);
    if (heading) {
      flush();
      sections.push({ title: heading[1], blocks: [] });
      i += 1;
      continue;
    }

    const image = line.match(IMAGE);
    if (image) {
      flush();
      current().blocks.push({
        type: "image",
        alt: image[1],
        src: image[2],
        caption: image[3] ?? null,
      });
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const run: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("- ")) {
        run.push(lines[j]);
        j += 1;
      }
      const parsed = run.map((l) => l.match(CHOICE));
      // A table only when *every* item has a label — a list that is half
      // labelled and half not would come out ragged, so it stays a list.
      if (parsed.length >= 2 && parsed.every(Boolean)) {
        flush();
        current().blocks.push({
          type: "choices",
          rows: parsed.map((m) => ({
            label: m![1].replace(/:\s*$/, ""),
            answer: m![2].trim(),
          })),
        });
      } else {
        text.push(...run);
      }
      i = j;
      continue;
    }

    text.push(line);
    i += 1;
  }
  flush();

  // A body that opens straight with a heading has no introduction.
  return sections.filter((s) => s.title !== null || s.blocks.length > 0);
};
