import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* About Us Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">ABOUT US</h6>
            <h2 className="text-3xl font-bold mb-3">From Long Island to Your Hands: Our Story</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Learn more about BagStory and our commitment to greener, more sustainable choices.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                alt="Sustainable packaging"
                className="rounded-lg shadow-md"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-6">
                At BagStory, we are more than just a brand—we are a commitment to greener, more eco-friendly choices. Based in Long Island, New York, we specialize in designing and manufacturing high-quality non-woven bags that are sustainable, durable, and stylish.
              </p>
              <p className="text-gray-700 mb-6">
                Our mission is to empower businesses and individuals to make a positive impact on the environment. We use eco-friendly materials like non-woven fabrics to create reusable bags that reduce waste and promote a circular economy, all while offering customization to reflect your unique style.
              </p>
              <p className="text-gray-700 mb-8">
                From small boutiques to large corporations, we’re here to help you embrace sustainability without compromising on quality or design. Join us in our journey to create a cleaner, greener future—one bag at a time.
              </p>
              <Link to="/contact">
                <Button className="bg-eco hover:bg-eco-dark">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

   
      <section className="section-padding bg-eco-paper">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">WELCOME TO BAGSTORY</h6>
            <h2 className="text-3xl font-bold mb-3">Unveil Your Style, Embrace Sustainability!</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our eco-friendly non-woven bags—perfect for your business, events, or daily use!
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744076755/BagStory/eco-packaging-03-800x586_ujtfqu.jpg"
                alt="Eco-Friendly Tote Bag"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 lg:order-2">
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