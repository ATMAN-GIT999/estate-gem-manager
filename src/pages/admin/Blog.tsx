import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminBlog = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, navigate]);

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
        <h1 className="font-playfair text-4xl font-bold text-primary mb-8">Blog Management</h1>
        <p className="text-muted-foreground">Blog post management coming soon</p>
      </main>
    </div>
  );
};

export default AdminBlog;
