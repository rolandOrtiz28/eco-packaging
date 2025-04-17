import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitSubscriber } from "@/utils/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await submitSubscriber({ email });
      setMessage("Subscribed successfully! Check your email.");
      setEmail("");
    } catch (err) {
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-eco text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 ">
              <div className="w-lg flex items-center justify-center">
                <img
                  className="w-64"
                  src="https://res.cloudinary.com/rolandortiz/image/upload/v1744909615/bagstoryCustom/Logo_1_dfj3fg.png"
                  alt=""
                />
              </div>
             
            </div>
            <p className="mb-6 text-sm opacity-90">
              Leading the way in sustainable packaging solutions since 2010. We design, produce and
              distribute premium non-woven bag solutions for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-eco-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-eco-accent transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-eco-accent transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-eco-accent transition-colors" aria-label="Linkedin">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Home</Link></li>
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Shop</Link></li>
              <li><Link to="/distributor" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Bulk Orders</Link></li>
              <li><Link to="/blog" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Contact</Link></li>
              <li><Link to="/payment-returns" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Payment & Returns</Link></li> {/* Add this line */}
              <li><Link to="/privacy-policy" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Privacy Policy</Link></li> {/* Add this line */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Products</h3>
            <ul className="space-y-3">
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Shopping Bags</Link></li>
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Tote Bags</Link></li>
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Grocery Bags</Link></li>
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Gift Bags</Link></li>
              <li><Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">Custom Prints</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm opacity-90">
                  176 Central Ave Suite 9 Farmingdale<br />
                  New York, NY 11735<br />
                  United States
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <p className="text-sm opacity-90">+1 (516) 360-9888</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <p className="text-sm opacity-90">contact@bagstoryusa.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex justify-center gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black"
                required
              />
              <Button className="bg-white text-eco hover:text-white" type="submit" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {message && <p className="text-sm mt-2">{message}</p>}
          </div>
          <p className="text-sm opacity-80 text-center">
            © {new Date().getFullYear()} EcoLogic Solutions LLC All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;