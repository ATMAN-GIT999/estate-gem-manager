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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, FileText, Eye, Globe } from "lucide-react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";

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

  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fetch pages
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
        [gjsPresetWebpage as any]: {
          blocksBasicOpts: { flexGrid: true },
        },
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

    // Add Frontier Residences branded blocks
    const bm = editor.Blocks;

    bm.add("fr-hero", {
      label: "Hero Section",
      category: "Frontier Residences",
      content: `<section style="background: linear-gradient(135deg, #efe6d9 0%, #e5dace 100%); padding: 100px 40px; text-align: center;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 48px; color: #546458; margin-bottom: 16px;">Your Headline Here</h1>
        <p style="font-family: 'Lato', sans-serif; font-size: 20px; color: #5a6959; max-width: 600px; margin: 0 auto 32px;">Subtitle text goes here with a brief description.</p>
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
          <p style="font-family: 'Lato', sans-serif; font-size: 18px; line-height: 1.8; color: #5a6959;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Content for the left side of this two-column layout.</p>
          </div>
          <div style="flex: 1; min-width: 300px;">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #546458; margin-bottom: 16px;">Right Column</h3>
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Content for the right side of this two-column layout.</p>
          </div>
        </div>
      </section>`,
    });

    bm.add("fr-cta", {
      label: "CTA Banner",
      category: "Frontier Residences",
      content: `<section style="padding: 80px 40px; background: linear-gradient(135deg, #546458 0%, #3d4d40 100%); text-align: center;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #fff; margin-bottom: 16px;">Ready to Get Started?</h2>
        <p style="font-family: 'Lato', sans-serif; font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 32px;">Contact us today for a free consultation.</p>
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
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.8;">Describe your properties, services, or any content alongside an image.</p>
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
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description of the first service or feature you offer.</p>
          </div>
          <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08);">
            <h4 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #546458; margin-bottom: 12px;">Service Two</h4>
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description of the second service or feature you offer.</p>
          </div>
          <div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(84,100,88,0.08);">
            <h4 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #546458; margin-bottom: 12px;">Service Three</h4>
            <p style="font-family: 'Lato', sans-serif; color: #5a6959; line-height: 1.7;">Description of the third service or feature you offer.</p>
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

    // Style the GrapesJS UI to match brand
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

  // Load page into editor
  const loadPage = useCallback(
    async (pageId: string) => {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();
      if (!data) return;
      const page = data as PageData;
      setCurrentPage(page);
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

  // Auto-load page from URL param
  useEffect(() => {
    if (!loaded || pages.length === 0) return;
    const pageId = searchParams.get("page");
    if (pageId) {
      loadPage(pageId);
    }
  }, [loaded, pages, searchParams, loadPage]);

  // Save
  const handleSave = async () => {
    if (!currentPage || !editorRef.current) return;
    setSaving(true);
    const editor = editorRef.current;

    const html = editor.getHtml();
    const css = editor.getCss();
    const components = JSON.stringify(editor.getComponents());
    const styles = JSON.stringify(editor.getStyle());

    const { error } = await supabase
      .from("pages")
      .update({
        content_html: html,
        content_css: css,
        content_components: components,
        content_styles: styles,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentPage.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("Page saved!");
    }
  };

  // Create new page
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
    if (data) loadPage((data as PageData).id);
  };

  // Toggle published
  const togglePublished = async () => {
    if (!currentPage) return;
    const newVal = !currentPage.is_published;
    await supabase
      .from("pages")
      .update({ is_published: newVal })
      .eq("id", currentPage.id);
    setCurrentPage({ ...currentPage, is_published: newVal });
    toast.success(newVal ? "Page published!" : "Page unpublished");
  };

  if (!isAdmin) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0 z-50">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="h-6 w-px bg-border" />

        {/* Page selector */}
        <Select
          value={currentPage?.id || ""}
          onValueChange={(id) => loadPage(id)}
        >
          <SelectTrigger className="w-[200px] h-9">
            <SelectValue placeholder="Select a page..." />
          </SelectTrigger>
          <SelectContent>
            {pages.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  {p.name}
                  {p.is_published && <Globe className="h-3 w-3 text-green-600" />}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* New Page */}
        <Dialog open={newPageOpen} onOpenChange={setNewPageOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Page
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
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                    );
                  }}
                  placeholder="e.g. Our Services"
                />
              </div>
              <div>
                <Label>URL Slug</Label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">/p/</span>
                  <Input
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="our-services"
                  />
                </div>
              </div>
              <Button onClick={handleCreatePage} className="w-full">
                Create Page
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1" />

        {/* Publish toggle */}
        {currentPage && (
          <div className="flex items-center gap-2">
            <Switch
              checked={currentPage.is_published}
              onCheckedChange={togglePublished}
            />
            <Label className="text-sm">
              {currentPage.is_published ? "Published" : "Draft"}
            </Label>
          </div>
        )}

        {currentPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/p/${currentPage.slug}`, "_blank")}
          >
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
        )}

        <Button
          onClick={handleSave}
          disabled={saving || !currentPage}
          size="sm"
        >
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* GrapesJS Editor */}
      <div ref={containerRef} className="flex-1 overflow-hidden" />
    </div>
  );
}
