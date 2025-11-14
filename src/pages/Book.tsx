import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Users, Star } from "lucide-react";

const Book = () => {
  const properties = [
    {
      id: 1,
      name: "Villa El Campanario",
      location: "Marbella, Costa del Sol",
      type: "Villa",
      bedrooms: 5,
      bathrooms: 4,
      guests: 10,
      price: 450,
      rating: 4.9,
      image: "villa",
      featured: true,
    },
    {
      id: 2,
      name: "Soho Boho Apartment",
      location: "Málaga, Soho District",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      price: 180,
      rating: 4.8,
      image: "apartment",
      featured: true,
    },
    {
      id: 3,
      name: "Blue View Villa",
      location: "Costa del Sol",
      type: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      price: 380,
      rating: 4.9,
      image: "villa",
      featured: false,
    },
    {
      id: 4,
      name: "Vienna Classic Residence",
      location: "Vienna, Austria",
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      price: 220,
      rating: 4.7,
      image: "apartment",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">Book Your Perfect Stay</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Discover our curated collection of luxury villas and apartments in Europe's most desirable locations
            </p>
          </div>

          {/* Tabs for Property Types */}
          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="short">Short-Term</TabsTrigger>
              <TabsTrigger value="mid">Mid-Term</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    className="group overflow-hidden shadow-elegant hover:shadow-gold transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Property Image Placeholder */}
                    <div className="aspect-[4/3] bg-gradient-hero relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p className="text-lg">Property Image</p>
                      </div>
                      {property.featured && (
                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Featured</Badge>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="font-playfair text-2xl text-primary">{property.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold text-accent">{property.rating}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-6 mb-4 text-foreground/70">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} baths</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{property.guests} guests</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">€{property.price}</span>
                          <span className="text-muted-foreground"> / night</span>
                        </div>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="short">
              <div className="text-center py-12">
                <p className="text-xl text-foreground/80">Short-term rental properties - Perfect for vacations and getaways</p>
              </div>
            </TabsContent>

            <TabsContent value="mid">
              <div className="text-center py-12">
                <p className="text-xl text-foreground/80">
                  Mid-term rentals with exclusive discounts - Ideal for extended stays
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Book;
