import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, FileText, BarChart3, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) return null;

  const adminSections = [
    {
      title: "Properties",
      description: "Manage property listings",
      icon: Building,
      href: "/admin/properties",
      color: "text-primary",
    },
    {
      title: "Bookings",
      description: "View and manage bookings",
      icon: Calendar,
      href: "/admin/bookings",
      color: "text-primary",
    },
    {
      title: "Blog Posts",
      description: "Create and edit blog content",
      icon: FileText,
      href: "/admin/blog",
      color: "text-primary",
    },
    {
      title: "Analytics",
      description: "View website statistics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-foreground/80 mb-8">Manage your luxury property portfolio</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map((section) => (
              <Link key={section.href} to={section.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <section.icon className={`w-10 h-10 ${section.color} mb-2`} />
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
