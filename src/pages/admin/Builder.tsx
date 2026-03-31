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
import { ArrowLeft, Save, Plus, FileText, Eye, Globe, Layout, ExternalLink } from "lucide-react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";

// Existing site pages that can be edited via iframe
const SITE_PAGES = [
  { name: "Homepage", route: "/" },
  { name: "About Us", route: "/about" },
  { name: "Properties", route: "/properties" },
  { name: "Projects", route: "/projects" },
  { name: "Property Management", route: "/property-management" },
  { name: "Guaranteed Income", route: "/guaranteed-income" },
  { name: "Renovations", route: "/renovations" },
  { name: "Investments", route: "/investments" },
  { name: "Business Areas", route: "/business-areas" },
  { name: "Evaluate", route: "/evaluate" },
  { name: "Book", route: "/book" },
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

type EditorMode = "none" | "site-page" | "custom-page";

export default function BuilderPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [currentSiteRoute, setCurrentSiteRoute] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("none");
  const [saving, setSaving] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"site" | "custom">("site");

  const fetchPages = useCallback(async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setPages(data as PageData[]);
    return data;
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/auth");
      return;
    }
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
        styles: [
          "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap",
        ],
      },
      deviceManager: {
        devices: [
          { name: "Desktop", width: "" },
          { name: "Tablet", width: "768px", widthMedia: "992px" },
          { name: "Mobile", width: "375px", widthMedia: "480px" },
        ],
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

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // Auto-load from URL params
  useEffect(() => {
    if (!loaded) return;
    const route = searchParams.get("route");
    const pageId = searchParams.get("page");

    if (route) {
      selectSitePage(route);
    } else if (pageId && pages.length > 0) {
      loadCustomPage(pageId);
    }
  }, [loaded, pages, searchParams]);

  const selectSitePage = (route: string) => {
    setEditorMode("site-page");
    setCurrentSiteRoute(route);
    setCurrentPage(null);
    setSelectedTab("site");
    setSearchParams({ route });
  };

  const loadCustomPage = useCallback(
    async (pageId: string) => {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();
      if (!data) return;
      const page = data as PageData;
      setCurrentPage(page);
      setCurrentSiteRoute(null);
      setEditorMode("custom-page");
      setSelectedTab("custom");
      setSearchParams({ page: page.id });

      const editor = editorRef.current;
      if (!editor) return;

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
    },
    [setSearchParams]
  );

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

    if (error) {
      toast.error("Failed to create page: " + error.message);
      return;
    }

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
    toast.success(newVal ? "Page published!" : "Page unpublished");
  };

  if (!isAdmin) return null;

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

        <div className="flex-1" />

        {/* Custom page controls */}
        {editorMode === "custom-page" && currentPage && (
          <>
            <div className="flex items-center gap-2">
              <Switch checked={currentPage.is_published} onCheckedChange={togglePublished} />
              <Label className="text-sm">{currentPage.is_published ? "Published" : "Draft"}</Label>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.open(`/p/${currentPage.slug}`, "_blank")}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button onClick={handleSave} disabled={saving} size="sm">
              <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          </>
        )}

        {/* Site page controls */}
        {editorMode === "site-page" && currentSiteRoute && (
          <Button variant="ghost" size="sm" onClick={() => window.open(currentSiteRoute, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" /> Open Page
          </Button>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - page list */}
        <div className="w-56 border-r border-border bg-card shrink-0 overflow-y-auto">
          {selectedTab === "site" ? (
            <div className="p-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                Site Pages
              </p>
              {SITE_PAGES.map((p) => (
                <button
                  key={p.route}
                  onClick={() => selectSitePage(p.route)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    currentSiteRoute === p.route
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
                            setNewPageSlug(
                              e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                            );
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
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadCustomPage(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    currentPage?.id === p.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{p.name}</span>
                  {p.is_published && <Globe className="h-3 w-3 text-green-600 shrink-0" />}
                </button>
              ))}
              {pages.length === 0 && (
                <p className="text-sm text-muted-foreground px-2 py-4 text-center">
                  No custom pages yet. Click + to create one.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Editor / iframe area */}
        <div className="flex-1 relative overflow-hidden">
          {editorMode === "none" && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-3">
                <Layout className="h-12 w-12 mx-auto opacity-40" />
                <p className="text-lg font-medium">Select a page to start editing</p>
                <p className="text-sm">Choose a site page or custom page from the sidebar</p>
              </div>
            </div>
          )}

          {/* Site page iframe editor */}
          {editorMode === "site-page" && currentSiteRoute && (
            <iframe
              key={currentSiteRoute}
              src={currentSiteRoute + "?edit=true"}
              className="w-full h-full border-0"
              title="Page Editor"
            />
          )}

          {/* GrapesJS editor for custom pages */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ display: editorMode === "custom-page" ? "block" : "none" }}
          />
        </div>
      </div>
    </div>
  );
}

function addBrandedBlocks(editor: Editor) {
  const bm = editor.Blocks;

  bm.add("fr-hero", {
    label: "Hero Section",
    category: "Frontier Residences",
    content: `<section style="background: linear-gradient(135deg, #efe6d9 0%, #e5dace 100%); padding: 100px 40px; text-align: center;">
      <h1 style="font-family: 'Playfair Display', serif; font-size: 48px; color: #546458; margin-bottom: 16px;">Your Headline Here</h1>
      <p style="font-family: 'Lato', sans-serif; font-size: 20px; color: #5a6959; max-width: 600px; margin: 0 auto 32px;">Subtitle text goes here.</p>
      <a href="#" style="display: inline-block; background: #546458; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-family: 'Lato', sans-serif; font-weight: 700;">Call to Action</a>
    </section>`,
  });

  bm.add("fr-stats", {
    label: "Stats Row",
    category: "Frontier Residences",
    content: `<section style="padding: 60px 40px; background: linear-gradient(135deg, #efe6d9 0%, #e5dace 100%);">
      <div style="display: flex; gap: 24px; max-width: 1000px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.1);">
          <div style="font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #5a6959;">34</div>
          <div style="font-family: 'Lato', sans-serif; color: #5a6959;">Properties Managed</div>
        </div>
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.1);">
          <div style="font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #5a6959;">570+</div>
          <div style="font-family: 'Lato', sans-serif; color: #5a6959;">Reservations</div>
        </div>
        <div style="flex: 1; min-width: 200px; background: #fff; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 4px 20px rgba(84,100,88,0.1);">
          <div style="font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #5a6959;">8</div>
          <div style="font-family: 'Lato', sans-serif; color: #5a6959;">Destinations</div>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-text-section", {
    label: "Text Section",
    category: "Frontier Residences",
    content: `<section style="padding: 80px 40px; background: #fff;">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #546458; margin-bottom: 20px;">Section Title</h2>
        <p style="font-family: 'Lato', sans-serif; font-size: 18px; line-height: 1.8; color: #5a6959;">Lorem ipsum dolor sit amet.</p>
      </div>
    </section>`,
  });

  bm.add("fr-two-col", {
    label: "Two Columns",
    category: "Frontier Residences",
    content: `<section style="padding: 80px 40px; background: #efe6d9;">
      <div style="display: flex; gap: 40px; max-width: 1100px; margin: 0 auto; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #546458; margin-bottom: 16px;">Left Column</h3>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Content for the left side.</p>
        </div>
        <div style="flex: 1; min-width: 300px;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #546458; margin-bottom: 16px;">Right Column</h3>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Content for the right side.</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-cta", {
    label: "CTA Banner",
    category: "Frontier Residences",
    content: `<section style="padding: 80px 40px; background: linear-gradient(135deg, #546458 0%, #3d4d40 100%); text-align: center;">
      <h2 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #fff; margin-bottom: 16px;">Ready to Get Started?</h2>
      <p style="font-family: 'Lato', sans-serif; font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 32px;">Contact us today.</p>
      <a href="/evaluate" style="display: inline-block; background: #efe6d9; color: #546458; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-family: 'Lato', sans-serif; font-weight: 700;">Get in Touch</a>
    </section>`,
  });

  bm.add("fr-image-text", {
    label: "Image + Text",
    category: "Frontier Residences",
    content: `<section style="padding: 80px 40px; background: #fff;">
      <div style="display: flex; gap: 40px; max-width: 1100px; margin: 0 auto; align-items: center; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" alt="Property image"/>
        </div>
        <div style="flex: 1; min-width: 300px;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #546458; margin-bottom: 16px;">Beautiful Properties</h3>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Describe your content here.</p>
          <a href="#" style="display: inline-block; margin-top: 20px; color: #546458; font-family: 'Lato', sans-serif; font-weight: 700; text-decoration: underline;">Learn More →</a>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-cards", {
    label: "Card Grid",
    category: "Frontier Residences",
    content: `<section style="padding: 80px 40px; background: #efe6d9;">
      <h2 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #546458; text-align: center; margin-bottom: 40px;">Our Services</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto;">
        <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08);">
          <h4 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #546458; margin-bottom: 12px;">Service One</h4>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description here.</p>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08);">
          <h4 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #546458; margin-bottom: 12px;">Service Two</h4>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description here.</p>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08);">
          <h4 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #546458; margin-bottom: 12px;">Service Three</h4>
          <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description here.</p>
        </div>
      </div>
    </section>`,
  });

  bm.add("fr-footer", {
    label: "Footer",
    category: "Frontier Residences",
    content: `<footer style="padding: 40px; background: #546458; text-align: center;">
      <p style="font-family: 'Lato', sans-serif; color: rgba(255,255,255,0.7); margin: 0;">© 2026 Frontier Residences. All rights reserved.</p>
    </footer>`,
  });
}
