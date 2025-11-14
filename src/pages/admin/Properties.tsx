import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, ArrowLeft, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

const AdminProperties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location: "",
    type: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    guests: 1,
    price_per_night: 0,
    registration_number: "",
    amenities: "",
    address: "",
    latitude: "",
    longitude: "",
    nearbyAmenities: "",
    featured: false,
    available: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);


  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch properties",
      });
    } else {
      setProperties(data || []);
    }
    setLoadingProperties(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    const nearbyAmenitiesArray = formData.nearbyAmenities
      ? JSON.parse(formData.nearbyAmenities)
      : [];

    try {
      // Upload images if any
      const uploadedImageUrls = [...existingImages];
      
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);
        }
      }

      const propertyData = {
        ...formData,
        amenities: amenitiesArray,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        nearby_amenities: nearbyAmenitiesArray,
        images: uploadedImageUrls,
      };

      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editingProperty.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        const { error } = await supabase.from("properties").insert([propertyData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      fetchProperties();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setExistingImages(property.images || []);
    setFormData({
      name: property.name,
      slug: property.slug,
      location: property.location,
      type: property.type,
      description: property.description || "",
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      guests: property.guests,
      address: property.address || "",
      latitude: property.latitude?.toString() || "",
      longitude: property.longitude?.toString() || "",
      nearbyAmenities: property.nearby_amenities ? JSON.stringify(property.nearby_amenities) : "",
      price_per_night: property.price_per_night,
      registration_number: property.registration_number || "",
      amenities: property.amenities?.join(", ") || "",
      featured: property.featured,
      available: property.available,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      location: "",
      type: "",
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      guests: 1,
      price_per_night: 0,
      registration_number: "",
      amenities: "",
      address: "",
      latitude: "",
      longitude: "",
      nearbyAmenities: "",
      featured: false,
      available: true,
    });
    setImageFiles([]);
    setExistingImages([]);
  };

  

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/admin">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-primary mb-2">Properties</h1>
              <p className="text-foreground/80">Manage your property listings</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setEditingProperty(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>

          {loadingProperties ? (
            <p>Loading properties...</p>
          ) : (
            <div className="grid gap-6">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{property.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{property.location}</p>
                        <p className="text-lg font-bold text-primary mt-2">
                          €{property.price_per_night} / night
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bedrooms:</span>{" "}
                        {property.bedrooms}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bathrooms:</span>{" "}
                        {property.bathrooms}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Guests:</span> {property.guests}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span> {property.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for the property listing
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Property Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="property-name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="Villa, Apartment, etc."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bedrooms: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bathrooms: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Guests *</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price/Night *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_per_night}
                      onChange={(e) =>
                        setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    value={formData.registration_number}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_number: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Textarea
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Pool, WiFi, Air Conditioning"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, city, postal code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="36.5270"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="-4.8896"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nearbyAmenities">Nearby Amenities (JSON format)</Label>
                  <Textarea
                    id="nearbyAmenities"
                    value={formData.nearbyAmenities}
                    onChange={(e) => setFormData({ ...formData, nearbyAmenities: e.target.value })}
                    placeholder='[{"name": "Beach", "distance": "100m", "type": "leisure"}]'
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Property Images</Label>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Current images ({existingImages.length})</p>
                      <div className="grid grid-cols-3 gap-3">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setExistingImages(existingImages.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {imageFiles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">New images to upload ({imageFiles.length})</p>
                      <div className="grid grid-cols-3 gap-3">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setImageFiles(imageFiles.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles([...imageFiles, ...files]);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                      className="w-full"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add Images
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, available: checked })
                      }
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProperty ? "Update" : "Create"} Property
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminProperties;
