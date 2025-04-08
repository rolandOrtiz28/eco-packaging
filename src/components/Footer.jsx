import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-eco text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-eco font-bold text-xl">E</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Eco Packaging</h3>
                <p className="text-xs opacity-80">Products Inc.</p>
              </div>
            </div>
            <p className="mb-6 text-sm opacity-90">
              Leading the way in sustainable packaging solutions since 2010. We design, produce and distribute premium non-woven bag solutions for businesses worldwide.
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
              <li>
                <Link to="/" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/distributor" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Shopping Bags
                </Link>
              </li>
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Grocery Bags
                </Link>
              </li>
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Gift Bags
                </Link>
              </li>
              <li>
                <Link to="/retail" className="text-sm opacity-90 hover:opacity-100 hover:text-eco-accent transition-colors">
                  Custom Prints
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm opacity-90">
                  123 Green Street, Suite 456<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <p className="text-sm opacity-90">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <p className="text-sm opacity-90">info@ecopackagingproducts.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Eco Packaging Products Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;