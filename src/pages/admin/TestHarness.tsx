import { useEffect, useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  PlayCircle,
  Clock,
  ChevronDown,
  AlertTriangle,
  Beaker,
} from "lucide-react";

// ---------- Types ----------

type StepStatus = "pending" | "running" | "success" | "skipped" | "error";

interface StepResult {
  status: StepStatus;
  durationMs?: number;
  message?: string;
  hint?: string;
  data?: any;
  error?: string;
}

interface StepDef {
  id: string;
  name: string;
  description: string;
  destructive?: boolean;
}

const STEPS: StepDef[] = [
  {
    id: "auth",
    name: "Authenticate with Guesty",
    description: "Fetches a cached OAuth token for the Booking Engine API.",
  },
  {
    id: "calendar",
    name: "Check availability",
    description: "Pulls the property calendar for the chosen window.",
  },
  {
    id: "quote",
    name: "Generate price quote",
    description: "Requests a real-time quote from Guesty.",
  },
  {
    id: "stripe",
    name: "Load Stripe payment config",
    description: "Confirms the Stripe publishable key is reachable.",
  },
  {
    id: "webhook",
    name: "Simulate webhook (safe)",
    description: "Sends a mock payment.succeeded event to the webhook handler.",
  },
  {
    id: "reservation",
    name: "Create test reservation (inquiry)",
    description:
      "Creates a non-charging inquiry reservation in Guesty. Skip unless you really want a real record.",
    destructive: true,
  },
];

// ---------- Helpers ----------

/**
 * Translate technical edge-function errors into something a human can act on.
 */
function humanize(stepId: string, raw: unknown): { message: string; hint?: string } {
  const text =
    typeof raw === "string"
      ? raw
      : raw instanceof Error
      ? raw.message
      : JSON.stringify(raw);

  const t = text.toLowerCase();

  if (t.includes("rate limit") || t.includes("3/24h") || t.includes("too many"))
    return {
      message: "Guesty rate limit hit (3 token requests / 24h).",
      hint: "Wait for the cached token to refresh, or reuse the existing token.",
    };
  if (t.includes("client_id") || t.includes("client_secret") || t.includes("invalid_client"))
    return {
      message: "Guesty credentials are missing or invalid.",
      hint: "Update GUESTY_CLIENT_ID / GUESTY_CLIENT_SECRET in Lovable Cloud secrets.",
    };
  if (stepId === "stripe" && (t.includes("publishablekey") || t.includes("publishable")))
    return {
      message: "Stripe publishable key isn't being served.",
      hint: "Set GUESTY_STRIPE_PUBLISHABLE_KEY in Lovable Cloud secrets.",
    };
  if (t.includes("listing") && t.includes("not found"))
    return {
      message: "This listing isn't available in Guesty.",
      hint: "Confirm the property's guesty_listing_id is correct and active.",
    };
  if (t.includes("unavailable") || t.includes("not available"))
    return {
      message: "Selected dates aren't available for this property.",
      hint: "Try a different date range.",
    };
  if (t.includes("quote") && t.includes("expired"))
    return {
      message: "The quote has expired.",
      hint: "Re-run the quote step to get a fresh one.",
    };
  if (t.includes("payment") && (t.includes("declined") || t.includes("failed")))
    return {
      message: "Stripe declined the payment method.",
      hint: "Use a valid test card or check the customer's card details.",
    };
  if (t.includes("instant book") || t.includes("rate plan"))
    return {
      message: "Instant Book isn't enabled for this listing's rate plan.",
      hint: "Enable Instant Book on the listing in Guesty before charging.",
    };
  if (t.includes("network") || t.includes("fetch failed"))
    return {
      message: "Network error reaching the edge function.",
      hint: "Check the function's deployment status and try again.",
    };
  if (t.includes("unauthorized") || t.includes("401"))
    return { message: "Authorization failed.", hint: "Re-authenticate or rotate the relevant key." };

  return { message: text.length > 220 ? text.slice(0, 220) + "…" : text };
}

const StatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === "running") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "error") return <XCircle className="h-4 w-4 text-destructive" />;
  if (status === "skipped") return <Clock className="h-4 w-4 text-muted-foreground" />;
  return <Clock className="h-4 w-4 text-muted-foreground/40" />;
};

// ---------- Page ----------

const TestHarness = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyId, setPropertyId] = useState<string>("");
  const [checkIn, setCheckIn] = useState(format(addDays(new Date(), 14), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 17), "yyyy-MM-dd"));
  const [guests, setGuests] = useState(2);
  const [allowReservation, setAllowReservation] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, StepResult>>({});

  const property = useMemo(
    () => properties.find((p) => p.id === propertyId),
    [properties, propertyId],
  );

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("properties")
        .select("id, name, location, guesty_listing_id, price_per_night")
        .not("guesty_listing_id", "is", null)
        .order("name", { ascending: true })
        .limit(50);
      setProperties(data || []);
      if (data && data.length && !propertyId) setPropertyId(data[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStep = (id: string, patch: Partial<StepResult>) =>
    setResults((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } as StepResult }));

  const runStep = async <T,>(
    id: string,
    fn: () => Promise<T>,
  ): Promise<T | undefined> => {
    setStep(id, { status: "running" });
    const t0 = performance.now();
    try {
      const data = await fn();
      setStep(id, {
        status: "success",
        durationMs: Math.round(performance.now() - t0),
        data,
      });
      return data;
    } catch (err: any) {
      const { message, hint } = humanize(id, err?.message || err);
      setStep(id, {
        status: "error",
        durationMs: Math.round(performance.now() - t0),
        message,
        hint,
        error: err?.message || String(err),
      });
      return undefined;
    }
  };

  const skipStep = (id: string, reason: string) =>
    setStep(id, { status: "skipped", message: reason });

  const runAll = async () => {
    if (!property) {
      toast({
        variant: "destructive",
        title: "Pick a property",
        description: "Select a Guesty-linked property to run the harness.",
      });
      return;
    }

    setRunning(true);
    setResults({});

    // 1. Auth
    await runStep("auth", async () => {
      const { data, error } = await supabase.functions.invoke("guesty-booking-auth");
      if (error) throw new Error(error.message);
      if (!data?.access_token) throw new Error("No access_token returned");
      return { tokenPreview: String(data.access_token).slice(0, 12) + "…" };
    });

    // 2. Calendar
    const calendar = await runStep("calendar", async () => {
      const { data, error } = await supabase.functions.invoke("guesty-get-calendar", {
        body: {
          listingId: property.guesty_listing_id,
          startDate: checkIn,
          endDate: checkOut,
        },
      });
      if (error) throw new Error(error.message);
      const days = data?.days || data?.calendar || [];
      const unavailable = days.filter((d: any) => d?.status && d.status !== "available");
      if (unavailable.length)
        throw new Error(`Unavailable on ${unavailable.length} day(s) in the chosen window`);
      return { days: days.length };
    });

    // 3. Quote (only if calendar ok)
    let quoteId: string | undefined;
    if (calendar) {
      const quote = await runStep("quote", async () => {
        const { data, error } = await supabase.functions.invoke("guesty-get-quote", {
          body: {
            listingId: property.guesty_listing_id,
            checkIn,
            checkOut,
            guests: { adults: guests },
          },
        });
        if (error) throw new Error(error.message);
        const q = data?.quote;
        if (!q) throw new Error("No quote returned by Guesty");
        return {
          quoteId: q.quoteId || q._id,
          total: q.ratePlans?.[0]?.totalPrice || q.totalPrice,
          currency: q.currency || "EUR",
        };
      });
      quoteId = (quote as any)?.quoteId;
    } else {
      skipStep("quote", "Skipped because availability check failed.");
    }

    // 4. Stripe config
    await runStep("stripe", async () => {
      const { data, error } = await supabase.functions.invoke("guesty-stripe-config");
      if (error) throw new Error(error.message);
      if (!data?.publishableKey) throw new Error("publishableKey missing from response");
      const isLive = String(data.publishableKey).startsWith("pk_live_");
      return { mode: isLive ? "live" : "test", keyPreview: String(data.publishableKey).slice(0, 12) + "…" };
    });

    // 5. Webhook simulation
    await runStep("webhook", async () => {
      const fakeId = `harness-${Date.now()}`;
      const { data, error } = await supabase.functions.invoke("guesty-webhook", {
        body: {
          event: "reservation.payment.succeeded",
          reservation: {
            _id: fakeId,
            status: "confirmed",
            money: { balanceDue: 0 },
          },
        },
      });
      if (error) throw new Error(error.message);
      return { ...data, note: "Logged in guesty_webhook_events; matched 0 (expected for fake id)." };
    });

    // 6. Reservation (opt-in only)
    if (allowReservation && quoteId) {
      await runStep("reservation", async () => {
        const { data, error } = await supabase.functions.invoke("guesty-create-reservation", {
          body: {
            quoteId,
            guest: {
              firstName: "Harness",
              lastName: "Test",
              email: `harness+${Date.now()}@frontierresidences.com`,
              phone: "+34000000000",
            },
            policy: { terms: true, cancellation: true },
            type: "inquiry",
          },
        });
        if (error) throw new Error(error.message);
        const r = data?.reservation || {};
        return {
          reservationId: r._id || r.id,
          status: r.status,
          note: "Inquiry only — no card charged.",
        };
      });
    } else {
      skipStep(
        "reservation",
        allowReservation ? "Skipped because no quote was generated." : "Disabled — toggle on to run.",
      );
    }

    setRunning(false);

    const failures = Object.values(results).filter((r) => r.status === "error").length;
    toast({
      title: failures ? "Run finished with issues" : "Run completed",
      description: failures
        ? `${failures} step(s) failed. Expand them for details.`
        : "All checks passed.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Beaker className="h-6 w-6 text-primary" />
            <h1 className="font-playfair text-3xl font-bold text-primary">
              Booking Test Harness
            </h1>
          </div>
          <p className="text-muted-foreground">
            Runs every stage of the booking pipeline against the live Guesty &amp; Stripe stack
            without charging a card. Only the final reservation step is opt-in and it creates an
            inquiry, not a charge.
          </p>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Test parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Property</Label>
                <Select value={propertyId} onValueChange={setPropertyId} disabled={running}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Guests</Label>
                <Input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value || "1"))}
                  disabled={running}
                />
              </div>
              <div className="space-y-1">
                <Label>Check in</Label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  disabled={running}
                />
              </div>
              <div className="space-y-1">
                <Label>Check out</Label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={running}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-start justify-between gap-4 rounded-md border p-3 bg-muted/30">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Create a real Guesty inquiry reservation</p>
                  <p className="text-muted-foreground">
                    Off by default. When on, the harness creates an inquiry-type reservation
                    (no card charged) so you can verify end-to-end including the webhook path.
                    Cancel it in Guesty afterwards.
                  </p>
                </div>
              </div>
              <Switch
                checked={allowReservation}
                onCheckedChange={setAllowReservation}
                disabled={running}
              />
            </div>

            <Button onClick={runAll} disabled={running || !propertyId} size="lg" className="w-full">
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running…
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" /> Run harness
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STEPS.map((step) => {
              const r = results[step.id] || { status: "pending" as StepStatus };
              return (
                <Collapsible key={step.id}>
                  <div className="border rounded-md">
                    <CollapsibleTrigger className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors">
                      <StatusIcon status={r.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{step.name}</span>
                          {step.destructive && (
                            <Badge variant="outline" className="text-amber-700 border-amber-300">
                              opt-in
                            </Badge>
                          )}
                          {r.durationMs != null && (
                            <span className="text-xs text-muted-foreground">
                              {r.durationMs} ms
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.status === "error"
                            ? r.message
                            : r.status === "skipped"
                            ? r.message
                            : step.description}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-0 space-y-2 text-sm">
                        {r.status === "error" && (
                          <>
                            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3">
                              <p className="font-medium text-destructive">{r.message}</p>
                              {r.hint && (
                                <p className="text-xs text-destructive/80 mt-1">
                                  Suggested fix: {r.hint}
                                </p>
                              )}
                            </div>
                            {r.error && (
                              <details className="text-xs text-muted-foreground">
                                <summary className="cursor-pointer">Raw error</summary>
                                <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto whitespace-pre-wrap">
                                  {r.error}
                                </pre>
                              </details>
                            )}
                          </>
                        )}
                        {r.status === "success" && r.data && (
                          <pre className="text-xs p-2 bg-muted rounded overflow-x-auto">
                            {JSON.stringify(r.data, null, 2)}
                          </pre>
                        )}
                        {r.status === "pending" && (
                          <p className="text-xs text-muted-foreground">Not run yet.</p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TestHarness;