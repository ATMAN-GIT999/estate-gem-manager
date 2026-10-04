import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toMidtermListing, type MidtermListing } from "@/lib/winterRentals";

/**
 * Published winter rentals, optionally for one place. RLS already hides
 * unpublished rows from the public; the explicit filter keeps an admin who is
 * logged in from seeing drafts on the guest pages.
 */
export const useWinterListings = (city?: string) => {
  const [homes, setHomes] = useState<MidtermListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let query = supabase
        .from("midterm_listings")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (city) query = query.eq("city_group", city);
      const { data, error } = await query;
      if (cancelled) return;
      if (error) console.error("Error fetching winter rentals:", error);
      setHomes((data ?? []).map(toMidtermListing));
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [city]);

  return { homes, loading };
};
