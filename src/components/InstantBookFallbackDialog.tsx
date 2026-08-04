import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Phone, Send } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName?: string;
  rawError?: string;
  onSwitchToInquiry: () => void;
  submitting?: boolean;
}

const SUPPORT_EMAIL = "Hello@frontier-residences.com";
const SUPPORT_PHONE = "+34 665 51 18 53";

const InstantBookFallbackDialog = ({
  open,
  onOpenChange,
  propertyName,
  rawError,
  onSwitchToInquiry,
  submitting,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-accent/15 p-2 shrink-0">
              <AlertTriangle className="h-5 w-5 text-accent-strong" />
            </div>
            <div>
              <DialogTitle className="font-playfair">
                Instant Booking unavailable
              </DialogTitle>
              <DialogDescription className="mt-2">
                {propertyName ? `“${propertyName}” ` : "This property "}
                isn't enabled for instant booking right now, so your card hasn't been charged.
                You can send a booking request instead — our team will confirm within a few hours
                and arrange payment.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              `Booking help — ${propertyName ?? "property"}`,
            )}`}
            className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted transition-colors"
          >
            <Mail className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="font-medium">{SUPPORT_EMAIL}</p>
              <p className="text-xs text-muted-foreground">
                Email our concierge team
              </p>
            </div>
          </a>
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`}
            className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted transition-colors"
          >
            <Phone className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="font-medium">{SUPPORT_PHONE}</p>
              <p className="text-xs text-muted-foreground">
                Speak to us directly
              </p>
            </div>
          </a>
        </div>

        {rawError && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto whitespace-pre-wrap">
              {rawError}
            </pre>
          </details>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSwitchToInquiry}
            disabled={submitting}
            className="w-full sm:flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Sending request…" : "Send booking request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Detects whether an error from Guesty / our edge function indicates that
 * Instant Book is disabled or the rate plan doesn't allow charging the card.
 */
export function isInstantBookDisabledError(message: unknown): boolean {
  const t = String(
    typeof message === "string" ? message : (message as any)?.message ?? message ?? "",
  ).toLowerCase();
  if (!t) return false;
  return (
    t.includes("instant book") ||
    t.includes("instantbook") ||
    t.includes("instant_book") ||
    (t.includes("rate plan") && (t.includes("not allowed") || t.includes("disabled") || t.includes("inquiry"))) ||
    (t.includes("reservation") && t.includes("must be inquiry")) ||
    (t.includes("payment") && t.includes("not supported")) ||
    t.includes("instant booking is not enabled") ||
    t.includes("listing is not bookable") ||
    t.includes("cannot create confirmed reservation")
  );
}

export default InstantBookFallbackDialog;