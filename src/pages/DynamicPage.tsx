import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

/**
 * Renders whatever HTML the `pages` table holds under a slug.
 *
 * `noindex` until someone can say what this route is for. It serves arbitrary
 * stored markup under an arbitrary URL, with no title or description of its
 * own — exactly the shape of thing a search engine files as thin or duplicate
 * content, and every page it serves would otherwise compete with the real
 * route covering the same subject. Nothing links to it from the site. Lift
 * this once the route has a purpose and per-page metadata to go with it.
 */
export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pages")
        .select("content_html, content_css")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setHtml(data.content_html || "");
        setCss(data.content_css || "");
      }
      setLoading(false);
    })();
  }, [slug]);

  const seo = <Seo title="Page" path={`/p/${slug ?? ""}`} noindex />;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {seo}
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        {seo}
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="t-display text-primary mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">This page doesn't exist or hasn't been published yet.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {seo}
      <Navigation />
      <main className="flex-1 pt-24">
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <Footer />
    </div>
  );
}
