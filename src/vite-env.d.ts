/// <reference types="vite/client" />

/**
 * Built from content/journal/*.md by scripts/vite-plugin-journal.mjs at build
 * time, so an unpublished article is not in the bundle at all.
 */
declare module "virtual:journal" {
  export interface JournalArticleMeta {
    slug: string;
    title: string;
    description: string;
    /** YYYY-MM-DD */
    date: string;
    updated: string | null;
    /** null = the team (siteMeta JOURNAL_AUTHOR) */
    author: string | null;
    /** Place slugs, as in VACATION_RENTAL_CITIES */
    places: string[];
    /** `seo_slug`s of homes */
    properties: string[];
    /** Path under public/, e.g. /journal/x.webp */
    image: string | null;
    imageAlt: string | null;
    /** false = a draft or a future date, shown only as a preview */
    live: boolean;
    status: "published" | "draft";
  }
  export const journalArticles: JournalArticleMeta[];
  export const loadJournalBody: Record<string, () => Promise<{ default: string }>>;
}
