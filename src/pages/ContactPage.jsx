import { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock, SendHorizonal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContact } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerRef = useRef(null);
  const contactInfoRef = useRef(null);
  const formRef = useRef(null);
  const sidebarRef = useRef(null);
  const faqHeaderRef = useRef(null);
  const faqItemsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('DEBUG: Submitting contact form with data:', { name, email, phone, subject, message });

    if (!name || !email || !message) {
      console.log('DEBUG: Validation failed: Missing required fields');
      toast.error("Please fill in all required fields");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      console.log('DEBUG: Validation failed: Invalid email address');
      toast.error("Please provide a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitContact({
        name,
        email,
        phone,
        subject,
        message,
      });

      console.log('DEBUG: Received response from /api/contact:', response);

      if (response.message && response.message.includes('failed to send email')) {
        console.log('DEBUG: Partial success - contact saved but email failed:', response.error);
        toast.warning(response.message);
      } else {
        console.log('DEBUG: Full success - contact and email sent');
        toast.success("Your message has been sent. We'll get back to you soon!");
      }

      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('DEBUG: Error submitting contact form:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status',
      });
      toast.error("Failed to send message. Please try again.");
    } finally {
      console.log('DEBUG: Submission complete, resetting isSubmitting state');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Header Section Animations
    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Contact Info Section Animations
    gsap.fromTo(
      contactInfoRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contactInfoRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Form Section Animations
    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Sidebar (Business Hours & Map) Animations
    gsap.fromTo(
      sidebarRef.current.children,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sidebarRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // FAQ Header Animations
    gsap.fromTo(
      faqHeaderRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqHeaderRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // FAQ Items Animations
    gsap.fromTo(
      faqItemsRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqItemsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        headerRef.current,
        contactInfoRef.current,
        formRef.current,
        sidebarRef.current,
        faqHeaderRef.current,
        faqItemsRef.current,
      ]);
    };
  }, []);

  return (
    <div className="bg-background">
      <section className="bg-eco py-16">
        <div className="container-custom">
          <div ref={headerRef} className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help. Reach out to our team using the information below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div ref={contactInfoRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-eco rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Phone</h3>
              <p className="text-muted-foreground mb-4">Mon-Fri, 9am to 6pm EST</p>
              <a href="tel:+15163609888" className="text-lg text-eco font-medium hover:underline">
                +1 (516) 360-9888
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-eco rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <p className="text-muted-foreground mb-4">We'll respond as soon as possible</p>
              <a href="mailto:info@ecopackagingproducts.com" className="text-eco font-medium hover:underline break-words">
                contact@bagstoryusa.com
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-eco rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Office</h3>
              <p className="text-muted-foreground mb-4">Our headquarters location</p>
              <address className="not-italic text-eco font-medium">
                176 Central Ave Suite 9 Farmingdale<br />
                New York, NY 11735
              </address>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div ref={formRef} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b px-6 py-4">
                <h2 className="font-semibold">Send Us a Message</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message here..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-start mb-6">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    By submitting this form, you agree to our privacy policy and terms of service.
                    We'll use your information to process your request and won't share it with third parties.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-eco hover:bg-eco-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <SendHorizonal className="h-5 w-5 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>

            <div ref={sidebarRef} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-eco mr-2" />
                  <h3 className="font-semibold">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-eco mr-2" />
                  <h3 className="font-semibold">Our Location</h3>
                </div>
                <div className="rounded-md overflow-hidden h-80 bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.044310259302!2d-73.4468708242827!3d40.7310075388195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e82d6cbe9ac199%3A0x3a7fcf8ab40a7d11!2s176%20Central%20Ave%20%239%2C%20Farmingdale%2C%20NY%2011735%2C%20USA!5e0!3m2!1sen!2sus!4v1712732817271!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Edit Edge location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-eco-paper">
        <div className="container-custom">
          <div ref={faqHeaderRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services
            </p>
          </div>

          <div ref={faqItemsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">What are your minimum order quantities?</h3>
              <p className="text-muted-foreground">
                Our minimum order quantities vary by product. For retail customers, there's no minimum.
                For bulk orders, MOQs typically range from 500-1000 units depending on the product and customization requirements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Do you offer custom branding?</h3>
              <p className="text-muted-foreground">
                Yes! We offer custom printing, including logo placement, custom colors, and designs.
                For custom orders, please request a quote through our distributor page or contact us directly.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">What shipping options do you offer?</h3>
              <p className="text-muted-foreground">
                We offer standard shipping (3-5 business days), express shipping (1-2 business days),
                and international shipping options. Free shipping is available on retail orders over $50.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">What materials do you use?</h3>
              <p className="text-muted-foreground">
                Our products are made from sustainable materials including recycled non-woven fabrics,
                organic cotton, and biodegradable alternatives. All materials are eco-friendly and compliant
                with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;