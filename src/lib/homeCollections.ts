/**
 * The three regions a guest browses homes by — Costa del Sol, Vienna,
 * Carinthia — as one definition for the landing page's "Our homes" tabs and
 * the filter row on /properties, so the two can never disagree about which
 * house belongs where.
 *
 * ⚠️ The grouping is derived in code because the table has no column for it.
 * `location` alone is not enough: the two Los Flamingos properties are tagged
 * "Málaga" — the province, not the town — so a location-only filter files two
 * golf-resort villas under Austria's neighbours. Hence the name override
 * below. A `collection` column on `properties` is the durable fix
 * (docs/PROJECT.md D8); until then a property in a new town falls into "new"
 * rather than disappearing.
 */

/** Costa del Sol — the coast and the province around it. */
const COSTA = [
  "Marbella",
  "Río Real",
  "Calahonda",
  "Fuengirola",
  "Torremolinos",
  "Málaga",
  "Estepona",
  "Benalmádena",
  "Benahavís",
];
const VIENNA = ["Wien", "Vienna"];
const CARINTHIA = ["Sauerwald", "Kärnten", "Carinthia"];

/** Tagged with the province rather than the town; they belong on the coast. */
const COSTA_BY_NAME = ["Los Flamingos"];

export type CollectionId = "costa" | "vienna" | "carinthia" | "new";

export const COLLECTION_ORDER: CollectionId[] = ["costa", "vienna", "carinthia", "new"];

/** Translation key of each tab's label (src/lib/translations.ts). */
export const COLLECTION_LABEL_KEY = {
  costa: "trio-tab-all",
  vienna: "trio-tab-vienna",
  carinthia: "trio-tab-carinthia",
  new: "trio-tab-new",
} as const;

export const classifyProperty = (property: {
  location?: string | null;
  name?: string | null;
}): CollectionId => {
  const location = property.location ?? "";
  const name = property.name ?? "";

  if (COSTA_BY_NAME.some((needle) => name.includes(needle))) return "costa";
  if (CARINTHIA.includes(location)) return "carinthia";
  if (VIENNA.includes(location)) return "vienna";
  if (COSTA.includes(location)) return "costa";
  // Anything we have not filed yet is still reachable instead of invisible.
  return "new";
};
