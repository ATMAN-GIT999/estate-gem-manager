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
 * The React page renders immediately and an override, if one comes back,
 * replaces it. It used to be the other way round: a spinner held back the
 * whole page — headline, copy, everything — until the Supabase round-trip
 * for `pages` finished, on all ten wrapped routes. No route has an override
 * stored, so every visitor and every crawler paid a network round-trip to be
 * told "nothing to see here" before any content existed. First paint is now
 * the content itself.
 *
 * The audit offered a second option (switch the mechanism off for `/` and
 * `/property-management`). This one was taken instead: it fixes all ten
 * routes rather than two, and it keeps one code path instead of leaving the
 * wrapper behaving differently depending on which page it wraps.
 *
 * The cost is the flash the old spinner was there to prevent — but only on a
 * page that actually HAS a published override, where the React version shows
 * for one round-trip before the stored HTML takes over. That trade is worth
 * it while no override exists; if editors start publishing them, the fix is
 * to serve the override with the document, not to hide the page again.
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

  // If we have a published override, render it
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

  // Otherwise render the default React page
  return <>{children}</>;
}
