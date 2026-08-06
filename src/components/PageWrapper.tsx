import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PageWrapperProps {
  /** The site-- slug to check for overrides, e.g. "site--home" */
  slug: string;
  /** The default React page content */
  children: React.ReactNode;
}

/**
 * Wraps a React page. If there's a published override in the pages table,
 * renders the stored HTML/CSS instead of the React children.
 *
 * The React page renders immediately and the override, if there is one, swaps
 * in when the query returns. This used to be the other way round: nothing at
 * all — a full-screen "Loading..." — until Supabase answered. Measured against
 * the production build with a 350ms round-trip, that put the placeholder on
 * screen at 1.9s and the first real content at 3.4s, on every page, for every
 * visitor. It also meant the page had no content to prerender or crawl: a
 * build-time snapshot would have captured the word "Loading" and nothing else.
 *
 * The trade is deliberate. Overrides are rare — they exist only for pages a
 * client has explicitly rebuilt in the admin builder — so the common path is
 * now instant, and the rare one flashes the React page first. Removing that
 * flash as well needs the override to arrive with the document, which means
 * server-side rendering rather than a fetch.
 */
export default function PageWrapper({ slug, children }: PageWrapperProps) {
  const [override, setOverride] = useState<{ html: string; css: string } | null>(null);

  useEffect(() => {
    // Don't check for overrides if we're in edit mode (iframe inside builder)
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "true") return;

    (async () => {
      const { data } = await supabase
        .from("pages")
        .select("content_html, content_css, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (data && data.content_html) {
        setOverride({ html: data.content_html, css: data.content_css || "" });
      }
    })();
  }, [slug]);

  if (override) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-24">
          {override.css && <style dangerouslySetInnerHTML={{ __html: override.css }} />}
          <div dangerouslySetInnerHTML={{ __html: override.html }} />
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
