import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BusinessAreas from "@/components/BusinessAreas";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <BusinessAreas />
      <Stats />
      <Footer />
    </div>
  );
};

export default Index;
