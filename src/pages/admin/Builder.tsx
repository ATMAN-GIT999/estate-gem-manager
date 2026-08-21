import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Save, Plus, FileText, Eye, Globe, Layout,
  ExternalLink, Loader2, Trash2
} from "lucide-react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

// Local font stylesheets for the editor iframe. `?url` gives the built asset
// path rather than injecting the CSS into this page.
import playfair400 from "@fontsource/playfair-display/latin-400.css?url";
import playfair600 from "@fontsource/playfair-display/latin-600.css?url";
import playfair700 from "@fontsource/playfair-display/latin-700.css?url";
import lato300 from "@fontsource/lato/latin-300.css?url";
import lato400 from "@fontsource/lato/latin-400.css?url";
import lato700 from "@fontsource/lato/latin-700.css?url";

const canvasFontStyles = [
  playfair400, playfair600, playfair700,
  lato300, lato400, lato700,
];
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";

const SITE_PAGES = [
  { name: "Homepage", route: "/", slug: "site--home" },
  { name: "About Us", route: "/about", slug: "site--about" },
  { name: "Properties", route: "/properties", slug: "site--properties" },
  { name: "Projects", route: "/projects", slug: "site--projects" },
  { name: "Property Management", route: "/property-management", slug: "site--property-management" },
  { name: "Guaranteed Income", route: "/guaranteed-income", slug: "site--guaranteed-income" },
  { name: "Renovations", route: "/renovations", slug: "site--renovations" },
  { name: "Investments", route: "/investments", slug: "site--investments" },
  { name: "Business Areas", route: "/business-areas", slug: "site--business-areas" },
  { name: "Evaluate", route: "/evaluate", slug: "site--evaluate" },
];

interface PageData {
  id: string;
  name: string;
  slug: string;
  content_html: string;
  content_css: string;
  content_components: string;
  content_styles: string;
  is_published: boolean;
}

export default function BuilderPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [currentSitePage, setCurrentSitePage] = useState<typeof SITE_PAGES[0] | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"site" | "custom">("site");
  const [editorActive, setEditorActive] = useState(false);

  const fetchPages = useCallback(async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setPages(data as PageData[]);
    return data;
  }, []);

  useEffect(() => {
    if (!isAdmin) { navigate("/auth"); return; }
    fetchPages();
  }, [isAdmin, navigate, fetchPages]);

  // Init GrapesJS
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      width: "auto",
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        [gjsPresetWebpage as any]: { blocksBasicOpts: { flexGrid: true } },
        [gjsBlocksBasic as any]: { flexGrid: true },
      },
      canvas: {
        // The editor canvas is a separate iframe, so it needs its own
        // stylesheet URLs — it cannot inherit the app's bundled fonts. These
        // used to point at Google, which meant an admin's IP went to a third
        // party every time the builder opened. `?url` hands Vite's hashed
        // local copies to the iframe instead.
        //
        // The static Playfair cut is used here rather than the variable one
        // the site ships: the builder's font picker offers "Playfair Display",
        // and the variable package registers a different family name, so text
        // styled in the editor would fall back to a generic serif.
        styles: canvasFontStyles,
      },
      deviceManager: {
        devices: [
          { name: "Desktop", width: "" },
          { name: "Tablet", width: "768px", widthMedia: "992px" },
          { name: "Mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      styleManager: {
        sectors: [
          {
            name: "General",
            properties: ["display", "float", "position", "top", "right", "left", "bottom"],
          },
          {
            name: "Dimension",
            open: false,
            properties: ["width", "height", "max-width", "min-height", "margin", "padding"],
          },
          {
            name: "Typography",
            open: false,
            properties: [
              "font-family", "font-size", "font-weight", "letter-spacing",
              "color", "line-height", "text-align", "text-decoration", "text-shadow",
            ],
          },
          {
            name: "Decorations",
            open: false,
            properties: [
              "background-color", "background", "border-radius",
              "border", "box-shadow", "opacity",
            ],
          },
        ],
      },
    });

    // Add trait for links
    editor.DomComponents.addType("link", {
      model: {
        defaults: {
          traits: [
            { type: "text", name: "href", label: "Link URL" },
            {
              type: "select", name: "target", label: "Open in",
              options: [
                { id: "_self", name: "Same window" },
                { id: "_blank", name: "New tab" },
              ],
            },
            { type: "text", name: "title", label: "Title" },
          ],
        },
      },
    });

    addBrandedBlocks(editor);

    const gjsEl = containerRef.current;
    if (gjsEl) {
      gjsEl.style.setProperty("--gjs-primary-color", "#546458");
      gjsEl.style.setProperty("--gjs-secondary-color", "#efe6d9");
      gjsEl.style.setProperty("--gjs-tertiary-color", "#5a6959");
    }

    editorRef.current = editor;
    setLoaded(true);

    return () => { editor.destroy(); editorRef.current = null; };
  }, []);

  // Auto-load from URL params
  useEffect(() => {
    if (!loaded) return;
    const route = searchParams.get("route");
    const pageId = searchParams.get("page");

    if (route) {
      const sitePage = SITE_PAGES.find(p => p.route === route);
      if (sitePage) loadSitePage(sitePage);
    } else if (pageId && pages.length > 0) {
      loadCustomPage(pageId);
    }
  }, [loaded, pages, searchParams]);

  // Extract HTML from a rendered page via hidden iframe
  const extractPageHtml = (route: string): Promise<{ html: string; css: string }> => {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1200px;height:800px;opacity:0;pointer-events:none;";
      document.body.appendChild(iframe);
      iframeRef.current = iframe;

      iframe.onload = () => {
        setTimeout(() => {
          try {
            const doc = iframe.contentDocument;
            if (!doc) { resolve({ html: "", css: "" }); return; }

            // Extract main content (skip nav and footer)
            const main = doc.querySelector("main") || doc.body;
            const html = main.innerHTML;

            // Extract computed styles from all stylesheets
            let css = "";
            try {
              const sheets = doc.styleSheets;
              for (let i = 0; i < sheets.length; i++) {
                try {
                  const rules = sheets[i].cssRules;
                  for (let j = 0; j < rules.length; j++) {
                    css += rules[j].cssText + "\n";
                  }
                } catch { /* CORS */ }
              }
            } catch { /* ignore */ }

            resolve({ html, css });
          } catch {
            resolve({ html: "", css: "" });
          } finally {
            document.body.removeChild(iframe);
            iframeRef.current = null;
          }
        }, 2000); // Wait for React to render
      };

      iframe.src = route;
    });
  };

  const loadSitePage = async (sitePage: typeof SITE_PAGES[0]) => {
    setLoading(true);
    setCurrentSitePage(sitePage);
    setCurrentPage(null);
    setSelectedTab("site");
    setSearchParams({ route: sitePage.route });

    const editor = editorRef.current;
    if (!editor) { setLoading(false); return; }

    // Check if we have a saved version
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", sitePage.slug)
      .single();

    if (data && (data as PageData).content_components) {
      const page = data as PageData;
      setCurrentPage(page);
      try {
        editor.setComponents(JSON.parse(page.content_components));
        editor.setStyle(page.content_styles ? JSON.parse(page.content_styles) : []);
      } catch {
        editor.setComponents(page.content_html || "");
        editor.setStyle(page.content_css || "");
      }
    } else if (data) {
      setCurrentPage(data as PageData);
      editor.setComponents(data.content_html || "");
      editor.setStyle(data.content_css || "");
    } else {
      // First time editing - extract from rendered page
      toast.info("Loading page content for first-time editing...");
      const { html, css } = await extractPageHtml(sitePage.route);
      editor.setComponents(html);
      editor.setStyle(css);

      // Create the page record
      const { data: newPage } = await supabase
        .from("pages")
        .insert({
          name: sitePage.name,
          slug: sitePage.slug,
          content_html: html,
          content_css: css,
          is_published: false,
        })
        .select()
        .single();
      if (newPage) setCurrentPage(newPage as PageData);
    }

    setEditorActive(true);
    setLoading(false);
  };

  const loadCustomPage = useCallback(async (pageId: string) => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("*").eq("id", pageId).single();
    if (!data) { setLoading(false); return; }

    const page = data as PageData;
    setCurrentPage(page);
    setCurrentSitePage(null);
    setSelectedTab("custom");
    setSearchParams({ page: page.id });

    const editor = editorRef.current;
    if (!editor) { setLoading(false); return; }

    if (page.content_components) {
      try {
        editor.setComponents(JSON.parse(page.content_components));
        editor.setStyle(page.content_styles ? JSON.parse(page.content_styles) : []);
      } catch {
        editor.setComponents(page.content_html || "");
        editor.setStyle(page.content_css || "");
      }
    } else if (page.content_html) {
      editor.setComponents(page.content_html);
      editor.setStyle(page.content_css || "");
    } else {
      editor.setComponents("");
      editor.setStyle("");
    }

    setEditorActive(true);
    setLoading(false);
  }, [setSearchParams]);

  const handleSave = async () => {
    if (!currentPage || !editorRef.current) return;
    setSaving(true);
    const editor = editorRef.current;

    const { error } = await supabase
      .from("pages")
      .update({
        content_html: editor.getHtml(),
        content_css: editor.getCss(),
        content_components: JSON.stringify(editor.getComponents()),
        content_styles: JSON.stringify(editor.getStyle()),
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentPage.id);

    setSaving(false);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Page saved!");
  };

  const handleCreatePage = async () => {
    if (!newPageName || !newPageSlug) return;
    const slug = newPageSlug.startsWith("/") ? newPageSlug.slice(1) : newPageSlug;

    const { data, error } = await supabase
      .from("pages")
      .insert({ name: newPageName, slug })
      .select()
      .single();

    if (error) { toast.error("Failed to create page: " + error.message); return; }

    setNewPageName("");
    setNewPageSlug("");
    setNewPageOpen(false);
    toast.success("Page created!");
    await fetchPages();
    if (data) loadCustomPage((data as PageData).id);
  };

  const togglePublished = async () => {
    if (!currentPage) return;
    const newVal = !currentPage.is_published;
    await supabase.from("pages").update({ is_published: newVal }).eq("id", currentPage.id);
    setCurrentPage({ ...currentPage, is_published: newVal });
    toast.success(newVal ? "Page published! Override active." : "Page unpublished. Default React page will show.");
  };

  const handleResetPage = async () => {
    if (!currentPage || !currentSitePage) return;
    const editor = editorRef.current;
    if (!editor) return;

    toast.info("Re-extracting page content...");
    setLoading(true);
    const { html, css } = await extractPageHtml(currentSitePage.route);
    editor.setComponents(html);
    editor.setStyle(css);
    setLoading(false);
    toast.success("Page content reset to current version");
  };

  if (!isAdmin) return null;

  const isSitePage = currentSitePage !== null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top toolbar */}
      <div className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0 z-50">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="h-6 w-px bg-border" />

        {/* Tab switcher */}
        <div className="flex bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setSelectedTab("site")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "site"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layout className="h-3.5 w-3.5 inline mr-1.5" />
            Site Pages
          </button>
          <button
            onClick={() => setSelectedTab("custom")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5 inline mr-1.5" />
            Custom Pages
          </button>
        </div>

        {/* Current page name */}
        {currentPage && (
          <span className="text-sm font-medium text-foreground">
            {currentSitePage?.name || currentPage.name}
          </span>
        )}

        <div className="flex-1" />

        {/* Page controls */}
        {currentPage && (
          <>
            <div className="flex items-center gap-2">
              <Switch checked={currentPage.is_published} onCheckedChange={togglePublished} />
              <Label className="text-sm">
                {isSitePage
                  ? (currentPage.is_published ? "Override Active" : "Using Default")
                  : (currentPage.is_published ? "Published" : "Draft")}
              </Label>
            </div>

            {isSitePage && (
              <Button variant="ghost" size="sm" onClick={handleResetPage} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-1" /> Reset
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={() => {
              const url = isSitePage ? currentSitePage!.route : `/p/${currentPage.slug}`;
              window.open(url, "_blank");
            }}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button onClick={handleSave} disabled={saving} size="sm">
              <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 border-r border-border bg-card shrink-0 overflow-y-auto">
          {selectedTab === "site" ? (
            <div className="p-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                Site Pages
              </p>
              <p className="text-[10px] text-muted-foreground/70 px-2 mb-3">
                Click to edit in visual builder. Toggle "Override Active" to use your edits on the live site.
              </p>
              {SITE_PAGES.map((p) => (
                <button
                  key={p.route}
                  onClick={() => loadSitePage(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    currentSitePage?.route === p.route
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Layout className="h-3.5 w-3.5 shrink-0" />
                  {p.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Custom Pages
                </p>
                <Dialog open={newPageOpen} onOpenChange={setNewPageOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Page Name</Label>
                        <Input
                          value={newPageName}
                          onChange={(e) => {
                            setNewPageName(e.target.value);
                            setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                          }}
                          placeholder="e.g. Our Services"
                        />
                      </div>
                      <div>
                        <Label>URL Slug</Label>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">/p/</span>
                          <Input value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} placeholder="our-services" />
                        </div>
                      </div>
                      <Button onClick={handleCreatePage} className="w-full">Create Page</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {pages.filter(p => !p.slug.startsWith("site--")).map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadCustomPage(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    currentPage?.id === p.id && !currentSitePage
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{p.name}</span>
                  {p.is_published && <Globe className="h-3 w-3 text-green-600 shrink-0" />}
                </button>
              ))}
              {pages.filter(p => !p.slug.startsWith("site--")).length === 0 && (
                <p className="text-sm text-muted-foreground px-2 py-4 text-center">
                  No custom pages yet. Click + to create one.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Editor area */}
        <div className="flex-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-50 bg-background/80 flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading page content...</span>
              </div>
            </div>
          )}

          {!editorActive && !loading && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-3">
                <Layout className="h-12 w-12 mx-auto opacity-40" />
                <p className="text-lg font-medium">Select a page to start editing</p>
                <p className="text-sm">Choose a site page or custom page from the sidebar</p>
                <p className="text-xs text-muted-foreground/60 max-w-md mx-auto">
                  Click any element in the editor to modify it. Drag blocks from the right panel to add new sections.
                  Use the style manager to customize colors, fonts, and spacing.
                </p>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ display: editorActive ? "block" : "none" }}
          />
        </div>
      </div>
    </div>
  );
}

function addBrandedBlocks(editor: Editor) {
  const bm = editor.Blocks;
  const cat = "Frontier Residences";

  // Fonts & base styles
  const playfair = "'Playfair Display', serif";
  const lato = "'Lato', sans-serif";
  const green = "#546458";
  const greenLight = "#5a6959";
  const cream = "#efe6d9";
  const creamDark = "#e5dace";

  bm.add("fr-hero", {
    label: "Hero Section",
    category: cat,
    content: `<section style="background: linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%); padding: 100px 40px; text-align: center;">
      <h1 style="font-family: ${playfair}; font-size: 56px; color: ${green}; margin-bottom: 16px; font-weight: 700;">Your Headline Here</h1>
      <p style="font-family: ${lato}; font-size: 20px; color: ${greenLight}; max-width: 600px; margin: 0 auto 32px;">Subtitle text goes here with a compelling description.</p>
      <a href="#" style="display: inline-block; background: ${green}; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-family: ${lato}; font-weight: 700; font-size: 16px;">Call to Action</a>
    </section>`,
  });

  bm.add("fr-hero-image", {
    label: "Hero with Image",
    category: cat,
    content: `<section style="position: relative; min-height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" alt="Hero background" />
      <div style="position: absolute; inset: 0; background: rgba(84,100,88,0.6);"></div>
      <div style="position: relative; z-index: 1; text-align: center; padding: 40px; max-width: 800px;">
        <h1 style="font-family: ${playfair}; font-size: 56px; color: #fff; margin-bottom: 16px; font-weight: 700;">Bespoke Property Management</h1>
        <p style="font-family: ${lato}; font-size: 20px; color: rgba(255,255,255,0.9); margin-bottom: 32px;">Private, tailored management for exceptional properties</p>
        <a href="#" style="display: inline-block; background: #fff; color: ${green}; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-family: ${lato}; font-weight: 700;">Explore →</a>
      </div>
    </section>`,
  });

  bm.add("fr-stats", {
    label: "Stats Row",
    category: cat,
    content: `<section style="padding: 60px 40px; background: linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%);">
      <h2 style="font-family: ${playfair}; font-size: 42px; color: ${green}; text-align: center; margin-bottom: 8px; font-style: italic;">A Portfolio Built on Precision & Performance</h2>
      <p style="font-family: ${lato}; color: ${greenLight}; text-align: center; margin-bottom: 40px;">Spain • Austria • Croatia</p>
      <div style="display: flex; gap: 24px; max-width: 1000px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="font-family: ${playfair}; font-size: 48px; font-weight: 700; color: ${greenLight}; font-style: italic;">34</div>
          <div style="font-family: ${lato}; color: ${greenLight}; font-size: 14px;">Properties Managed</div>
        </div>
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="font-family: ${playfair}; font-size: 48px; font-weight: 700; color: ${greenLight}; font-style: italic;">570+</div>
          <div style="font-family: ${lato}; color: ${greenLight}; font-size: 14px;">Successful Reservations</div>
        </div>
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="font-family: ${playfair}; font-size: 48px; font-weight: 700; color: ${greenLight}; font-style: italic;">8</div>
          <div style="font-family: ${lato}; color: ${greenLight}; font-size: 14px;">Destinations</div>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-cta-banner", {
    label: "CTA Banner",
    category: cat,
    content: `<section style="background: ${green}; padding: 60px 40px; text-align: center;">
      <h2 style="font-family: ${playfair}; font-size: 36px; color: #fff; margin-bottom: 12px;">Ready to Get Started?</h2>
      <p style="font-family: ${lato}; color: rgba(255,255,255,0.8); max-width: 500px; margin: 0 auto 24px;">Let us manage your property with the care it deserves.</p>
      <a href="/evaluate" style="display: inline-block; background: #fff; color: ${green}; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-family: ${lato}; font-weight: 700;">Get a Free Evaluation →</a>
    </section>`,
  });

  bm.add("fr-text-image", {
    label: "Text + Image",
    category: cat,
    content: `<section style="padding: 80px 40px; background: #fff;">
      <div style="max-width: 1100px; margin: 0 auto; display: flex; gap: 60px; align-items: center; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <span style="font-family: ${lato}; font-size: 13px; font-weight: 700; color: ${greenLight}; text-transform: uppercase; letter-spacing: 2px;">About Us</span>
          <h2 style="font-family: ${playfair}; font-size: 40px; color: ${green}; margin: 12px 0 20px; font-weight: 700;">Crafted for Excellence</h2>
          <p style="font-family: ${lato}; color: ${greenLight}; font-size: 17px; line-height: 1.8;">We bring together international hospitality standards with deep local expertise to deliver property management that exceeds expectations.</p>
        </div>
        <div style="flex: 1; min-width: 300px;">
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600" alt="Property" style="width: 100%; border-radius: 16px; box-shadow: 0 20px 40px rgba(84,100,88,0.15);" />
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-image-gallery", {
    label: "Image Gallery",
    category: cat,
    content: `<section style="padding: 60px 40px; background: ${cream};">
      <h2 style="font-family: ${playfair}; font-size: 36px; color: ${green}; text-align: center; margin-bottom: 32px;">Our Properties</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1100px; margin: 0 auto;">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400" alt="Property 1" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px;" />
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400" alt="Property 2" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px;" />
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" alt="Property 3" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px;" />
      </div>
    </section>`,
  });

  bm.add("fr-services-grid", {
    label: "Services Grid",
    category: cat,
    content: `<section style="padding: 80px 40px; background: ${green};">
      <h2 style="font-family: ${playfair}; font-size: 40px; color: #fff; text-align: center; margin-bottom: 40px;">What's Included</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 32px; backdrop-filter: blur(10px);">
          <h3 style="font-family: ${playfair}; font-size: 22px; color: #fff; margin-bottom: 12px;">Photography & Staging</h3>
          <p style="font-family: ${lato}; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7;">Architectural photography and luxury staging for maximum appeal.</p>
        </div>
        <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 32px; backdrop-filter: blur(10px);">
          <h3 style="font-family: ${playfair}; font-size: 22px; color: #fff; margin-bottom: 12px;">Guest Communication</h3>
          <p style="font-family: ${lato}; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7;">24/7 guest support and personalised check-in experiences.</p>
        </div>
        <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 32px; backdrop-filter: blur(10px);">
          <h3 style="font-family: ${playfair}; font-size: 22px; color: #fff; margin-bottom: 12px;">Revenue Optimisation</h3>
          <p style="font-family: ${lato}; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7;">Dynamic pricing strategies to maximise your rental income.</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-testimonial", {
    label: "Testimonial",
    category: cat,
    content: `<section style="padding: 80px 40px; background: #fff;">
      <div style="max-width: 700px; margin: 0 auto; text-align: center;">
        <div style="font-family: ${playfair}; font-size: 60px; color: ${greenLight}; opacity: 0.3; line-height: 1;">"</div>
        <p style="font-family: ${playfair}; font-size: 24px; color: ${green}; font-style: italic; line-height: 1.6; margin-bottom: 24px;">Frontier Residences transformed our property into a premium rental. Their attention to detail is unmatched.</p>
        <p style="font-family: ${lato}; font-size: 14px; color: ${greenLight}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">— Property Owner, Marbella</p>
      </div>
    </section>`,
  });

  bm.add("fr-contact", {
    label: "Contact Section",
    category: cat,
    content: `<section style="padding: 80px 40px; background: ${cream};">
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="font-family: ${playfair}; font-size: 36px; color: ${green}; margin-bottom: 12px;">Get in Touch</h2>
        <p style="font-family: ${lato}; color: ${greenLight}; margin-bottom: 32px;">We'd love to hear from you. Reach out to discuss your property.</p>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <input type="text" placeholder="Your Name" style="font-family: ${lato}; padding: 14px 20px; border: 1px solid rgba(84,100,88,0.3); border-radius: 8px; font-size: 16px; background: #fff;" />
          <input type="email" placeholder="Your Email" style="font-family: ${lato}; padding: 14px 20px; border: 1px solid rgba(84,100,88,0.3); border-radius: 8px; font-size: 16px; background: #fff;" />
          <textarea placeholder="Your Message" rows="4" style="font-family: ${lato}; padding: 14px 20px; border: 1px solid rgba(84,100,88,0.3); border-radius: 8px; font-size: 16px; resize: vertical; background: #fff;"></textarea>
          <button style="background: ${green}; color: #fff; padding: 14px 36px; border-radius: 8px; font-family: ${lato}; font-weight: 700; font-size: 16px; border: none; cursor: pointer;">Send Message</button>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-spacer", {
    label: "Spacer",
    category: cat,
    content: `<div style="height: 60px;"></div>`,
  });

  bm.add("fr-divider", {
    label: "Divider",
    category: cat,
    content: `<div style="max-width: 1100px; margin: 0 auto; padding: 0 40px;"><hr style="border: none; border-top: 1px solid rgba(84,100,88,0.2); margin: 40px 0;" /></div>`,
  });

  bm.add("fr-two-column", {
    label: "Two Columns",
    category: cat,
    content: `<section style="padding: 60px 40px;">
      <div style="max-width: 1100px; margin: 0 auto; display: flex; gap: 40px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px; padding: 20px;">
          <h3 style="font-family: ${playfair}; font-size: 28px; color: ${green}; margin-bottom: 16px;">Column One</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; line-height: 1.7;">Add your content here. This is a flexible two-column layout.</p>
        </div>
        <div style="flex: 1; min-width: 300px; padding: 20px;">
          <h3 style="font-family: ${playfair}; font-size: 28px; color: ${green}; margin-bottom: 16px;">Column Two</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; line-height: 1.7;">Add your content here. This is a flexible two-column layout.</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-feature-cards", {
    label: "Feature Cards",
    category: cat,
    content: `<section style="padding: 80px 40px; background: ${cream};">
      <h2 style="font-family: ${playfair}; font-size: 40px; color: ${green}; text-align: center; margin-bottom: 40px;">Why Choose Us</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto;">
        <div style="background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="width: 48px; height: 48px; background: ${green}; border-radius: 12px; margin-bottom: 20px;"></div>
          <h3 style="font-family: ${playfair}; font-size: 22px; color: ${green}; margin-bottom: 12px;">Expert Management</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; font-size: 15px; line-height: 1.7;">Years of experience managing luxury properties across Europe.</p>
        </div>
        <div style="background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="width: 48px; height: 48px; background: ${green}; border-radius: 12px; margin-bottom: 20px;"></div>
          <h3 style="font-family: ${playfair}; font-size: 22px; color: ${green}; margin-bottom: 12px;">Premium Service</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; font-size: 15px; line-height: 1.7;">Hotel-level hospitality standards for every guest interaction.</p>
        </div>
        <div style="background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08); border: 1px solid rgba(84,100,88,0.1);">
          <div style="width: 48px; height: 48px; background: ${green}; border-radius: 12px; margin-bottom: 20px;"></div>
          <h3 style="font-family: ${playfair}; font-size: 22px; color: ${green}; margin-bottom: 12px;">Transparent Reporting</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; font-size: 15px; line-height: 1.7;">Detailed monthly financial reports and performance analytics.</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-full-image", {
    label: "Full Width Image",
    category: cat,
    content: `<section style="padding: 0;">
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400" alt="Full width image" style="width: 100%; height: 400px; object-fit: cover; display: block;" />
    </section>`,
  });

  bm.add("fr-team-grid", {
    label: "Team Grid",
    category: cat,
    content: `<section style="padding: 80px 40px; background: #fff;">
      <h2 style="font-family: ${playfair}; font-size: 40px; color: ${green}; text-align: center; margin-bottom: 40px;">Meet Our Team</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 900px; margin: 0 auto;">
        <div style="text-align: center;">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" alt="Team member" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px;" />
          <h3 style="font-family: ${playfair}; font-size: 20px; color: ${green}; margin-bottom: 4px;">Team Member</h3>
          <p style="font-family: ${lato}; font-size: 14px; color: ${greenLight};">Position Title</p>
        </div>
        <div style="text-align: center;">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" alt="Team member" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px;" />
          <h3 style="font-family: ${playfair}; font-size: 20px; color: ${green}; margin-bottom: 4px;">Team Member</h3>
          <p style="font-family: ${lato}; font-size: 14px; color: ${greenLight};">Position Title</p>
        </div>
        <div style="text-align: center;">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" alt="Team member" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px;" />
          <h3 style="font-family: ${playfair}; font-size: 20px; color: ${green}; margin-bottom: 4px;">Team Member</h3>
          <p style="font-family: ${lato}; font-size: 14px; color: ${greenLight};">Position Title</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-faq", {
    label: "FAQ Section",
    category: cat,
    content: `<section style="padding: 80px 40px; background: ${cream};">
      <h2 style="font-family: ${playfair}; font-size: 36px; color: ${green}; text-align: center; margin-bottom: 40px;">Frequently Asked Questions</h2>
      <div style="max-width: 700px; margin: 0 auto;">
        <div style="border-bottom: 1px solid rgba(84,100,88,0.2); padding: 20px 0;">
          <h3 style="font-family: ${lato}; font-size: 18px; color: ${green}; font-weight: 700; margin-bottom: 8px;">How does property management work?</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; line-height: 1.7;">We handle everything from guest communication and check-ins to cleaning, maintenance, and financial reporting.</p>
        </div>
        <div style="border-bottom: 1px solid rgba(84,100,88,0.2); padding: 20px 0;">
          <h3 style="font-family: ${lato}; font-size: 18px; color: ${green}; font-weight: 700; margin-bottom: 8px;">What locations do you cover?</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; line-height: 1.7;">We operate across Spain's Costa del Sol, Austria (Vienna & Carinthia), and Croatia's Istria region.</p>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="font-family: ${lato}; font-size: 18px; color: ${green}; font-weight: 700; margin-bottom: 8px;">What is the Guaranteed Income Program?</h3>
          <p style="font-family: ${lato}; color: ${greenLight}; line-height: 1.7;">We lease your property long-term and guarantee a fixed monthly income regardless of occupancy.</p>
        </div>
      </div>
    </section>`,
  });
}
