import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, ImageIcon, Loader2, Plus, Trash2, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Container } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";
import {
  WINTER_RENTAL_CITIES,
  toMidtermListing,
  winterListingPath,
  type MidtermListing,
  type MidtermStatus,
  type WinterRentalCity,
} from "@/lib/winterRentals";

/**
 * /admin/winter-rentals — the live reservation state of the winter homes,
 * and the only place a new one gets added.
 *
 * This is the one place Frontier keeps the status. The website is the source of
 * truth for these homes (Idealista is only an enquiry channel), so when an
 * enquiry is confirmed the status is set here first, then Idealista is
 * adjusted by hand and — for the houses that are also in Guesty — the Guesty
 * days are blocked. A status that is only set in one of those places is how a
 * home ends up let twice.
 *
 * Two editing surfaces on purpose: the row below is the handful of fields
 * Frontier touches often (status, rent, availability, published) and each
 * saves on its own the moment it changes — a "Save" button for four fields
 * is one more thing to forget. "Edit details" opens the full form for
 * everything a new home needs once (photos, description, deposit, stay
 * limits) and saves all of it together, the way `/admin/properties` does for
 * the Guesty side.
 *
 * Photos go through the same `property-images` bucket and the same
 * admin-only storage policies as the Guesty properties (migration
 * 20251114145438) — there is no reason for winter homes to need a bucket of
 * their own, and a new one would mean new storage policies to apply by hand.
 */
const STATUS_OPTIONS: Array<{ value: MidtermStatus; label: string }> = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved (confirmed, contract pending)" },
  { value: "let", label: "Let" },
];

// The five types translations.ts has a label for (wr-type-*). Anything typed
// outside this list still saves, but shows untranslated on the public page —
// so the form steers towards these instead of a free-text field.
const PROPERTY_TYPES: Array<{ value: string; label: string }> = [
  { value: "apartment", label: "Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "semi-detached", label: "Semi-detached house" },
  { value: "penthouse", label: "Penthouse" },
  { value: "villa", label: "Villa" },
];

const PHOTO_BUCKET = "property-images";

type Enquiry = Database["public"]["Tables"]["midterm_requests"]["Row"];
const ENQUIRY_STATUS = ["new", "contacted", "confirmed", "declined"] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface FormState {
  name: string;
  slug: string;
  city_group: WinterRentalCity["slug"] | "";
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: string;
  guests: string;
  size_sqm: string;
  monthly_price: number;
  deposit: string;
  utilities_included: boolean;
  min_stay_months: string;
  max_stay_months: string;
  available_from: string;
  available_until: string;
  registration_number: string;
  idealista_id: string;
  status: MidtermStatus;
  published: boolean;
  description: string;
  amenities: string;
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  city_group: "",
  location: "",
  property_type: "",
  bedrooms: 1,
  bathrooms: "",
  guests: "",
  size_sqm: "",
  monthly_price: 0,
  deposit: "",
  utilities_included: false,
  min_stay_months: "",
  max_stay_months: "",
  available_from: "",
  available_until: "",
  registration_number: "",
  idealista_id: "",
  status: "available",
  published: false,
  description: "",
  amenities: "",
};

const formFromHome = (home: MidtermListing): FormState => ({
  name: home.name,
  slug: home.slug,
  city_group: home.city_group,
  location: home.location,
  property_type: home.property_type,
  bedrooms: home.bedrooms,
  bathrooms: home.bathrooms?.toString() ?? "",
  guests: home.guests?.toString() ?? "",
  size_sqm: home.size_sqm?.toString() ?? "",
  monthly_price: home.monthly_price,
  deposit: home.deposit?.toString() ?? "",
  utilities_included: home.utilities_included ?? false,
  min_stay_months: home.min_stay_months?.toString() ?? "",
  max_stay_months: home.max_stay_months?.toString() ?? "",
  available_from: home.available_from ?? "",
  available_until: home.available_until ?? "",
  registration_number: home.registration_number ?? "",
  idealista_id: home.idealista_id ?? "",
  status: home.status,
  published: home.published,
  description: home.description ?? "",
  amenities: home.amenities?.join(", ") ?? "",
});

const AdminWinterRentals = () => {
  const { toast } = useToast();
  const [homes, setHomes] = useState<MidtermListing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHome, setEditingHome] = useState<MidtermListing | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [existingImages, setExistingImages] = useState<MidtermListing["images"]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const loadHomes = async () => {
    const { data, error } = await supabase
      .from("midterm_listings")
      .select("*")
      .order("city_group", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Could not load winter rentals", description: error.message, variant: "destructive" });
      return;
    }
    setHomes((data ?? []).map(toMidtermListing));
  };

  useEffect(() => {
    const load = async () => {
      await loadHomes();
      const { data: requests } = await supabase
        .from("midterm_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setEnquiries(requests ?? []);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quick inline edit — unchanged from before: one field changes, one row saves.
  const save = async (id: string, patch: Partial<MidtermListing>) => {
    const previous = homes;
    setHomes((rows) => rows.map((h) => (h.id === id ? { ...h, ...patch } : h)));
    const { error } = await supabase.from("midterm_listings").update(patch).eq("id", id);
    if (error) {
      setHomes(previous);
      toast({ title: "Not saved", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved" });
  };

  const setEnquiryStatus = async (id: string, status: string) => {
    const previous = enquiries;
    setEnquiries((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from("midterm_requests").update({ status }).eq("id", id);
    if (error) {
      setEnquiries(previous);
      toast({ title: "Not saved", description: error.message, variant: "destructive" });
    }
  };

  const openNewHomeDialog = () => {
    setEditingHome(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setExistingImages([]);
    setNewImageFiles([]);
    setDialogOpen(true);
  };

  const openEditDialog = (home: MidtermListing) => {
    setEditingHome(home);
    setForm(formFromHome(home));
    setSlugTouched(true);
    setExistingImages(home.images);
    setNewImageFiles([]);
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
  };

  const handleDelete = async (home: MidtermListing) => {
    if (!confirm(`Delete "${home.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("midterm_listings").delete().eq("id", home.id);
    if (error) {
      toast({ title: "Not deleted", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    await loadHomes();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city_group || !form.property_type) {
      toast({
        title: "Missing fields",
        description: "Pick a place and a property type before saving.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const uploaded: MidtermListing["images"] = [];
      for (const file of newImageFiles) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `midterm/${form.slug || "listing"}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
        uploaded.push({ url: data.publicUrl });
      }

      const amenities = form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        slug: form.slug,
        city_group: form.city_group,
        location: form.location,
        property_type: form.property_type,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        guests: form.guests ? Number(form.guests) : null,
        size_sqm: form.size_sqm ? Number(form.size_sqm) : null,
        monthly_price: form.monthly_price,
        deposit: form.deposit ? Number(form.deposit) : null,
        utilities_included: form.utilities_included,
        min_stay_months: form.min_stay_months ? Number(form.min_stay_months) : null,
        max_stay_months: form.max_stay_months ? Number(form.max_stay_months) : null,
        available_from: form.available_from || null,
        available_until: form.available_until || null,
        registration_number: form.registration_number || null,
        idealista_id: form.idealista_id || null,
        status: form.status,
        published: form.published,
        description: form.description || null,
        amenities: amenities.length ? amenities : null,
        images: [...existingImages, ...uploaded],
      };

      if (editingHome) {
        const { error } = await supabase.from("midterm_listings").update(payload).eq("id", editingHome.id);
        if (error) throw error;
        toast({ title: "Saved" });
      } else {
        const { error } = await supabase.from("midterm_listings").insert([payload]);
        if (error) throw error;
        toast({ title: "Home added" });
      }

      setDialogOpen(false);
      await loadHomes();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Not saved", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <Link to="/admin" className="inline-flex items-center gap-2 t-body text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="t-section text-foreground">Winter rentals</h1>
              <p className="t-body text-muted-foreground mt-2 max-w-prose">
                Set the status here as soon as an enquiry is confirmed, then update Idealista and, for houses that are
                also in Guesty, block the days there. A home goes public once <strong>Published</strong> is on.
              </p>
            </div>
            <Button onClick={openNewHomeDialog}>
              <Plus className="h-4 w-4 mr-2" /> Add home
            </Button>
          </div>

          {loading ? (
            <p className="t-body text-muted-foreground mt-8">Loading…</p>
          ) : (
            <div className="space-y-4 mt-8">
              {homes.map((home) => (
                <Card key={home.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] items-end">
                      <div>
                        <p className="t-card text-foreground">{home.name}</p>
                        <p className="t-meta text-muted-foreground">
                          {home.city_group} · {home.location}
                        </p>
                        <Link to={winterListingPath(home)} className="t-meta text-accent-strong hover:underline">
                          View page
                        </Link>
                      </div>
                      <div className="space-y-1">
                        <Label>Status</Label>
                        <Select value={home.status} onValueChange={(v) => save(home.id, { status: v as MidtermStatus })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`price-${home.id}`}>Monthly rent (€)</Label>
                        <Input
                          id={`price-${home.id}`}
                          type="number"
                          min={0}
                          defaultValue={home.monthly_price}
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (!Number.isNaN(value) && value !== home.monthly_price) save(home.id, { monthly_price: value });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`from-${home.id}`}>Available from</Label>
                        <Input
                          id={`from-${home.id}`}
                          type="date"
                          defaultValue={home.available_from ?? ""}
                          onBlur={(e) => {
                            const value = e.target.value || null;
                            if (value !== home.available_from) save(home.id, { available_from: value });
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 pb-2">
                        <Switch
                          id={`pub-${home.id}`}
                          checked={home.published}
                          onCheckedChange={(v) => save(home.id, { published: v })}
                        />
                        <Label htmlFor={`pub-${home.id}`}>Published</Label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-t border-border pt-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(home)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit details &amp; photos
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(home)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {homes.length === 0 && <p className="t-body text-muted-foreground">No winter rentals yet.</p>}
            </div>
          )}

          <h2 className="t-section text-foreground mt-12">Enquiries</h2>
          <p className="t-body text-muted-foreground mt-2 max-w-prose">
            New enquiries from the website. When you confirm one, set the home&apos;s status above and send the payment
            link for the deposit and first month.
          </p>
          <div className="space-y-4 mt-6">
            {enquiries.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 grid gap-3 md:grid-cols-[1.6fr_1fr_auto] items-start">
                  <div>
                    <p className="t-card text-foreground">
                      {r.first_name} {r.last_name ?? ""} · {r.listing_name}
                    </p>
                    <p className="t-meta text-muted-foreground">
                      <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                      {r.phone ? ` · ${r.phone}` : ""}
                    </p>
                    <p className="t-meta text-muted-foreground mt-1">
                      {[
                        r.desired_from ? `from ${r.desired_from}` : null,
                        r.desired_months ? `${r.desired_months} months` : null,
                        r.guests ? `${r.guests} guests` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {r.message && <p className="t-body text-foreground mt-2">{r.message}</p>}
                  </div>
                  <p className="t-meta text-muted-foreground">{new Date(r.created_at).toLocaleString("en-GB")}</p>
                  <Select value={r.status} onValueChange={(v) => setEnquiryStatus(r.id, v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENQUIRY_STATUS.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}
            {!loading && enquiries.length === 0 && <p className="t-body text-muted-foreground">No enquiries yet.</p>}
          </div>
        </Container>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHome ? "Edit winter rental" : "Add a new winter rental"}</DialogTitle>
            <DialogDescription>
              The home appears on the website only once <strong>Published</strong> is on, below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Apartment in Soho"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Page address *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="apartment-soho"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city_group">Place *</Label>
                <Select
                  value={form.city_group}
                  onValueChange={(v) => setForm((f) => ({ ...f, city_group: v as WinterRentalCity["slug"] }))}
                >
                  <SelectTrigger id="city_group">
                    <SelectValue placeholder="Choose a place" />
                  </SelectTrigger>
                  <SelectContent>
                    {WINTER_RENTAL_CITIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.slug.charAt(0).toUpperCase() + c.slug.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Neighbourhood *</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Soho, Málaga"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This is public. The exact address is only given out once an enquiry is confirmed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">Property type *</Label>
                <Select value={form.property_type} onValueChange={(v) => setForm((f) => ({ ...f, property_type: v }))}>
                  <SelectTrigger id="property_type">
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_price">Monthly rent (€) *</Label>
                <Input
                  id="monthly_price"
                  type="number"
                  min={0}
                  value={form.monthly_price}
                  onChange={(e) => setForm((f) => ({ ...f, monthly_price: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bedrooms: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={0}
                  value={form.guests}
                  onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size_sqm">Size (m²)</Label>
                <Input
                  id="size_sqm"
                  type="number"
                  min={0}
                  value={form.size_sqm}
                  onChange={(e) => setForm((f) => ({ ...f, size_sqm: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit (€)</Label>
                <Input
                  id="deposit"
                  type="number"
                  min={0}
                  value={form.deposit}
                  onChange={(e) => setForm((f) => ({ ...f, deposit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stay_months">Min. stay (months)</Label>
                <Input
                  id="min_stay_months"
                  type="number"
                  min={0}
                  value={form.min_stay_months}
                  onChange={(e) => setForm((f) => ({ ...f, min_stay_months: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_stay_months">Max. stay (months)</Label>
                <Input
                  id="max_stay_months"
                  type="number"
                  min={0}
                  value={form.max_stay_months}
                  onChange={(e) => setForm((f) => ({ ...f, max_stay_months: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id="utilities_included"
                  checked={form.utilities_included}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, utilities_included: v }))}
                />
                <Label htmlFor="utilities_included">Utilities included</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_from">Available from</Label>
                <Input
                  id="available_from"
                  type="date"
                  value={form.available_from}
                  onChange={(e) => setForm((f) => ({ ...f, available_from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_until">Available until</Label>
                <Input
                  id="available_until"
                  type="date"
                  value={form.available_until}
                  onChange={(e) => setForm((f) => ({ ...f, available_until: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as MidtermStatus }))}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pb-2 pt-6">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="Write this in your own words — not copied from the Idealista advert."
              />
              <p className="text-xs text-muted-foreground">
                Left empty, the page falls back to a plain line built from type, location, bedrooms and size.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Textarea
                id="amenities"
                value={form.amenities}
                onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
                placeholder="Pool, Parking, Air conditioning"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registration_number">Registration number</Label>
                <Input
                  id="registration_number"
                  value={form.registration_number}
                  onChange={(e) => setForm((f) => ({ ...f, registration_number: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Needed before the home can go live.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idealista_id">Idealista listing ID</Label>
                <Input
                  id="idealista_id"
                  value={form.idealista_id}
                  onChange={(e) => setForm((f) => ({ ...f, idealista_id: e.target.value }))}
                  placeholder="Optional — for the team, not shown publicly"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>

              {existingImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current photos ({existingImages.length}) — the first one is used as the main photo.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((img, index) => (
                      <div key={img.url} className="relative group">
                        <img
                          src={img.url}
                          alt={img.caption ?? ""}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImageFiles.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">New photos to upload ({newImageFiles.length})</p>
                  <div className="grid grid-cols-3 gap-3">
                    {newImageFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setNewImageFiles(newImageFiles.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    setNewImageFiles([...newImageFiles, ...files]);
                    e.target.value = "";
                  }}
                />
                <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById("images")?.click()}>
                  <ImageIcon className="h-4 w-4 mr-2" /> Add photos
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
                  </>
                ) : editingHome ? (
                  "Save changes"
                ) : (
                  "Add home"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWinterRentals;
