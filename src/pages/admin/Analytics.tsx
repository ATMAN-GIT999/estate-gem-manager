import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Eye, Users, Calendar } from "lucide-react";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ pageViews: 0, uniqueVisitors: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: events } = await supabase.from("analytics_events").select("*");
      const { data: bookings } = await supabase.from("bookings").select("id");
      
      setStats({
        pageViews: events?.length || 0,
        uniqueVisitors: new Set(events?.map(e => e.session_id)).size,
        bookings: bookings?.length || 0,
      });
    };
    fetchStats();
  }, []);

  

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
        <h1 className="font-playfair text-4xl font-bold text-primary mb-8">Analytics</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.pageViews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.uniqueVisitors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.bookings}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
