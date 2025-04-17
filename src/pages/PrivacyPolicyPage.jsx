import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Privacy Policy Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">PRIVACY POLICY</h6>
            <h2 className="text-3xl font-bold mb-3">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              At BagStory, we value your privacy and are committed to protecting your personal information.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 items-start">
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-eco mr-3" />
                  <h3 className="text-2xl font-semibold">Privacy Policy</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  This Privacy Policy explains how EcoLogic Solutions LLC ("BagStory," "we," "us," or "our") collects, uses, and protects your personal information when you visit our website, make a purchase, or interact with us. By using our services, you agree to the terms outlined in this policy.
                </p>
                <h4 className="text-xl font-semibold mb-2">1. Information We Collect</h4>
                <ul className="text-gray-700 space-y-3 mb-4">
                  <li>
                    <strong>Personal Information:</strong> When you place an order, contact us, or subscribe to our newsletter, we may collect your name, email address, phone number, billing address, shipping address, and payment information.
                  </li>
                  <li>
                    <strong>Non-Personal Information:</strong> We may collect data such as your IP address, browser type, and browsing behavior on our website to improve our services.
                  </li>
                </ul>
                <h4 className="text-xl font-semibold mb-2">2. How We Use Your Information</h4>
                <ul className="text-gray-700 space-y-3 mb-4">
                  <li>To process and fulfill your orders, including shipping and payment processing.</li>
                  <li>To communicate with you about your orders, inquiries, or promotional offers.</li>
                  <li>To improve our website, products, and services based on your feedback and browsing behavior.</li>
                  <li>To comply with legal obligations and protect our rights.</li>
                </ul>
                <h4 className="text-xl font-semibold mb-2">3. Sharing Your Information</h4>
                <p className="text-gray-700 mb-4">
                  We do not sell or rent your personal information to third parties. We may share your information with trusted service providers (e.g., payment processors, shipping companies) to fulfill your orders, but only to the extent necessary. We may also disclose information if required by law.
                </p>
                <h4 className="text-xl font-semibold mb-2">4. Data Security</h4>
                <p className="text-gray-700 mb-4">
                  We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
                <h4 className="text-xl font-semibold mb-2">5. Your Rights</h4>
                <ul className="text-gray-700 space-y-3 mb-4">
                  <li>You may request access to, correction of, or deletion of your personal information by contacting us at contact@bagstoryusa.com.</li>
                  <li>You can unsubscribe from our newsletter at any time by clicking the "unsubscribe" link in our emails.</li>
                </ul>
                <h4 className="text-xl font-semibold mb-2">6. Cookies</h4>
                <p className="text-gray-700 mb-4">
                  We use cookies to enhance your experience on our website, such as remembering your preferences and tracking site usage. You can disable cookies in your browser settings, but this may affect the functionality of our site.
                </p>
                <h4 className="text-xl font-semibold mb-2">7. Changes to This Policy</h4>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated policy will take effect immediately upon posting.
                </p>
                <h4 className="text-xl font-semibold mb-2">8. Contact Us</h4>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  Email: contact@bagstoryusa.com
                  <br />
                  Phone: +1 (516) 360-9888
                  <br />
                  Address: 176 Central Ave Suite 9, Farmingdale, New York, NY 11735, United States
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button className="bg-eco hover:bg-eco-dark">
                Contact Us for More Information
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;