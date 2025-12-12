import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BusinessAreas from "@/components/BusinessAreas";

const BusinessAreasPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">Our Business Areas</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Comprehensive services designed to maximize your property's potential and deliver exceptional results
            </p>
          </div>
        </div>
        <BusinessAreas showHeader={false} />
      </main>
      <Footer />
    </div>
  );
};

export default BusinessAreasPage;
