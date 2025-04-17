import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  // Refs for GSAP animations (same as original)
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

  // GSAP animations (same as original)
  useEffect(() => {
    // ... (keep all your existing GSAP animations)
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-eco to-eco-dark py-24 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About EcoLogic Solutions LLC</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Pioneering sustainable packaging solutions with innovation, quality, and environmental responsibility
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/products">
              <Button variant="secondary" className="px-8 py-6 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-white text-eco hover:bg-gray-100 px-8 py-6 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 backdrop-blur-sm"></div>
      </section>

      {/* Welcome to EcoLogic Solutions LLC Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img
                ref={makeKnownImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476187/bagstoryCustom/Image_20250412214739_gkq8fd.jpg"
                alt="Eco-Friendly Packaging"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div ref={makeKnownTextRef} className="lg:w-1/2">
              <div className="inline-block bg-eco/10 text-eco px-4 py-2 rounded-full mb-4 font-medium">
                Our Company
              </div>
              <h2 className="text-3xl font-bold mb-6">Welcome to EcoLogic Solutions LLC</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  EcoLogic Solutions LLC is a leading packaging company strategically located in New York, specializing in designing, manufacturing, and distributing high-quality non-woven bag solutions. Our unique business model leverages a robust supply chain network to deliver exceptional products and services.
                </p>
                <p>
                  With unwavering commitment to innovation, quality, and customer satisfaction, we've developed core advantages that differentiate us in the market while providing clients with unparalleled service experiences.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3 text-eco-dark">Our Five Key Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-eco mr-2">✓</span>
                      <span>Cutting-edge product design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco mr-2">✓</span>
                      <span>Stringent quality control measures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco mr-2">✓</span>
                      <span>Flexible manufacturing capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco mr-2">✓</span>
                      <span>Reliable logistics and distribution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco mr-2">✓</span>
                      <span>Dedicated customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Built Ecosystem Section */}
      <section className="py-20 bg-eco-paper">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div ref={outreachTextRef} className="lg:w-1/2 order-2 lg:order-1">
              <div className="inline-block bg-eco/10 text-eco px-4 py-2 rounded-full mb-4 font-medium">
                Sustainable Production
              </div>
              <h2 className="text-3xl font-bold mb-6">Self-Built Ecosystem: Achieving Circular Economy</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  In today's competitive global landscape, our self-built production ecosystem in China maintains a comprehensive closed-loop system. We manufacture non-woven fabric raw materials, print finished products, and produce final bags all under one roof.
                </p>
                <p>
                  This integrated approach ensures product quality stability while significantly enhancing production efficiency and reducing environmental impact.
                </p>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-semibold mb-2 text-eco-dark">Closed-Loop Benefits:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-eco/5 p-3 rounded-lg">
                      <div className="font-medium text-eco-dark">Quality Control</div>
                      <div className="text-sm">End-to-end oversight</div>
                    </div>
                    <div className="bg-eco/5 p-3 rounded-lg">
                      <div className="font-medium text-eco-dark">Efficiency</div>
                      <div className="text-sm">Streamlined processes</div>
                    </div>
                    <div className="bg-eco/5 p-3 rounded-lg">
                      <div className="font-medium text-eco-dark">Sustainability</div>
                      <div className="text-sm">Reduced waste</div>
                    </div>
                    <div className="bg-eco/5 p-3 rounded-lg">
                      <div className="font-medium text-eco-dark">Cost Savings</div>
                      <div className="text-sm">Competitive pricing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  ref={outreachImageRef}
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476174/bagstoryCustom/Image_20250412214955_cnnwbl.jpg"
                  alt="Production Ecosystem 1"
                  className="rounded-xl shadow-md w-full h-48 lg:h-60 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476187/bagstoryCustom/Image_20250412215019_opa8te.jpg"
                  alt="Production Ecosystem 2"
                  className="rounded-xl shadow-md w-full h-48 lg:h-60 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476182/bagstoryCustom/Image_20250412214824_skxpow.jpg"
                  alt="Production Ecosystem 3"
                  className="rounded-xl shadow-md w-full h-48 lg:h-60 object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476183/bagstoryCustom/Image_20250412215005_dkzr6c.jpg"
                  alt="Production Ecosystem 4"
                  className="rounded-xl shadow-md w-full h-48 lg:h-60 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4 h-[450px]">
                <div className="relative group">
                  <img
                    ref={boostImageRef}
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476197/bagstoryCustom/Image_20250412215022_wpvlmg.jpg"
                    alt="Sustainability 1"
                    className="rounded-xl shadow-md w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group mt-auto">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476179/bagstoryCustom/Image_20250412214828_cqzixl.jpg"
                    alt="Sustainability 2"
                    className="rounded-xl shadow-md w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476706/bagstoryCustom/Screenshot_13_q4pavh.png"
                    alt="Sustainability 3"
                    className="rounded-xl shadow-md w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative group">
                  <img
                    src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476706/bagstoryCustom/Screenshot_13_q4pavh.png"
                    alt="Sustainability 4"
                    className="rounded-xl shadow-md w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
            <div ref={boostTextRef} className="lg:w-1/2">
              <div className="inline-block bg-eco/10 text-eco px-4 py-2 rounded-full mb-4 font-medium">
                Environmental Commitment
              </div>
              <h2 className="text-3xl font-bold mb-6">Driving Sustainability Through Innovation</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Our recycling program collects and reuses discarded materials, transforming them into PP pellets that re-enter our production cycle. This circular economy model reduces waste, minimizes environmental impact, and lowers costs.
                </p>
                <div className="bg-eco/5 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-eco-dark">Sustainability Metrics</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-eco">75%</div>
                      <div className="text-sm">Waste Reduction</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-eco">100%</div>
                      <div className="text-sm">Recycled Materials</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-eco">40%</div>
                      <div className="text-sm">Cost Savings</div>
                    </div>
                  </div>
                </div>
                <p>
                  By embracing sustainable practices, we offer high-quality products at competitive prices while contributing to a greener future. Our environmental commitment extends across all operations, from material sourcing to final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Section */}
      <section className="py-20 bg-eco-paper">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
            <div className="lg:w-1/2">
              <div className="inline-block bg-eco/10 text-eco px-4 py-2 rounded-full mb-4 font-medium">
                Logistics Network
              </div>
              <h2 className="text-3xl font-bold mb-6">Comprehensive Warehouse & Distribution</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Our Eastern U.S. distribution center enables timely, efficient deliveries with expert route planning. Real-time tracking provides complete shipment visibility, earning trust through transparency.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-eco text-white p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-eco-dark">Advanced Technology</h4>
                    <p className="text-sm">Real-time logistics tracking and reporting</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476179/bagstoryCustom/Image_20250412214828_cqzixl.jpg"
                  alt="Warehouse 1"
                  className="col-span-2 row-span-2 rounded-xl shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476175/bagstoryCustom/Image_20250412215009_k7zcpd.jpg"
                  alt="Warehouse 2"
                  className="col-span-2 row-span-1 rounded-xl shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476175/bagstoryCustom/Image_20250412214832_ltmjq3.jpg"
                  alt="Warehouse 3"
                  className="col-span-1 row-span-1 rounded-xl shadow-md w-full h-full object-cover"
                />
                <img
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744476171/bagstoryCustom/Image_20250412214837_vlmizn.jpg"
                  alt="Warehouse 4"
                  className="col-span-1 row-span-1 rounded-xl shadow-md w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div ref={bonusTextRef} className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-semibold mb-6 text-center">Seamless Logistics Experience</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-eco/10 text-eco p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Receipt & Processing</h4>
                      <p className="text-sm text-gray-600">Efficient goods receipt and inventory management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-eco/10 text-eco p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Delivery Execution</h4>
                      <p className="text-sm text-gray-600">Meticulously planned and executed deliveries</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-eco/10 text-eco p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Technology Integration</h4>
                      <p className="text-sm text-gray-600">State-of-the-art tracking and visibility</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-eco/10 text-eco p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Quality Assurance</h4>
                      <p className="text-sm text-gray-600">Reduced errors and increased efficiency</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-eco to-eco-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the E.P.P.I Difference?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join our growing list of satisfied clients who trust us for their sustainable packaging needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-white text-eco hover:bg-gray-100 px-8 py-6 text-lg font-medium">
                Request a Quote
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="border-white text-eco hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-medium">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Original Welcome to BagStory Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div ref={welcomeHeaderRef} className="text-center mb-12">
            <div className="inline-block bg-eco/10 text-eco px-4 py-2 rounded-full mb-4 font-medium">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold mb-3">Unveil Your Style, Embrace Sustainability!</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our eco-friendly non-woven bags—perfect for your business, events, or daily use!
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img
                ref={welcomeImageRef}
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744076755/BagStory/eco-packaging-03-800x586_ujtfqu.jpg"
                alt="Eco-Friendly Tote Bag"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div ref={welcomeTextRef} className="lg:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Explore Our Collection</h3>
              <div className="space-y-6 text-gray-700">
                <p>
                  BagStory offers a diverse range of non-woven bags, crafted with eco-friendly materials. Customize them with your logo to make a statement while supporting sustainability.
                </p>
                <p>
                  Join our mission to reduce plastic waste and embrace a greener lifestyle. Let's create a world where style and sustainability coexist harmoniously.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/distributor">
                    <Button className="bg-eco hover:bg-eco-dark px-8 py-6">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Order Now
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="border-eco text-eco hover:bg-eco/10 px-8 py-6">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;