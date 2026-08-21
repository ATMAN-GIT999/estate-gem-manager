import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BusinessAreas from "@/components/BusinessAreas";
import { useState } from "react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";

const BusinessAreasPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Our Business Areas");
  const [pageSubtitle, setPageSubtitle] = useState("Comprehensive services designed to maximize your property's potential and deliver exceptional results");

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Our Business Areas"
        description="Property management, guaranteed income, renovations and investments — the four ways Frontier Residences works with property owners in Spain and Austria."
        path="/business-areas"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Business Areas", path: "/business-areas" }])}
      />
      <Navigation />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <EditableText
              id="bap-page-title"
              value={pageTitle}
              onChange={setPageTitle}
              as="h1"
              className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6"
            >
              {pageTitle}
            </EditableText>
            <EditableText
              id="bap-page-subtitle"
              value={pageSubtitle}
              onChange={setPageSubtitle}
              as="p"
              multiline
              className="text-xl text-foreground/80 leading-relaxed"
            >
              {pageSubtitle}
            </EditableText>
          </div>
        </div>
        <BusinessAreas showHeader={false} />
      </main>
      <Footer />
    </div>
  );
};

const BusinessAreasPage = () => (<PageWrapper slug="site--business-areas"><BusinessAreasPageContent /></PageWrapper>);
export default BusinessAreasPage;