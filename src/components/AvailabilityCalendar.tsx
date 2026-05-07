import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange, DayContentProps } from "react-day-picker";
import { ChevronLeft, ChevronRight, Loader2, Info } from "lucide-react";
import { addDays, addMonths, differenceInCalendarDays, format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarDay {
  date: string;
  status: string;
  minNights?: number;
  maxNights?: number;
  cta?: boolean;
  ctd?: boolean;
  price?: number;
  currency?: string;
  blocks?: Record<string, boolean>;
}

interface AvailabilityCalendarProps {
  listingId?: string | null;
  range: DateRange | undefined;
  onRangeChange: (r: DateRange | undefined) => void;
  numberOfMonths?: number;
}

const AvailabilityCalendar = ({
  listingId,
  range,
  onRangeChange,
  numberOfMonths,
}: AvailabilityCalendarProps) => {
  const isMobile = useIsMobile();
  const months = numberOfMonths ?? (isMobile ? 1 : 2);
  const [days, setDays] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!listingId) return;
    const fetchCal = async () => {
      setLoading(true);
      setError(null);
      const from = format(month, "yyyy-MM-dd");
      const to = format(addMonths(month, months + 1), "yyyy-MM-dd");
      try {
        const { data, error } = await supabase.functions.invoke("guesty-get-calendar", {
          body: { listingId, checkIn: from, checkOut: to },
        });
        if (error) throw new Error(error.message);
        const map: Record<string, CalendarDay> = {};
        (data?.calendar || []).forEach((d: CalendarDay) => {
          map[d.date] = d;
        });
        setDays(map);
      } catch (e: any) {
        setError(e.message || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    };
    fetchCal();
    }, [listingId, month, months]);

  const minNights = useMemo(() => {
    const vals = Object.values(days)
      .map((d) => d.minNights)
      .filter((n): n is number => typeof n === "number" && n > 0);
    return vals.length ? Math.min(...vals) : 1;
  }, [days]);

  const isBooked = (d: Date) => {
    const key = format(d, "yyyy-MM-dd");
    const day = days[key];
    if (!day) return false;
    if (day.status && day.status !== "available") return true;
    const b = day.blocks || {};
    return Boolean(b.b || b.r || b.o || b.m || b.bd);
  };

  const bookedDates = useMemo(
    () =>
      Object.values(days)
        .filter((d) => {
          if (d.status && d.status !== "available") return true;
          const b = d.blocks || {};
          return Boolean(b.b || b.r || b.o || b.m || b.bd);
        })
        .map((d) => new Date(d.date + "T00:00:00")),
    [days]
  );

  const disabled = [
    { before: new Date() },
    (date: Date) => isBooked(date),
  ];

  const handleSelect = (r: DateRange | undefined) => {
    if (!r?.from) {
      onRangeChange(r);
      return;
    }
    // If range spans a booked night, restart selection from the newly clicked date
    if (r.from && r.to) {
      let spansBooked = false;
      let cursor = r.from;
      while (cursor < r.to) {
        if (isBooked(cursor)) {
          spansBooked = true;
          break;
        }
        cursor = addDays(cursor, 1);
      }
      if (spansBooked) {
        // Determine which end was the newly clicked date and reset from there
        const prevFrom = range?.from?.getTime();
        const prevTo = range?.to?.getTime();
        const fromChanged = !prevFrom || r.from.getTime() !== prevFrom;
        const newAnchor = fromChanged ? r.from : r.to;
        setError("That range crosses booked nights — starting a new selection.");
        onRangeChange({ from: newAnchor, to: undefined });
        return;
      }
    }
    setError(null);
    onRangeChange(r);
  };

  const currency = useMemo(() => {
    const first = Object.values(days).find((d) => d.currency);
    return first?.currency || "EUR";
  }, [days]);

  const fmtPrice = (n: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${Math.round(n)}`;
    }
  };

  const DayContent = (props: DayContentProps) => {
    const key = format(props.date, "yyyy-MM-dd");
    const day = days[key];
    const price = day?.price;
    const booked = isBooked(props.date);
    return (
      <div className="flex flex-col items-center justify-center leading-none gap-1 w-full h-full py-1">
        <span className="text-sm sm:text-base font-semibold">{props.date.getDate()}</span>
        {typeof price === "number" && (
          <span
            className={cn(
              "text-[10px] sm:text-xs tabular-nums font-medium",
              booked ? "opacity-40 line-through" : "opacity-80"
            )}
          >
            {fmtPrice(price)}
          </span>
        )}
      </div>
    );
  };

  const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const meetsMin = nights === 0 || nights >= minNights;

  const total = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    let sum = 0;
    let cursor = range.from;
    while (cursor < range.to) {
      const key = format(cursor, "yyyy-MM-dd");
      const p = days[key]?.price;
      if (typeof p === "number") sum += p;
      cursor = addDays(cursor, 1);
    }
    return sum;
  }, [range, days]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/90" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-muted border" /> Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/40 line-through" />{" "}
          Booked
        </span>
        {minNights > 1 && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
            <Info className="w-3.5 h-3.5" /> Minimum stay: {minNights} nights
          </span>
        )}
      </div>

      <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm p-2 sm:p-4">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-xl">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={months}
          disabled={disabled}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{
            booked:
              "line-through text-destructive/70 bg-destructive/10 hover:bg-destructive/10 cursor-not-allowed",
          }}
          className={cn("p-2 pointer-events-auto")}
          classNames={{
            months: "flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center",
            month: "space-y-3 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-base font-semibold tracking-wide",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse table-fixed",
            head_row: "flex w-full",
            head_cell:
              "text-muted-foreground rounded-md flex-1 font-medium text-[10px] sm:text-xs uppercase",
            row: "flex w-full mt-1",
            cell: "flex-1 h-16 sm:h-20 text-center text-sm p-0.5 relative [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-full w-full p-0 font-normal rounded-md aria-selected:opacity-100 transition-colors hover:bg-accent hover:text-accent-foreground inline-flex items-stretch justify-stretch overflow-hidden",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary",
            day_today: "ring-1 ring-primary/40",
            day_outside: "text-muted-foreground/40",
            day_disabled: "text-muted-foreground/40 line-through",
            day_range_middle: "bg-primary/15 text-foreground rounded-none",
            day_range_start: "rounded-l-md",
            day_range_end: "rounded-r-md",
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
            DayContent,
          }}
        />
      </div>

      {range?.from && range?.to && (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm flex flex-wrap items-center justify-between gap-2",
            meetsMin
              ? "bg-primary/5 border-primary/20"
              : "bg-destructive/5 border-destructive/30 text-destructive"
          )}
        >
          <span>
            {format(range.from, "MMM d")} → {format(range.to, "MMM d, yyyy")} · {nights} night
            {nights !== 1 ? "s" : ""}
          </span>
          {meetsMin ? (
            total > 0 && (
              <span className="font-semibold">
                Total: {fmtPrice(total)}{" "}
                <span className="opacity-60 font-normal">
                  ({fmtPrice(Math.round(total / nights))}/night avg)
                </span>
              </span>
            )
          ) : (
            <span className="font-medium">Min {minNights} nights required</span>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;