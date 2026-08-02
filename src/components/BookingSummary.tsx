import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Tag, ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { z } from "zod";
import { loadStripe, Stripe, StripeCardElement } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import InstantBookFallbackDialog, {
  isInstantBookDisabledError,
} from "@/components/InstantBookFallbackDialog";

const StripeCardCapture = ({
  onReady,
}: {
  onReady: (stripe: Stripe, element: StripeCardElement) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="border border-input rounded-md p-3 bg-background">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '14px',
              color: '#1a1a1a',
              '::placeholder': { color: '#9ca3af' },
            },
            invalid: { color: '#dc2626' },
          },
        }}
        onReady={() => {
          if (stripe && elements) {
            const el = elements.getElement(CardElement);
            if (el) onReady(stripe, el);
          }
        }}
      />
    </div>
  );
};

interface BookingSummaryProps {
  property: any;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface QuoteData {
  quoteId: string;
  subtotal: number;
  fees: number;
  total: number;
  currency: string;
  ratePlanId?: string;
  cancellationPolicy?: string;
  discount?: number;
  appliedCoupon?: string;
}

const BookingSummary = ({
  property,
  checkIn,
  checkOut,
  guests,
  onClose,
  onSuccess,
}: BookingSummaryProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [instantBookFallback, setInstantBookFallback] = useState<{
    open: boolean;
    rawError?: string;
  }>({ open: false });

  const nights = differenceInDays(new Date(checkOut), new Date(checkIn));

  useEffect(() => {
    fetchQuote();
    // Load Stripe publishable key from edge function
    supabase.functions.invoke('guesty-stripe-config').then(({ data, error }) => {
      if (error || !data?.publishableKey) {
        console.error('Failed to load Stripe config:', error);
        return;
      }
      setStripePromise(loadStripe(data.publishableKey));
    });
  }, []);

  const fetchQuote = async (coupon?: string) => {
    setLoading(true);
    let resultQuote: QuoteData | null = null;
    try {
      if (property.guesty_listing_id) {
        const response = await supabase.functions.invoke('guesty-get-quote', {
          body: {
            listingId: property.guesty_listing_id,
            checkIn,
            checkOut,
            guests: { adults: guests },
            couponCode: coupon || undefined,
          },
        });

        if (response.error) {
          // Try to extract structured error body (e.g. DATES_NOT_AVAILABLE)
          let body: any = null;
          try {
            const ctx: any = (response.error as any).context;
            if (ctx && typeof ctx.json === 'function') {
              body = await ctx.clone().json();
            } else if (ctx && typeof ctx.text === 'function') {
              body = JSON.parse(await ctx.clone().text());
            } else if (ctx?.error) {
              body = ctx;
            }
          } catch { /* ignore */ }
          const err: any = new Error(body?.error || response.error.message);
          err.code = body?.code;
          err.minNights = body?.details?.minNights;
          throw err;
        }

        const quoteData = response.data?.quote;
        console.log('Quote data:', quoteData);

        if (quoteData) {
          // Parse Guesty Booking Engine quote response
          const ratePlanWrap = quoteData.rates?.ratePlans?.[0] || quoteData.ratePlans?.[0] || {};
          const ratePlan = ratePlanWrap.ratePlan || ratePlanWrap;
          const money = ratePlan.money || ratePlanWrap.money || {};
          const items: any[] = money.invoiceItems || [];
          const accommodation = money.fareAccommodation || 0;
          const fees = money.totalFees || items
            .filter((i) => /FEE|TAX/i.test(i.type || i.normalType || ''))
            .reduce((s, i) => s + (i.amount || 0), 0);
          const discount = Math.abs(
            items
              .filter((i) => /DISCOUNT|^CO$/i.test(i.type || i.normalType || ''))
              .reduce((s, i) => s + (i.amount || 0), 0) ||
              (quoteData.coupons || []).reduce(
                (s: number, c: any) => s + (c.adjustment || 0),
                0,
              ),
          );
          const subtotal = accommodation || (property.price_per_night * nights);
          const total = money.subTotalPrice ?? Math.max(0, subtotal + fees - discount);
          const appliedCouponName =
            quoteData.coupons?.[0]?.couponCode || quoteData.coupons?.[0]?.code || coupon;

          resultQuote = {
            quoteId: quoteData._id || quoteData.quoteId,
            subtotal,
            fees,
            total,
            currency: money.currency || quoteData.currency || 'EUR',
            ratePlanId: ratePlan._id || ratePlan.ratePlanId,
            cancellationPolicy: ratePlan.cancellationPolicy || 'Non-refundable',
            discount,
            appliedCoupon: discount > 0 ? appliedCouponName : undefined,
          };
          setQuote(resultQuote);
        } else {
          // Fallback calculation
          resultQuote = {
            quoteId: '',
            subtotal: property.price_per_night * nights,
            fees: Math.round(property.price_per_night * nights * 0.1),
            total: Math.round(property.price_per_night * nights * 1.1),
            currency: 'EUR',
            cancellationPolicy: 'Non-refundable',
          };
          setQuote(resultQuote);
        }
      } else {
        // No Guesty - use local calculation
        const subtotal = property.price_per_night * nights;
        const fees = Math.round(subtotal * 0.1);
        resultQuote = {
          quoteId: '',
          subtotal,
          fees,
          total: subtotal + fees,
          currency: 'EUR',
          cancellationPolicy: 'Non-refundable',
        };
        setQuote(resultQuote);
      }
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      const isDatesError = error?.code === 'DATES_NOT_AVAILABLE';
      if (isDatesError) {
        toast({
          variant: "destructive",
          title: "Dates unavailable",
          description: error.message,
        });
        setAppliedCoupon(null);
        setLoading(false);
        return null;
      }
      if (coupon) {
        toast({
          variant: "destructive",
          title: "Coupon failed",
          description: error.message || "Could not apply coupon",
        });
        setAppliedCoupon(null);
      }
      // Fallback to local calculation
      const subtotal = property.price_per_night * nights;
      const fees = Math.round(subtotal * 0.1);
      resultQuote = {
        quoteId: '',
        subtotal,
        fees,
        total: subtotal + fees,
        currency: 'EUR',
        cancellationPolicy: 'Non-refundable',
      };
      setQuote(resultQuote);
    } finally {
      setLoading(false);
    }
    return resultQuote;
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      toast({
        variant: "destructive",
        title: "Enter a code",
        description: "Please enter a coupon code first.",
      });
      return;
    }
    if (!property.guesty_listing_id) {
      toast({
        variant: "destructive",
        title: "Coupons unavailable",
        description:
          "This property is not yet connected to our live booking system, so coupon codes can't be validated. Please contact support to complete the booking with a discount.",
      });
      return;
    }
    setApplyingCoupon(true);
    try {
      const result = await fetchQuote(code);
      if (result?.discount && result.discount > 0) {
        setAppliedCoupon(result.appliedCoupon || code);
        toast({
          title: "Coupon applied",
          description: `Code "${code}" applied — you saved €${result.discount.toFixed(2)}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Coupon not valid",
          description:
            "Guesty did not apply a discount for this code. Check the code, dates, or property eligibility.",
        });
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponCode("");
    setAppliedCoupon(null);
    await fetchQuote();
  };

  const handleCheckout = async () => {
    const guestSchema = z.object({
      firstName: z.string().trim().min(1, "First name required").max(100),
      lastName: z.string().trim().min(1, "Last name required").max(100),
      email: z.string().trim().email("Valid email required").max(255),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9\s\-()]{6,20}$/, "Valid phone required")
        .optional()
        .or(z.literal("")),
    });
    const parsed = guestSchema.safeParse(guestInfo);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: "Check your details",
        description: parsed.error.issues[0]?.message || "Please review the form.",
      });
      return;
    }

    // Date sanity checks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci < today || co <= ci) {
      toast({
        variant: "destructive",
        title: "Invalid dates",
        description: "Please choose valid check-in and check-out dates.",
      });
      return;
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 50) {
      toast({
        variant: "destructive",
        title: "Invalid guest count",
        description: "Guest count must be between 1 and 50.",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "Please accept the terms and conditions",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (property.guesty_listing_id && quote?.quoteId) {
        // Instant booking requires a rate plan from the quote — otherwise fall back to inquiry
        if (!quote.ratePlanId) {
          toast({
            variant: "destructive",
            title: "Instant booking unavailable",
            description:
              "This property has no bookable rate plan for these dates. We'll send a booking request instead.",
          });
          setSubmitting(false);
          setInstantBookFallback({
            open: true,
            rawError: "Missing ratePlanId on quote — instant booking not possible.",
          });
          return;
        }

        // Create an SCA-compatible Stripe PaymentMethod (pm_...) for instant booking
        if (!stripeInstance || !cardElement) {
          throw new Error('Payment form not ready. Please enter card details.');
        }
        const { paymentMethod, error: stripeError } = await stripeInstance.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            email: guestInfo.email,
            phone: guestInfo.phone,
          },
        });
        if (stripeError || !paymentMethod?.id) {
          throw new Error(stripeError?.message || 'Card could not be processed. Please check your card details.');
        }
        const ccToken = paymentMethod.id;

        // Create reservation via Guesty API
        const response = await supabase.functions.invoke('guesty-create-reservation', {
          body: {
            quoteId: quote.quoteId,
            ratePlanId: quote.ratePlanId,
            ccToken,
            guest: {
              firstName: guestInfo.firstName,
              lastName: guestInfo.lastName,
              email: guestInfo.email,
              phone: guestInfo.phone,
            },
            policy: {
              terms: true,
              cancellation: true,
            },
            bookingType: 'instant',
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }
        // Some Guesty deployments return 200 with an inline error payload
        if (response.data?.error && isInstantBookDisabledError(response.data.error)) {
          throw new Error(response.data.error);
        }

        // Also save to local database
        const reservationData = response.data?.reservation || {};
        const guestyReservationId =
          reservationData._id || reservationData.id || reservationData.reservationId || null;

        await supabase.from("bookings").insert({
          property_id: property.id,
          user_id: user?.id || null,
          guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: quote.total,
          status: "confirmed",
          payment_status: "paid",
          guesty_reservation_id: guestyReservationId,
        });

        toast({
          title: "Booking confirmed!",
          description: "Your reservation has been created. Check your email for details.",
        });

        const reservation = response.data?.reservation || {};
        navigate("/booking-confirmation", {
          state: {
            reservationId: reservation._id || reservation.id || reservation.reservationId,
            confirmationCode: reservation.confirmationCode || reservation.code,
            status: reservation.status || "Confirmed",
            paymentStatus: reservation.paymentStatus || reservation.money?.balanceDue === 0 ? "Paid" : "Paid",
            total: quote.total,
            currency: quote.currency,
            propertyName: property.name,
            checkIn,
            checkOut,
            guests,
            guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
            guestEmail: guestInfo.email,
            type: "instant",
          },
        });
      } else {
        // Save to local database only
        await supabase.from("bookings").insert({
          property_id: property.id,
          user_id: user?.id || null,
          guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: quote?.total || property.price_per_night * nights,
          status: "pending",
        });

        toast({
          title: "Booking request sent!",
          description: "We'll contact you shortly to confirm your booking.",
        });

        navigate("/booking-confirmation", {
          state: {
            status: "Pending",
            paymentStatus: "Awaiting confirmation",
            total: quote?.total || property.price_per_night * nights,
            currency: quote?.currency || "EUR",
            propertyName: property.name,
            checkIn,
            checkOut,
            guests,
            guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
            guestEmail: guestInfo.email,
            type: "inquiry",
          },
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Checkout error:', error);
      if (isInstantBookDisabledError(error?.message)) {
        setInstantBookFallback({ open: true, rawError: error?.message });
        setSubmitting(false);
        return;
      }
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Could not complete booking",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Switch the booking to a non-charging inquiry and submit it
  const handleSwitchToInquiry = async () => {
    setSubmitting(true);
    try {
      if (property.guesty_listing_id && quote?.quoteId) {
        const response = await supabase.functions.invoke('guesty-create-reservation', {
          body: {
            quoteId: quote.quoteId,
            ratePlanId: quote.ratePlanId,
            guest: {
              firstName: guestInfo.firstName,
              lastName: guestInfo.lastName,
              email: guestInfo.email,
              phone: guestInfo.phone,
            },
            policy: { terms: true, cancellation: true },
            bookingType: 'inquiry',
          },
        });
        if (response.error) throw new Error(response.error.message);

        const reservationData = response.data?.reservation || {};
        const guestyReservationId =
          reservationData._id || reservationData.id || reservationData.reservationId || null;

        await supabase.from("bookings").insert({
          property_id: property.id,
          user_id: user?.id || null,
          guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: quote.total,
          status: "pending",
          payment_status: "awaiting_confirmation",
          guesty_reservation_id: guestyReservationId,
        });
      } else {
        await supabase.from("bookings").insert({
          property_id: property.id,
          user_id: user?.id || null,
          guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: quote?.total || property.price_per_night * nights,
          status: "pending",
        });
      }

      toast({
        title: "Booking request sent",
        description: "Our team will confirm your reservation shortly.",
      });
      setInstantBookFallback({ open: false });
      navigate("/booking-confirmation", {
        state: {
          status: "Pending",
          paymentStatus: "Awaiting confirmation",
          total: quote?.total || property.price_per_night * nights,
          currency: quote?.currency || "EUR",
          propertyName: property.name,
          checkIn,
          checkOut,
          guests,
          guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
          guestEmail: guestInfo.email,
          type: "inquiry",
        },
      });
      onSuccess();
    } catch (err: any) {
      console.error("Inquiry fallback error:", err);
      toast({
        variant: "destructive",
        title: "Could not send request",
        description: err?.message || "Please contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading quote...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="w-full max-w-md mx-auto border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="pb-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-primary">{property.name}</h2>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Check In</p>
            <p className="font-semibold">{format(new Date(checkIn), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Check Out</p>
            <p className="font-semibold">{format(new Date(checkOut), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nights</p>
            <p className="font-semibold">{nights} Nights</p>
          </div>
          <div>
            <p className="text-muted-foreground">Guests</p>
            <p className="font-semibold">{guests}</p>
          </div>
        </div>

        <Separator />

        {/* Cancellation Policy */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-muted">
            {quote?.cancellationPolicy || 'Non-refundable'}
          </Badge>
        </div>

        {/* Coupon Section */}
        <div>
          <button
            type="button"
            onClick={() => setShowCoupon(!showCoupon)}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Tag className="w-4 h-4" />
            I have a coupon
            {showCoupon ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showCoupon && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
                disabled={!!appliedCoupon || applyingCoupon}
              />
              {appliedCoupon ? (
                <Button variant="outline" size="sm" onClick={handleRemoveCoupon}>
                  Remove
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                >
                  {applyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              )}
            </div>
          )}
          {appliedCoupon && (
            <p className="mt-2 text-xs text-primary">
              Coupon “{appliedCoupon}” applied
            </p>
          )}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>€{quote?.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fees</span>
            <span>€{quote?.fees?.toFixed(2)}</span>
          </div>
          {quote?.discount && quote.discount > 0 ? (
            <div className="flex justify-between text-sm text-primary">
              <span>Discount{appliedCoupon ? ` (${appliedCoupon})` : ""}</span>
              <span>-€{quote.discount.toFixed(2)}</span>
            </div>
          ) : null}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">€{quote?.total?.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Guest Information */}
        <div className="space-y-3">
          <h3 className="font-semibold">Guest Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs">First Name *</Label>
              <Input
                id="firstName"
                value={guestInfo.firstName}
                onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
              <Input
                id="lastName"
                value={guestInfo.lastName}
                onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs">Email *</Label>
            <Input
              id="email"
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
            I accept the terms and conditions and cancellation policy
          </label>
        </div>

        {/* Payment - Stripe Card */}
        {property.guesty_listing_id && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment
            </h3>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <StripeCardCapture
                  onReady={(stripe, element) => {
                    setStripeInstance(stripe);
                    setCardElement(element);
                    setCardReady(true);
                  }}
                />
              </Elements>
            ) : (
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading secure payment form...
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Your card is processed securely by Stripe via Guesty. We never store card details.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={submitting || (!!property.guesty_listing_id && !cardReady)}
            className="flex-1"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Booking"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    <InstantBookFallbackDialog
      open={instantBookFallback.open}
      onOpenChange={(open) => setInstantBookFallback({ open, rawError: instantBookFallback.rawError })}
      propertyName={property.name}
      rawError={instantBookFallback.rawError}
      submitting={submitting}
      onSwitchToInquiry={handleSwitchToInquiry}
    />
    </>
  );
};

export default BookingSummary;
