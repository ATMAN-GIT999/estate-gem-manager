import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Mail, Calendar, Users, Home, Hash, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationState {
  reservationId?: string;
  confirmationCode?: string;
  status?: string;
  paymentStatus?: string;
  total?: number;
  currency?: string;
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestName?: string;
  guestEmail?: string;
  type?: "instant" | "inquiry";
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = (location.state || {}) as ConfirmationState;

  useEffect(() => {
    if (!state || !state.guestEmail) {
      // No state — likely a direct visit. Send back home.
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.guestEmail) return null;

  const isInstant = state.type !== "inquiry";
  const paymentLabel = isInstant
    ? state.paymentStatus || "Paid"
    : state.paymentStatus || "Awaiting confirmation";

  const copy = (val?: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    toast({ title: "Copied", description: val });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
            <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
              {isInstant ? "Booking Confirmed" : "Request Received"}
            </h1>
            <p className="text-muted-foreground">
              {isInstant
                ? "Your reservation is secured. A confirmation email is on its way."
                : "We've received your request and will be in touch shortly."}
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-playfair text-2xl">Reservation Details</CardTitle>
                <Badge variant={isInstant ? "default" : "secondary"}>
                  {state.status || (isInstant ? "Confirmed" : "Pending")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* IDs */}
              <div className="grid sm:grid-cols-2 gap-4">
                {state.reservationId && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Reservation ID
                    </p>
                    <button
                      onClick={() => copy(state.reservationId)}
                      className="font-mono text-sm font-semibold flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {state.reservationId}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {state.confirmationCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Confirmation Code</p>
                    <button
                      onClick={() => copy(state.confirmationCode)}
                      className="font-mono text-sm font-semibold flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {state.confirmationCode}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Property */}
              {state.propertyName && (
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Property</p>
                    <p className="font-semibold">{state.propertyName}</p>
                  </div>
                </div>
              )}

              {/* Stay */}
              <div className="grid sm:grid-cols-3 gap-4">
                {state.checkIn && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check In</p>
                      <p className="font-semibold">{format(new Date(state.checkIn), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
                {state.checkOut && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check Out</p>
                      <p className="font-semibold">{format(new Date(state.checkOut), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
                {state.guests != null && (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="font-semibold">{state.guests}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Payment */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <p className="font-semibold">{paymentLabel}</p>
                  </div>
                </div>
                {state.total != null && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      {state.currency === "USD" ? "$" : "€"}
                      {state.total.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Guest */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Confirmation sent to</p>
                  <p className="font-semibold">{state.guestName}</p>
                  <p className="text-sm text-muted-foreground">{state.guestEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button asChild variant="outline">
              <Link to="/properties">Browse more properties</Link>
            </Button>
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;