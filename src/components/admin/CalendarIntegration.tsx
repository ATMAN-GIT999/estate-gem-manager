import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Check,
  ExternalLink,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CalendarConnection {
  id: string;
  provider: string;
  is_connected: boolean;
  last_sync_at: string | null;
  calendar_id: string | null;
}

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
  category: string;
}

interface Booking {
  id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  property_id: string;
}

interface Property {
  id: string;
  name: string;
}

export default function CalendarIntegration() {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const [connRes, taskRes, bookRes, propRes] = await Promise.all([
      supabase.from("calendar_connections").select("*"),
      supabase.from("tasks").select("id, title, due_date, status, category").not("due_date", "is", null),
      supabase.from("bookings").select("id, guest_name, check_in, check_out, property_id"),
      supabase.from("properties").select("id, name"),
    ]);

    if (connRes.data) setConnections(connRes.data as CalendarConnection[]);
    if (taskRes.data) setTasks(taskRes.data as Task[]);
    if (bookRes.data) setBookings(bookRes.data as Booking[]);
    if (propRes.data) setProperties(propRes.data as Property[]);
    
    setLoading(false);
  };

  const handleConnectGoogle = () => {
    // In production, this would redirect to Google OAuth
    toast({
      title: "Google Calendar",
      description: "OAuth integration requires API credentials. Contact support to set up.",
    });
  };

  const handleSync = async (connectionId: string) => {
    setSyncing(connectionId);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    await supabase
      .from("calendar_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", connectionId);
    
    toast({ title: "Synced", description: "Calendar synced successfully" });
    fetchData();
    setSyncing(null);
  };

  const getPropertyName = (id: string) => {
    return properties.find((p) => p.id === id)?.name || "Unknown";
  };

  // Calendar grid for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    const dayTasks = tasks.filter((t) => t.due_date?.startsWith(dateStr));
    const dayBookings = bookings.filter(
      (b) => b.check_in === dateStr || b.check_out === dateStr
    );
    
    return { tasks: dayTasks, bookings: dayBookings };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Calendar Integration</h2>
        <p className="text-muted-foreground">
          Sync tasks and bookings with Google Calendar
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Connections */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Connected Calendars</CardTitle>
            <CardDescription>Manage your calendar integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Calendar */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">
                    Sync tasks & bookings
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleConnectGoogle}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </div>

            {/* Apple Calendar */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card opacity-60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Apple Calendar</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
              <Badge variant="secondary">Soon</Badge>
            </div>

            {/* Connected accounts */}
            {connections.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Active Connections</p>
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      {conn.is_connected ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm capitalize">{conn.provider}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSync(conn.id)}
                      disabled={syncing === conn.id}
                    >
                      {syncing === conn.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(today, "MMMM yyyy")}
            </CardTitle>
            <CardDescription>Tasks and bookings this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-20" />;
                  }

                  const events = getEventsForDay(day);
                  const isToday = day === today.getDate();

                  return (
                    <div
                      key={day}
                      className={cn(
                        "h-20 p-1 rounded-lg border text-xs",
                        isToday && "border-primary bg-primary/5",
                        !isToday && "border-transparent hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "font-medium mb-1",
                          isToday && "text-primary"
                        )}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {events.tasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="px-1 py-0.5 rounded bg-blue-100 text-blue-800 truncate"
                          >
                            {task.title}
                          </div>
                        ))}
                        {events.bookings.slice(0, 1).map((booking) => (
                          <div
                            key={booking.id}
                            className="px-1 py-0.5 rounded bg-green-100 text-green-800 truncate"
                          >
                            {booking.guest_name}
                          </div>
                        ))}
                        {events.tasks.length + events.bookings.length > 3 && (
                          <div className="text-muted-foreground">
                            +{events.tasks.length + events.bookings.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <CardDescription>Tasks and bookings for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tasks */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Tasks Due
              </h4>
              {tasks.filter((t) => {
                if (!t.due_date) return false;
                const dueDate = new Date(t.due_date);
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return dueDate >= today && dueDate <= weekFromNow;
              }).length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming tasks</p>
              ) : (
                <div className="space-y-2">
                  {tasks
                    .filter((t) => {
                      if (!t.due_date) return false;
                      const dueDate = new Date(t.due_date);
                      const weekFromNow = new Date();
                      weekFromNow.setDate(weekFromNow.getDate() + 7);
                      return dueDate >= today && dueDate <= weekFromNow;
                    })
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm truncate">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(task.due_date!), "MMM d")}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Bookings */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Bookings
              </h4>
              {bookings.filter((b) => {
                const checkIn = new Date(b.check_in);
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return checkIn >= today && checkIn <= weekFromNow;
              }).length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming bookings</p>
              ) : (
                <div className="space-y-2">
                  {bookings
                    .filter((b) => {
                      const checkIn = new Date(b.check_in);
                      const weekFromNow = new Date();
                      weekFromNow.setDate(weekFromNow.getDate() + 7);
                      return checkIn >= today && checkIn <= weekFromNow;
                    })
                    .slice(0, 5)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {booking.guest_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {getPropertyName(booking.property_id)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {format(new Date(booking.check_in), "MMM d")}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
