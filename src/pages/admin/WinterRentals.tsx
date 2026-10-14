import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Container } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toMidtermListing, winterListingPath, type MidtermListing, type MidtermStatus } from "@/lib/winterRentals";

/**
 * /admin/winter-rentals — the live reservation state of the winter homes.
 *
 * This is the one place Frontier keeps the status. The website is the source of
 * truth for these homes (Idealista is only an enquiry channel), so when an
 * enquiry is confirmed the status is set here first, then Idealista is
 * adjusted by hand and — for the houses that are also in Guesty — the Guesty
 * days are blocked. A status that is only set in one of those places is how a
 * home ends up let twice.
 *
 * Each change saves on its own: these are four fields on a handful of rows,
 * and a "Save" button per row is one more thing to forget.
 */
const STATUS_OPTIONS: Array<{ value: MidtermStatus; label: string }> = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved (confirmed, contract pending)" },
  { value: "let", label: "Let" },
];

type Enquiry = Database["public"]["Tables"]["midterm_requests"]["Row"];
const ENQUIRY_STATUS = ["new", "contacted", "confirmed", "declined"] as const;

const AdminWinterRentals = () => {
  const { toast } = useToast();
  const [homes, setHomes] = useState<MidtermListing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("midterm_listings")
        .select("*")
        .order("city_group", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) {
        toast({ title: "Could not load winter rentals", description: error.message, variant: "destructive" });
      }
      setHomes((data ?? []).map(toMidtermListing));
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <Link to="/admin" className="inline-flex items-center gap-2 t-body text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
          <h1 className="t-section text-foreground">Winter rentals</h1>
          <p className="t-body text-muted-foreground mt-2 max-w-prose">
            Set the status here as soon as an enquiry is confirmed, then update Idealista and, for houses that are also
            in Guesty, block the days there. A home goes public once <strong>Published</strong> is on.
          </p>

          {loading ? (
            <p className="t-body text-muted-foreground mt-8">Loading…</p>
          ) : (
            <div className="space-y-4 mt-8">
              {homes.map((home) => (
                <Card key={home.id}>
                  <CardContent className="p-4 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] items-end">
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
    </div>
  );
};

export default AdminWinterRentals;
