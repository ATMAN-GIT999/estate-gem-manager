import { Link } from "react-router-dom";
import { MediaFrame } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useBedroomsLabel, useTypeLabel } from "@/hooks/useWinterLabels";
import {
  statusKey,
  winterListingPath,
  type MidtermListing,
} from "@/lib/winterRentals";

/**
 * One winter rental in a list. Same frameless shape as PropertyCard — photo,
 * then text on the page, no box — so the winter pages read as part of the site.
 *
 * Not available homes stay visible and say so. Dropping a let home from the page
 * would turn a ranking URL into a 404 the day it is rented; showing the state
 * keeps the page and tells the guest honestly.
 */
const WinterListingCard = ({ home }: { home: MidtermListing }) => {
  const { t, convertPrice, currencySymbol } = useLocale();
  const bedrooms = useBedroomsLabel();
  const typeLabel = useTypeLabel();
  const lead = home.images[0];
  const open = home.status === "available";

  return (
    <Link to={winterListingPath(home)} className="group block">
      <div className="relative overflow-hidden">
        <MediaFrame
          id={`winter-card-${home.id}`}
          src={lead?.url}
          alt={lead?.caption ?? home.name}
          note={t("wr-image-note")}
          aspect="photo"
          className={open ? "transition-transform duration-500 group-hover:scale-105" : "opacity-80"}
        />
        {!open && (
          <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 t-tag text-foreground">
            {t(statusKey(home.status))}
          </span>
        )}
      </div>
      <h3 className="t-card text-foreground mt-3">{home.name}</h3>
      <p className="t-meta text-muted-foreground mt-1">
        {typeLabel(home.property_type)} · {bedrooms(home.bedrooms)}
        {home.size_sqm ? ` · ${t("wr-size").replace("{n}", String(home.size_sqm))}` : ""}
      </p>
      <p className="t-item text-foreground mt-2">
        {currencySymbol}
        {convertPrice(home.monthly_price).toLocaleString("en")}{" "}
        <span className="t-meta text-muted-foreground">{t("wr-per-month")}</span>
      </p>
    </Link>
  );
};

export default WinterListingCard;
