import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings = () => {
  const { toast } = useToast();
  const [settingsId, setSettingsId] = useState("");
  const [homepageCount, setHomepageCount] = useState(3);
  const [gridLayout, setGridLayout] = useState(3);
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (settings) {
        setSettingsId(settings.id);
        setHomepageCount(settings.homepage_properties_count);
        setGridLayout(settings.homepage_grid_layout);
      }

      const { data: propertiesData } = await supabase
        .from("properties")
        .select("*")
        .order("name");

      if (propertiesData) {
        setProperties(propertiesData);
        const featured = new Set(
          propertiesData.filter(p => p.featured).map(p => p.id)
        );
        setSelectedProperties(featured);
      }
    };

    fetchData();
  }, []);

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Update site settings
    const { error: settingsError } = await supabase
      .from("site_settings")
      .update({
        homepage_properties_count: homepageCount,
        homepage_grid_layout: gridLayout,
      })
      .eq("id", settingsId);

    if (settingsError) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    // Update featured status for all properties
    const updates = properties.map(property => 
      supabase
        .from("properties")
        .update({ featured: selectedProperties.has(property.id) })
        .eq("id", property.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some(result => result.error);

    if (hasError) {
      toast({
        title: "Error",
        description: "Failed to update some properties",
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

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Properties</CardTitle>
              <CardDescription>
                Select which properties should appear on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={property.id}
                        checked={selectedProperties.has(property.id)}
                        onCheckedChange={() => toggleProperty(property.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <label
                          htmlFor={property.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {property.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {property.location} • {property.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground mt-4">
                {selectedProperties.size} {selectedProperties.size === 1 ? 'property' : 'properties'} selected
              </p>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
