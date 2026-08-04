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
 */
export default function PageWrapper({ slug, children }: PageWrapperProps) {
  const [override, setOverride] = useState<{ html: string; css: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Don't check for overrides if we're in edit mode (iframe inside builder)
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "true") {
      setChecked(true);
      return;
    }

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
      setChecked(true);
    })();
  }, [slug]);

  // Show nothing until we've checked (prevents flash)
  if (!checked) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

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
