import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminBookings = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, properties(name)")
        .order("created_at", { ascending: false });
      setBookings(data || []);
    };
    fetchBookings();
  }, []);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <Link to="/admin">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="font-playfair text-4xl font-bold text-primary mb-8">Bookings</h1>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{booking.properties?.name}</span>
                  <Badge>{booking.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Guest: {booking.guest_name} ({booking.guest_email})</p>
                <p>Check-in: {booking.check_in} | Check-out: {booking.check_out}</p>
                <p className="font-bold">Total: €{booking.total_price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
