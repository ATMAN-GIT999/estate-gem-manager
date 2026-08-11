import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Calendar as CalendarIcon, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * The consultation request under the cashflow result on /evaluate.
 *
 * ⚠️ This form used to submit nothing at all. `handleSubmit` validated the
 * date and the photos, showed "We'll review your property and contact you
 * within 24 hours", and returned — no insert, no upload, no mail. It sits at
 * the warmest lead the site produces, directly under an owner's own income
 * projection, and every one of those enquiries was discarded on the spot.
 *
 * It now writes a row to `contacts` and puts the photos in the private
 * `consultation-uploads` bucket.
 *
 * Both of those already existed in the database — a private bucket, an insert
 * policy for anonymous visitors, and admin read access were provisioned for
 * this form and then never wired up. The values below are not free choices:
 * they are what the deployed policies require.
 */
const CONTACT_EMAIL = "Hello@frontier-residences.com";

/**
 * The live policy "Anyone can submit a consultation request" ends in
 * `source = 'consultation-booking'`. Change this string and every submission is
 * rejected by RLS.
 */
const LEAD_SOURCE = "consultation-booking";
const PHOTO_BUCKET = "consultation-uploads";

/** Keeps Supabase Storage keys predictable: no spaces, no accents, no slashes. */
const safeFileName = (name: string) =>
  name.normalize("NFKD").replace(/[^\w.\-]+/g, "_").slice(-80);

const ConsultationBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
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

    // `required` on the inputs accepts a string of spaces, which would reach the
    // database and be bounced by the policy's `first_name <> ''` check — a
    // confusing way to learn you left the name blank.
    if (!formData.name.trim() || !formData.email.trim() || !formData.propertyAddress.trim()) {
      toast({
        title: "Check your details",
        description: "Please fill in your name, email and the property address.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    // The id is minted here rather than read back from the insert: visitors
    // have no SELECT policy on `contacts`, so asking for the row would turn a
    // successful write into an error. Knowing the id up front also gives the
    // photos a folder to live in.
    const enquiryId = crypto.randomUUID();

    // Photos first, the lead row last. An upload that fails must not cost us
    // the enquiry, so failures are collected and reported inside the row
    // instead of aborting — a lead with missing photos is recoverable, a lead
    // that was never written is not.
    const uploaded: string[] = [];
    const failed: string[] = [];
    for (const [index, file] of selectedImages.entries()) {
      const path = `${enquiryId}/${index + 1}-${safeFileName(file.name)}`;
      const { error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        console.error("Enquiry photo upload failed:", file.name, error);
        failed.push(file.name);
      } else {
        uploaded.push(path);
      }
    }

    const [firstName, ...restOfName] = formData.name.trim().split(/\s+/);
    const preferredDate = date.toISOString().slice(0, 10);

    const { error } = await supabase.from("contacts").insert({
      id: enquiryId,
      first_name: firstName || formData.name.trim(),
      last_name: restOfName.join(" ") || null,
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      source: LEAD_SOURCE,
      status: "lead",
      notes: [
        `Property: ${formData.propertyAddress.trim()}`,
        `Preferred consultation date: ${preferredDate}`,
        `Photos: ${uploaded.length} uploaded to ${PHOTO_BUCKET}/${enquiryId}`,
        failed.length ? `Photos that failed to upload: ${failed.join(", ")}` : "",
        formData.message.trim() ? `\n${formData.message.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        property_address: formData.propertyAddress.trim(),
        preferred_date: preferredDate,
        photo_paths: uploaded,
        photo_upload_failures: failed,
        submitted_from: "evaluate",
      },
    });

    setSubmitting(false);

    if (error) {
      console.error("Consultation request insert failed:", error);
      toast({
        variant: "destructive",
        title: "We could not send that",
        description: `Please email us at ${CONTACT_EMAIL} — we don't want to lose your request.`,
      });
      return;
    }

    if (failed.length) {
      toast({
        title: "Request sent, some photos didn't upload",
        description: `We have your details. Please email ${failed.length} missing photo(s) to ${CONTACT_EMAIL}.`,
      });
    }

    setSent(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // The confirmation replaces the form rather than sitting under it. Leaving a
  // filled-in form on screen after a successful send invites a second identical
  // submission, which is how one owner becomes three rows in the CRM.
  if (sent) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle2 className="w-14 h-14 text-accent-strong mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              Consultation requested
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              We have your property details and photos. Our team will review them and
              come back to you within 24 hours to confirm your consultation.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <CalendarIcon className="w-16 h-16 text-accent-strong mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
              Ready to List Your Property?
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Book a consultation with our team to discuss your property's potential
            </p>
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
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending your request…
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
