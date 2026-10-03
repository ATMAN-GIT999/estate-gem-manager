import { useLocale } from "@/contexts/LocaleContext";
import { hasTypeLabel, typeKey } from "@/lib/winterRentals";

/** "2 bedrooms" / "1 bedroom" in the visitor's language. */
export const useBedroomsLabel = () => {
  const { t } = useLocale();
  return (n: number) =>
    n === 1 ? t("wr-bedroom-one") : t("wr-bedrooms").replace("{n}", String(n));
};

/** The type's label, or the stored value if no translation exists for it yet. */
export const useTypeLabel = () => {
  const { t } = useLocale();
  return (type: string) => (hasTypeLabel(type) ? t(typeKey(type)) : type);
};
