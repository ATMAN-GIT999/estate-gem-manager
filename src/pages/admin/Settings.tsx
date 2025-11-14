import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settingsId, setSettingsId] = useState("");
  const [homepageCount, setHomepageCount] = useState(3);
  const [gridLayout, setGridLayout] = useState(3);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (data) {
        setSettingsId(data.id);
        setHomepageCount(data.homepage_properties_count);
        setGridLayout(data.homepage_grid_layout);
      }
    };

    if (user && isAdmin) {
      fetchSettings();
    }
  }, [user, isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        homepage_properties_count: homepageCount,
        homepage_grid_layout: gridLayout,
      })
      .eq("id", settingsId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
            Homepage Settings
          </h1>
          <p className="text-foreground/80 mb-8">
            Configure how properties are displayed on the homepage
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Property Display Settings</CardTitle>
              <CardDescription>
                Control the number and layout of featured properties on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Featured Properties</Label>
                <Input
                  id="count"
                  type="number"
                  min="0"
                  max="10"
                  value={homepageCount}
                  onChange={(e) => setHomepageCount(parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 10 properties can be displayed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Grid Layout</Label>
                <Select
                  value={gridLayout.toString()}
                  onValueChange={(value) => setGridLayout(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 per row (Full width)</SelectItem>
                    <SelectItem value="2">2 per row</SelectItem>
                    <SelectItem value="3">3 per row (Default)</SelectItem>
                    <SelectItem value="4">4 per row</SelectItem>
                    <SelectItem value="5">5 per row</SelectItem>
                    <SelectItem value="6">6 per row</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose how many properties appear per row on desktop
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
