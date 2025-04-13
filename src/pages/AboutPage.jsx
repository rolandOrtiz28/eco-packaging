import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const aboutHeaderRef = useRef(null);
  const aboutImageRef = useRef(null);
  const aboutTextRef = useRef(null);
  const welcomeHeaderRef = useRef(null);
  const welcomeImageRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const makeKnownImageRef = useRef(null);
  const makeKnownTextRef = useRef(null);
  const outreachTextRef = useRef(null);
  const outreachImageRef = useRef(null);
  const boostImageRef = useRef(null);
  const boostTextRef = useRef(null);
  const bonusTextRef = useRef(null);

  useEffect(() => {
    // About Us Section Animations
    if (aboutHeaderRef.current) {
      gsap.fromTo(
        aboutHeaderRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutHeaderRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    if (aboutImageRef.current) {
      gsap.fromTo(
        aboutImageRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutImageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    if (aboutTextRef.current) {
      gsap.fromTo(
        aboutTextRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutTextRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Welcome Section Animations
    if (welcomeHeaderRef.current) {
      gsap.fromTo(
        welcomeHeaderRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: welcomeHeaderRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    if (welcomeImageRef.current) {
      gsap.fromTo(
        welcomeImageRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: welcomeImageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    if (welcomeTextRef.current) {
      gsap.fromTo(
        welcomeTextRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: welcomeTextRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Welcome to Eco Packaging Products Inc. Section Animations
    if (makeKnownImageRef.current) {
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
    }
    if (makeKnownTextRef.current) {
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
    }

    // Self-Built Ecosystem Section Animations
    if (outreachTextRef.current) {
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
    }
    if (outreachImageRef.current) {
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
    }

    // Moreover (Sustainability) Section Animations
    if (boostImageRef.current) {
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
    }
    if (boostTextRef.current) {
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
    }

    // Comprehensive Warehouse and Other Sections Animations
    if (bonusTextRef.current) {
      gsap.fromTo(
        bonusTextRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bonusTextRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([
        aboutHeaderRef.current,
        aboutImageRef.current,
        aboutTextRef.current,
        welcomeHeaderRef.current,
        welcomeImageRef.current,
        welcomeTextRef.current,
        makeKnownImageRef.current,
        makeKnownTextRef.current,
        outreachTextRef.current,
        outreachImageRef.current,
        boostImageRef.current,
        boostTextRef.current,
        bonusTextRef.current,
      ]);
    };
  }, []);

  return (
    <div className="min-h-screen">
   
      {/* Welcome to Eco Packaging Products Inc. Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                ref={makeKnownImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476187/bagstoryCustom/Image_20250412214739_gkq8fd.jpg"
                alt="Eco-Friendly Packaging"
                className="rounded-lg shadow-md"
              />
            </div>
            <div ref={makeKnownTextRef}>
              <h2 className="text-3xl font-bold mb-3">Welcome to Eco Packaging Products Inc.</h2>
              <p className="text-gray-700 mb-6">
                Eco Packaging Products Inc. is a leading packaging company strategically located in New York, with a specialized focus on designing, manufacturing, and distributing high-quality non-woven bag solutions. As a pioneer in the industry, we have established a unique business model that sets us apart from our competitors, leveraging a robust supply chain network that enables us to deliver exceptional products and services to our valued customers.
              </p>
              <p className="text-gray-700 mb-6">
                With a steadfast commitment to innovation, quality, and customer satisfaction, we have developed a distinct set of core advantages that not only differentiate us in the market but also provide our clients with an unparalleled service experience.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Our Five Key Strengths</h3>
              <p className="text-gray-700 mb-6">
                Including cutting-edge product design, stringent quality control measures, flexible manufacturing capabilities, reliable logistics and distribution, and dedicated customer support - work in harmony to ensure that every aspect of our operations is optimized to meet the evolving needs of our customers.
              </p>
              <p className="text-gray-700 mb-6">
                As you navigate through this brochure, we invite you to explore our comprehensive range of non-woven bag products, discover the benefits of partnering with us, and experience the E.P.P.I difference for yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Built Ecosystem Section */}
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={outreachTextRef} className="order-2 lg:order-1">
              <h3 className="text-2xl font-semibold mb-4">Self-Built Ecosystem: Achieving Circular Economy</h3>
              <p className="text-gray-700 mb-6">
                In today’s increasingly competitive global landscape, possessing a self-built production ecosystem is crucial for maintaining a company’s competitiveness. Our production base in China has established a comprehensive closed-loop system, where we manufacture non-woven fabric raw materials, print finished products, and produce final bags all under one roof.
              </p>
              <p className="text-gray-700 mb-8">
                This integrated approach not only ensures the stability and controllability of product quality but also significantly enhances production efficiency.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  ref={outreachImageRef}
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476174/bagstoryCustom/Image_20250412214955_cnnwbl.jpg"
                  alt="Production Ecosystem 1"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476187/bagstoryCustom/Image_20250412215019_opa8te.jpg"
                  alt="Production Ecosystem 2"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476182/bagstoryCustom/Image_20250412214824_skxpow.jpg"
                  alt="Production Ecosystem 3"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476183/bagstoryCustom/Image_20250412215005_dkzr6c.jpg"
                  alt="Production Ecosystem 4"
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moreover (Sustainability) Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[450px]">
              <img
                ref={boostImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476197/bagstoryCustom/Image_20250412215022_wpvlmg.jpg"
                alt="Sustainability 1"
                className="absolute top-0 left-0 rounded-lg shadow-md w-[60%] h-[60%] object-cover z-10"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476179/bagstoryCustom/Image_20250412214828_cqzixl.jpg"
                alt="Sustainability 2"
                className="absolute top-0 right-0 rounded-lg shadow-md w-[45%] h-[40%] object-cover z-20 transform translate-x-[-20%]"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476179/bagstoryCustom/Image_20250412214828_cqzixl.jpg"
                alt="Sustainability 3"
                className="absolute bottom-0 left-0 rounded-lg shadow-md w-[40%] h-[40%] object-cover z-30 transform translate-y-[-20%]"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476706/bagstoryCustom/Screenshot_13_q4pavh.png"
                alt="Sustainability 4"
                className="absolute bottom-4 right-20 rounded-lg shadow-md w-[50%] h-[35%] object-cover z-40 transform translate-x-[20%] translate-y-[-10%]"
              />
            </div>
            <div ref={boostTextRef}>
              <h3 className="text-2xl font-semibold mb-4">Moreover,</h3>
              <p className="text-gray-700 mb-6">
                Our commitment to sustainability is demonstrated through our recycling program, which collects and reuses discarded materials, transforming them into PP pellets that are reintroduced into our production process.
              </p>
              <p className="text-gray-700 mb-8">
                By embracing this circular economy model, we have successfully reduced waste, minimized environmental impact, and lowered production costs. This enables us to offer high-quality products to our customers at the most competitive prices, while contributing to a more sustainable future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Warehouse Section */}
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comprehensive Warehouse and Distribution System: Elevating User Experience</h3>
              <p className="text-gray-700 mb-6">
                To further enhance our service levels and intensify the user experience, we have established a dedicated warehouse and distribution center in the Eastern United States. This strategic facility enables us to provide timely and efficient delivery of goods to our customers, with a team of experts carefully planning and executing daily delivery routes based on precise order information. As a result, every customer can rely on receiving their required products in a timely manner, with minimal delays or disruptions.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476179/bagstoryCustom/Image_20250412214828_cqzixl.jpg"
                  alt="Warehouse 1"
                  className="col-span-2 row-span-2 rounded-lg shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476175/bagstoryCustom/Image_20250412215009_k7zcpd.jpg"
                  alt="Warehouse 2"
                  className="col-span-2 row-span-1 rounded-lg shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476175/bagstoryCustom/Image_20250412214832_ltmjq3.jpg"
                  alt="Warehouse 3"
                  className="col-span-1 row-span-1 rounded-lg shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476171/bagstoryCustom/Image_20250412214837_vlmizn.jpg"
                  alt="Warehouse 4"
                  className="col-span-1 row-span-1 rounded-lg shadow-md w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div ref={bonusTextRef}>
            <h4 className="text-xl font-semibold mb-4">Moreover</h4>
            <p className="text-gray-700 mb-6">
              Leveraging cutting-edge information technology, we are able to track the logistics status of each shipment in real-time, providing our customers with regular feedback reports and updates on the latest developments. This transparent and open approach has earned us the trust and loyalty of numerous partners, who appreciate the visibility and control it affords them over their shipments.
            </p>
            <p className="text-gray-700 mb-6">
              Our comprehensive warehouse and distribution system is designed to provide a seamless and integrated logistics experience, from receipt of goods to final delivery. By maintaining a state-of-the-art facility and investing in advanced technology, we are able to streamline our operations, reduce errors, and increase efficiency.
            </p>
            <p className="text-gray-700 mb-6">
              Our team of experienced professionals is dedicated to ensuring that every aspect of the delivery process is meticulously planned and executed, with a focus on providing exceptional customer service and support. Whether you require rapid delivery, specialized handling, or customized logistics solutions, our warehouse and distribution system is equipped to meet your unique needs and exceed your expectations.
            </p>
            <p className="text-gray-700 mb-6">
              With our commitment to transparency, reliability, and flexibility, we are confident that your customers will enjoy a superior user experience, with every interaction and transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Flexible Consolidation Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">Flexible Consolidation Services: Meeting the Needs of Small-Batch Orders</h3>
            <p className="text-gray-700 mb-6 text-center">
              For customers with smaller order quantities who still wish to benefit from the economies of scale associated with larger-volume purchases, we offer an optimal solution – our flexible consolidation services. Leveraging our substantial business volume and extensive logistics network, we operate a significant number of container loads from China to various destinations around the world every month. This enables us to provide a unique opportunity for customers with smaller shipment requirements to share container space with other parties, thereby splitting the logistics costs and significantly reducing the transportation expense for individual items.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744109498/BagStory/eco-packaging-castro-600x600_z3ifcd.png"
                alt="Product 1"
                className="rounded-lg shadow-md w-32 h-40 object-contain"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744109497/BagStory/eco-packaging-midyson-600x600_zlf88c.png"
                alt="Product 2"
                className="rounded-lg shadow-md w-32 h-40 object-contain"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744109495/BagStory/eco-packaging-cocacola-600x600_ddyzgq.png"
                alt="Product 3"
                className="rounded-lg shadow-md w-32 h-40 object-contain"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744109495/BagStory/eco-packaging-jewelosco-600x600_a4qkwx.png"
                alt="Product 4"
                className="rounded-lg shadow-md w-32 h-40 object-contain"
              />
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744109495/BagStory/eco-packaging-BC-600x600_zchkdm.png"
                alt="Product 5"
                className="rounded-lg shadow-md w-32 h-40 object-contain"
              />
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 mb-6 text-center">
              By taking advantage of this service, our customers can not only enjoy lower shipping costs but also respond more quickly to changes in market demand, adjust their inventory levels in a timely manner, and avoid the financial burden of excessive stockpiling. Our consolidation services are designed to provide maximum flexibility and convenience for our customers, allowing them to ship smaller quantities while still benefiting from the cost savings associated with larger shipments. By consolidating multiple small shipments into a single container, we can help our customers streamline their logistics operations, reduce their carbon footprint, and improve their overall supply chain efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={bonusTextRef}>
              <h4 className="text-xl font-semibold mb-4">Moreover,</h4>
              <p className="text-gray-700 mb-6">
                Our experienced team will work closely with each customer to ensure that their specific needs are met, providing personalized support and guidance throughout the entire shipping process. With our flexible consolidation services, customers can enjoy a more agile and responsive logistics solution, one that is tailored to their unique business requirements and helps them stay competitive in an ever-changing market.
              </p>
              <p className="text-gray-700 mb-6">
                By choosing our consolidation services, our customers can trust that their shipments will be handled with care, precision, and attention to detail, ensuring that their products reach their destinations safely, efficiently, and on time.
              </p>
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476169/bagstoryCustom/Image_20250412214812_y2u1vf.jpg"
                alt="Consolidation Process"
                className="rounded-lg shadow-md w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partnerships Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <img
              src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477239/bagstoryCustom/Screenshot_16_y2tcil.png"
              alt="Shipping Container 1"
              className="rounded-lg shadow-md w-full max-w-sm h-48 object-cover"
            />
            <img
              src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477238/bagstoryCustom/Screenshot_15_wfhuf9.png"
              alt="Shipping Container 2"
              className="rounded-lg shadow-md w-full max-w-sm h-48 object-cover"
            />
          </div>
          <div ref={bonusTextRef}>
            <h3 className="text-2xl font-semibold mb-4">Strategic Partnerships: Ensuring Logistics Cost Advantage</h3>
            <p className="text-gray-700 mb-6">
              Effective logistics cost control is a crucial aspect of any import/export trade. To address this, we have established long-term strategic partnerships with multiple major freight forwarding agencies. Through these collaborations, we are able to secure the most competitive pricing for flights and warehouse resources on a monthly basis.
            </p>
            <p className="text-gray-700 mb-6">
              Whether it’s ocean or air freight, we can tailor our transportation solutions to meet the specific needs of our clients, no matter where they are located around the world. Our global reach and extensive network enable us to efficiently transport goods to any major port of destination, providing our customers with seamless and reliable logistics services.
            </p>
            <p className="text-gray-700 mb-6">
              Furthermore, our strong relationships with our partners allow us to enjoy additional benefits, such as priority loading, which further expedite delivery times. This comprehensive approach ensures that goods are smoothly transported from our manufacturing facilities in China to our customers’ doorstep, anywhere in the world, while significantly reducing overall operational costs.
            </p>
            <p className="text-gray-700 mb-6">
              By leveraging these strategic partnerships, we are able to provide our customers with a flexible and cost-effective logistics experience, characterized by reliability, efficiency, and personalized service. Our ability to negotiate preferential rates with our partners allows us to pass on the savings to our clients, making our services even more competitive in the global market.
            </p>
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477296/bagstoryCustom/Screenshot_17_jcene8.png"
                alt="Shipping Container 3"
                className="rounded-lg shadow-md w-full max-w-2xl h-auto object-cover"
              />
            </div>
            <p className="text-gray-700 mb-6">
              Moreover, our extensive network of logistics experts and state-of-the-art tracking systems enable us to monitor shipments in real-time, ensuring that goods are delivered on time and in perfect condition. With our robust logistics infrastructure in place, we are confident in our ability to meet the evolving needs of our customers worldwide, while maintaining a strong commitment to quality, reliability, and customer satisfaction.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6H9v2h2v2h2v-2h2v-2h-2V7z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">PROFESSIONAL</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 0 0-.48-.41h-3.84a.49.49 0 0 0-.48.41l-.36 2.54c-.59.24-1.12.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22l-1.92 3.32a.49.49 0 0 0 .12.61l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32a.49.49 0 0 0 .59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.49.49 0 0 0 .48.41h3.84a.49.49 0 0 0 .48-.41l.36-2.54c.59-.24 1.12-.56 1.62-.94l2.39.96a.49.49 0 0 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">EFFICIENT</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a1 1 0 0 0-1.41 0l-.59.59a1 1 0 0 0 0 1.41l3.59 3.59a1 1 0 0 0 1.41 0L17 11.3a1 1 0 0 0 0-1.41l-.59-.59a1 1 0 0 0-1.41 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">HONEST</p>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477335/bagstoryCustom/Screenshot_15_csqxb1.png"
                alt="Shipping Container 4"
                className="rounded-lg shadow-md w-full max-w-2xl h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team Section */}
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="mb-6">
            <img
              src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477384/bagstoryCustom/Screenshot_19_uoyuwh.png"
              alt="Customs Clearance Banner"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div ref={bonusTextRef}>
            <h3 className="text-2xl font-semibold mb-4">Expert Team Ensures Seamless Customs Clearance and Transportation</h3>
            <p className="text-gray-700 mb-6">
              Upon arrival at the destination port, we understand the utmost importance of efficient customs clearance and safe delivery to ensure a smooth and hassle-free experience. To ensure this, we have assigned experienced professionals to oversee every critical stage of the process. Our team of experts will meticulously prepare all necessary documentation in advance, maintaining close communication with local customs authorities to guarantee a seamless procedure.
            </p>
            <p className="text-gray-700 mb-6">
              As soon as clearance is granted, our logistics specialists will promptly initiate the delivery protocol, striving to hand over the goods to the designated recipient within the shortest possible timeframe. This meticulous approach significantly minimizes the risk of human error or delays, thereby enhancing the overall quality of our service and customer satisfaction.
            </p>
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477624/bagstoryCustom/14_ytrqi6.png"
                alt="Shipping Port 2"
                className="rounded-lg shadow-md w-full max-w-4xl h-auto object-cover"
              />
            </div>
            <p className="text-gray-700 mb-6">
              Our dedicated team’s expertise in customs clearance and transportation management enables us to navigate complex regulatory requirements with ease, ensuring compliance with all relevant laws and regulations. By leveraging their extensive knowledge and experience, we are able to provide our customers with a streamlined and efficient experience, characterized by transparency, reliability, and personalized attention to detail.
            </p>
            <p className="text-gray-700 mb-6">
              Furthermore, our state-of-the-art tracking systems and real-time monitoring capabilities enable us to keep our customers informed every step of the way, providing them with complete visibility and control over their shipments. With every step of the process managed by the expert team at the helm, we are confident in our ability to deliver exceptional service quality, meeting and exceeding the expectations of our valued customers worldwide.
            </p>
            <div className="flex justify-center mb-6">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744477627/bagstoryCustom/15_qtaifn.png"
                alt="Logistics Team"
                className="rounded-lg shadow-md w-full max-w-4xl h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Original Welcome to BagStory Section */}
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div ref={welcomeHeaderRef} className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">WELCOME TO BAGSTORY</h6>
            <h2 className="text-3xl font-bold mb-3">Unveil Your Style, Embrace Sustainability!</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our eco-friendly non-woven bags—perfect for your business, events, or daily use!
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                ref={welcomeImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744076755/BagStory/eco-packaging-03-800x586_ujtfqu.jpg"
                alt="Eco-Friendly Tote Bag"
                className="rounded-lg shadow-md"
              />
            </div>
            <div ref={welcomeTextRef} className="order-1 lg:order-2">
              <h3 className="text-2xl font-semibold mb-4">Explore Our Collection</h3>
              <p className="text-gray-700 mb-6">
                BagStory offers a diverse range of non-woven bags, crafted with eco-friendly materials. Customize them with your logo to make a statement while supporting sustainability.
              </p>
              <p className="text-gray-700 mb-8">
                Join our mission to reduce plastic waste and embrace a greener lifestyle. Let’s create a world where style and sustainability coexist harmoniously.
              </p>
              <Link to="/distributor">
                <Button className="bg-eco hover:bg-eco-dark">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;