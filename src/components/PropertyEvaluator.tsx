import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TrendingUp } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";

const PropertyEvaluator = () => {
  const [loading, setLoading] = useState(false);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    size: "",
    guests: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLocale();

  // Editable content state. Renamed from "Property Cashflow Analysis" /
  // "Get Free Cash Flow Analysis" to match the nav's existing "Property
  // Evaluator" label and the page this section leads to — three different
  // names for the same tool was the actual problem, not the old wording on
  // its own.
  const [sectionTitle, setSectionTitle] = useState(t("pe-section-title"));
  const [sectionSubtitle, setSectionSubtitle] = useState(t("pe-section-subtitle"));
  const [buttonText, setButtonText] = useState(t("pe-button-text"));

  useEffect(() => {
    setSectionTitle(t("pe-section-title"));
    setSectionSubtitle(t("pe-section-subtitle"));
    setButtonText(t("pe-button-text"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.bedrooms || !formData.bathrooms) {
      toast({
        title: t("pe-missing-info-title"),
        description: t("pe-missing-info-desc"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Navigate immediately - the analysis will happen on the results page
    navigate("/evaluate", { state: { propertyData: formData } });
  };

  const handleAddressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "size" && value === "custom") {
      setShowCustomSize(true);
      setFormData(prev => ({
        ...prev,
        size: ""
      }));
    } else {
      if (field === "size") {
        setShowCustomSize(false);
      }
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      size: e.target.value
    }));
  };

  return (
    <Section id="property-evaluation" size="md" measure="wide">
      <div>
        <div>
          <div className="text-center mb-lg">
            <TrendingUp className="w-12 h-12 text-accent-strong mx-auto mb-sm" strokeWidth={1.5} />
            <EditableText
              id="pe-section-title"
              value={sectionTitle}
              onChange={setSectionTitle}
              as="h2"
              className="t-section text-primary mb-4"
            >
              {sectionTitle}
            </EditableText>
            <EditableText
              id="pe-section-subtitle"
              value={sectionSubtitle}
              onChange={setSectionSubtitle}
              as="p"
              multiline
              className="t-body text-foreground/80 max-w-2xl mx-auto"
            >
              {sectionSubtitle}
            </EditableText>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">{t("pe-address-label")}</Label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder={t("pe-address-placeholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">{t("pe-bedrooms-label")}</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => handleSelectChange("bedrooms", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("pe-bedrooms-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? t("pe-bedroom-singular") : t("pe-bedroom-plural")}
                        </SelectItem>
                      ))}
                      <SelectItem value="10">10+ {t("pe-bedroom-plural")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms">{t("pe-bathrooms-label")}</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => handleSelectChange("bathrooms", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("pe-bathrooms-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? t("pe-bathroom-singular") : t("pe-bathroom-plural")}
                        </SelectItem>
                      ))}
                      <SelectItem value="10">10+ {t("pe-bathroom-plural")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertyType">{t("pe-propertytype-label")}</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("pe-propertytype-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">{t("pe-type-apartment")}</SelectItem>
                      <SelectItem value="Villa">{t("pe-type-villa")}</SelectItem>
                      <SelectItem value="Studio">{t("pe-type-studio")}</SelectItem>
                      <SelectItem value="Multi Unit">{t("pe-type-multiunit")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">{t("pe-size-label")}</Label>
                  {showCustomSize ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={t("pe-size-custom-placeholder")}
                        value={formData.size}
                        onChange={handleCustomSizeChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomSize(false);
                          setFormData(prev => ({ ...prev, size: "" }));
                        }}
                        className="px-3"
                      >
                        {t("pe-cancel")}
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleSelectChange("size", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("pe-size-placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="75">{t("pe-size-50-100")}</SelectItem>
                        <SelectItem value="125">{t("pe-size-100-150")}</SelectItem>
                        <SelectItem value="175">{t("pe-size-150-200")}</SelectItem>
                        <SelectItem value="250">{t("pe-size-200-300")}</SelectItem>
                        <SelectItem value="400">{t("pe-size-300-500")}</SelectItem>
                        <SelectItem value="600">{t("pe-size-500plus")}</SelectItem>
                        <SelectItem value="custom">{t("pe-size-custom")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="guests">{t("pe-guests-label")}</Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => handleSelectChange("guests", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("pe-guests-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 6, 8, 10].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {t("pe-guest-word")}
                        </SelectItem>
                      ))}
                      <SelectItem value="12">12+ {t("pe-guest-word")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white shadow-elegant"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("pe-analyzing")}
                  </>
                ) : (
                  <EditableText
                    id="pe-button-text"
                    value={buttonText}
                    onChange={setButtonText}
                    as="span"
                  >
                    {buttonText}
                  </EditableText>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default PropertyEvaluator;