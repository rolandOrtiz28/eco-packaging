import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AdvertisementPage = () => {
  const makeKnownImageRef = useRef(null);
  const makeKnownTextRef = useRef(null);
  const outreachTextRef = useRef(null);
  const outreachImageRef = useRef(null);
  const boostImageRef = useRef(null);
  const boostTextRef = useRef(null);
  const bonusRef = useRef(null);

  useEffect(() => {
    // Make Your Business Known Section Animations
    gsap.fromTo(
      makeKnownImageRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: makeKnownImageRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      makeKnownTextRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: makeKnownTextRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Your Business Outreach Section Animations
    gsap.fromTo(
      outreachTextRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: outreachTextRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      outreachImageRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: outreachImageRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Boost Your Profits Section Animations
    gsap.fromTo(
      boostImageRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: boostImageRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      boostTextRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: boostTextRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Claim Your Bonus Section Animations
    gsap.fromTo(
      bonusRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bonusRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        makeKnownImageRef.current,
        makeKnownTextRef.current,
        outreachTextRef.current,
        outreachImageRef.current,
        boostImageRef.current,
        boostTextRef.current,
        bonusRef.current,
      ]);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Make Your Business Known Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                ref={makeKnownImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744076755/BagStory/eco-packaging-03-800x586_ujtfqu.jpg"
                alt="Eco-Friendly Tote Bag"
                className="rounded-lg shadow-md"
              />
            </div>
            <div ref={makeKnownTextRef}>
              <h6 className="text-eco font-medium mb-2">ADVERTISEMENT</h6>
              <h2 className="text-3xl font-bold mb-3">Make Your Business Known</h2>
              <p className="text-gray-700 mb-6">
                In the competitive market, Bag Story LLC offers an innovative and eco-friendly solution to ensure your brand stands out. Our non-woven bags are the perfect canvas for your logo, offering a sustainable way to promote your business.
              </p>
              <p className="text-gray-700 mb-6">
                Through our network of locations, we distribute your branded bags to supermarkets, grocery stores, and retailers, ensuring your message reaches a wide audience. Imagine the impact your brand can have by being seen on the streets, in stores, and in the hands of customers—promoting your business in the most sustainable way.
              </p>
              <Link to="/distributor">
                <Button className="bg-eco hover:bg-eco-dark">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Your Business Outreach Section */}
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={outreachTextRef} className="order-2 lg:order-1">
              <h3 className="text-2xl font-semibold mb-4">Your Business Outreach</h3>
              <p className="text-gray-700 mb-6">
                Expand your distribution with Bag Story LLC. We offer exclusive custom branding solutions tailored to help you grow your business. Our custom bags allow you to showcase your brand while promoting sustainability.
              </p>
              <p className="text-gray-700 mb-8">
                Whether you’re a small business or a large corporation, our eco-friendly bags are the perfect marketing tool to make a lasting impression with clients and customers. Let’s work together to create a sustainable future while growing your brand.
              </p>
              <Link to="/distributor">
                <Button className="bg-eco hover:bg-eco-dark">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <img
                ref={outreachImageRef}
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                alt="Business Outreach"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Boost Your Profits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                ref={boostImageRef}
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                alt="Sustainable Growth"
                className="rounded-lg shadow-md"
              />
            </div>
            <div ref={boostTextRef}>
              <h3 className="text-2xl font-semibold mb-4">Boost Your Profits</h3>
              <p className="text-gray-700 mb-6">
                Elevate your brand’s visibility with Bag Story LLC’s strategic advertising solutions. Our custom-branded bags are designed to help you stand out while promoting sustainability.
              </p>
              <p className="text-gray-700 mb-8">
                By partnering with us, you’ll reach a wider audience through impactful advertising. Our services are designed to maximize your brand’s exposure and boost your profits. Start today with Bag Story and see the difference!
              </p>
              <Link to="/distributor">
                <Button className="bg-eco hover:bg-eco-dark">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Your Bonus Section */}
      <section ref={bonusRef} className="section-padding bg-eco-paper">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-3">Claim Your Bonus</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Bag Story adds value to your business with custom-printed bags for free. Contact us to get started and elevate your brand today!
          </p>
          <Link to="/contact">
            <Button className="bg-eco hover:bg-eco-dark">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdvertisementPage;