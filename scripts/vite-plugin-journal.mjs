/**
 * Gives the app two virtual modules built from content/journal/ (see
 * scripts/journal.mjs for the rules):
 *
 *   virtual:journal            the list of published articles — metadata only,
 *                              plus a lazy loader per article body
 *   virtual:journal-body/<slug>  one article's Markdown, as a string
 *
 * Why a plugin rather than `import.meta.glob`: the filter "is this published
 * yet" has to happen at build time. A glob would bundle every file, including
 * a scheduled article's text, into JavaScript any visitor can download before
 * its date. Here an unpublished article is simply not part of the build.
 *
 * Bodies are separate lazy chunks so the list page and the footer — which only
 * need to know *whether* there are articles — do not carry the text of all of
 * them.
 */
import { readJournal, readJournalBody } from "./journal.mjs";
import { sep } from "node:path";

const LIST = "virtual:journal";
const BODY_PREFIX = "virtual:journal-body/";

export default function journalPlugin() {
  let isDev = false;

  return {
    name: "frontier-journal",

    configResolved(config) {
      isDev = config.command === "serve";
    },

    resolveId(id) {
      if (id === LIST || id.startsWith(BODY_PREFIX)) return `\0${id}`;
    },

    load(id) {
      if (id === `\0${LIST}`) {
        // In the dev server drafts and scheduled articles are shown (marked as
        // previews) — that is how you read what you are writing.
        const { articles } = readJournal({ includeUnpublished: isDev || undefined });
        const loaders = articles.map(
          (a) => `${JSON.stringify(a.slug)}: () => import(${JSON.stringify(BODY_PREFIX + a.slug)})`,
        );
        return (
          `export const journalArticles = ${JSON.stringify(articles)};\n` +
          `export const loadJournalBody = {${loaders.join(",")}};\n`
        );
      }
      if (id.startsWith(`\0${BODY_PREFIX}`)) {
        const slug = id.slice(`\0${BODY_PREFIX}`.length);
        return `export default ${JSON.stringify(readJournalBody(slug))};\n`;
      }
    },

    // New, edited or deleted article → rebuild the list and reload the page.
    configureServer(server) {
      const dir = `${server.config.root}${sep}content${sep}journal`;
      server.watcher.add(dir);
      const refresh = (file) => {
        if (!file.startsWith(dir)) return;
        for (const id of server.moduleGraph.idToModuleMap.keys()) {
          if (id.includes("virtual:journal")) {
            const mod = server.moduleGraph.getModuleById(id);
            if (mod) server.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: "full-reload" });
      };
      for (const event of ["add", "change", "unlink"]) server.watcher.on(event, refresh);
    },
  };
}
