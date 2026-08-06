import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import SectionIntro from "./SectionIntro";

/**
 * Splits "Alejandro Marinetto Rohr" into the two columns `contacts` has.
 * first_name is NOT NULL, so a single-word entry becomes the first name and
 * last_name stays null rather than the insert failing.
 */
const splitName = (full: string) => {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || "Unknown",
    last_name: parts.length > 1 ? parts.slice(1).join(" ") : null,
  };
};

/**
 * Best-effort upload into the existing `images` bucket, returning how many
 * files made it. Whether an anonymous visitor may write there depends on the
 * bucket's storage policy — the only other upload in the app runs from the
 * authenticated admin UI. If the policy blocks it the lead is already saved,
 * and the caller says so honestly instead of claiming the photos arrived.
 */
const uploadImages = async (contactId: string, files: File[]) => {
  let uploaded = 0;

  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `consultations/${contactId}/${index}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      console.error("Consultation image upload failed:", error);
    } else {
      uploaded += 1;
    }
  }

  return uploaded;
};

const ConsultationBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    message: "",
  });
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 10) {
        toast({
          title: "Too many images",
          description: "Please select up to 10 images maximum",
          variant: "destructive",
        });
        return;
      }
      setSelectedImages([...selectedImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  /**
   * This used to end at the success toast: it validated the form, told the
   * owner "we'll contact you within 24 hours", and sent nothing anywhere. Every
   * lead this page produced was lost the moment the tab closed.
   *
   * The contact row is written first and on its own, because it is the part
   * that matters — a name and a phone number reach a human even if the photos
   * never upload. The uploads then run separately, and a storage failure
   * downgrades the message rather than throwing the lead away.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Please select a date",
        description: "Choose your preferred consultation date",
        variant: "destructive",
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Property images required",
        description: "Please upload at least one image of your property",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter your name and email so we can reach you",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { data: contact, error } = await supabase
      .from("contacts")
      .insert({
        ...splitName(formData.name),
        email: formData.email || null,
        phone: formData.phone || null,
        property_interest: formData.propertyAddress || null,
        notes: formData.message || null,
        source: "consultation-booking",
        tags: ["owner-lead"],
        metadata: {
          preferred_date: format(date, "yyyy-MM-dd"),
          image_count: selectedImages.length,
        },
      })
      .select("id")
      .single();

    if (error) {
      console.error("Could not save consultation request:", error);
      setSubmitting(false);
      toast({
        title: "Something went wrong",
        description:
          "We couldn't submit your request. Please email Hello@frontier-residences.com and we'll pick it up from there.",
        variant: "destructive",
      });
      return;
    }

    const uploaded = await uploadImages(contact.id, selectedImages);
    setSubmitting(false);

    toast({
      title: "Consultation requested",
      description:
        uploaded === selectedImages.length
          ? "We'll review your property and contact you within 24 hours."
          : "Your request is with us — we'll be in touch within 24 hours. Your photos didn't upload, so we may ask for them by email.",
    });

    setDate(undefined);
    setSelectedImages([]);
    setFormData({ name: "", email: "", phone: "", propertyAddress: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="book-a-call" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header brought into the page's section pattern — it used to be a
              16×16 icon over a hardcoded headline, which was both off-pattern
              and the one block on this page a client could not edit. */}
          <div className="mb-14">
            <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-8">
              <CalendarIcon className="w-6 h-6 text-accent-strong" />
            </div>
            <SectionIntro
              idPrefix="cb"
              eyebrow="Book a call"
              heading="Rather talk it through?"
              lead="Pick a date and send us a few photos. We'll look at the property before we call, so the conversation starts with numbers rather than questions."
            />
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-border shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Important Notes */}
              <div className="space-y-4">
                <Card className="p-4 bg-accent/10 border-accent/20">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-accent-strong flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Selective Property Portfolio</p>
                      <p className="text-foreground/80">
                        We carefully curate our property collection to maintain the highest standards. 
                        Property images are required to ensure your home aligns with our quality criteria.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-primary/10 border-primary/20">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Professional Preparation Included</p>
                      <p className="text-foreground/80">
                        Don't worry about perfect photos! Once approved, we'll professionally prepare and 
                        photograph your property before listing it on booking platforms.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="propertyAddress">Property Address *</Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    placeholder="Calle Marbella, Spain"
                    required
                  />
                </div>
              </div>

              {/* Calendar Selection */}
              <div>
                <Label className="mb-3 block">Preferred Consultation Date *</Label>
                <Card className="p-4 bg-card border-border w-fit mx-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md"
                  />
                </Card>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="mb-3 block">Property Images * (Max 10)</Label>
                <Card className="p-6 bg-card border-border border-dashed">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-accent-strong mx-auto mb-4" />
                    <label htmlFor="images" className="cursor-pointer">
                      <div className="text-sm text-foreground/70 mb-2">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs text-foreground/50">
                        PNG, JPG up to 10MB each
                      </div>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Additional Message */}
              <div>
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your property, any special features, or specific questions..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 text-white shadow-elegant"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Request Consultation"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConsultationBooking;
