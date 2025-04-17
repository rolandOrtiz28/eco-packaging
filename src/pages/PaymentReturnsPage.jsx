import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, List, CheckSquare, RotateCcw } from "lucide-react";

const PaymentReturnsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Payment & Returns Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-eco font-medium mb-2">PAYMENT & RETURNS</h6>
            <h2 className="text-3xl font-bold mb-3">Our Payment and Return Policies</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Understand our terms for payments, returns, and more to ensure a smooth experience with BagStory.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-8 w-8 text-eco mr-3" />
                  <h3 className="text-2xl font-semibold">Payment Terms</h3>
                </div>
                <ul className="text-gray-700 space-y-3">
                  <li>
                    Physical payment must be made before or upon delivery in cash or check payable to EcoLogic Solutions LLC
                  </li>
                  <li>
                    Electronic payments can be in the form of credit card, debit card, or Zelle® to contact@bagstoryusa.com.
                  </li>
                  <li>
                    Credit card and debit card payments will impose a 3.75% processing fee.
                  </li>
                  <li>
                    Declined payments will impose penalties such as a returned payment fee of $55 or termination of business.
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <List className="h-8 w-8 text-eco mr-3" />
                  <h3 className="text-2xl font-semibold">General</h3>
                </div>
                <ul className="text-gray-700 space-y-3">
                  <li>
                    Please email questions, concerns, or sample/brochure requests to contact@bagstoryusa.com.
                  </li>
                  <li>
                    Special packaging requests may require additional charges and are subject to availability.
                  </li>
                  <li>
                    Packaging size limitations may alter creasing in bags, this is the nature of the material and can be reverted with room temperature.
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <CheckSquare className="h-8 w-8 text-eco mr-3" />
                  <h3 className="text-2xl font-semibold">Referral Program (Starting December 9th, 2022)</h3>
                </div>
                <ul className="text-gray-700 space-y-3">
                  <li>
                    Existing customers referring new customers placing orders of 5 cases or more of any of our products are eligible to receive a one-time $25 credit on a future order or $25 VISA gift card provided to the existing customer who qualifies for the referral.
                  </li>
                  <li>
                    New customer must provide referral information before placing the order to be eligible.
                  </li>
                  <li>
                    If a new customer owns more than one storefront, all unique locations may be eligible.
                  </li>
                  <li>
                    We reserve the right to reject any form of misuse of the program.
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <RotateCcw className="h-8 w-8 text-eco mr-3" />
                  <h3 className="text-2xl font-semibold">Returns</h3>
                </div>
                <ul className="text-gray-700 space-y-3">
                  <li>
                    Please email contact@bagstoryusa.com to initiate a return and please allow up to 14 days for the mailed check to be complete.
                  </li>
                  <li>
                    Returns accepted within 10 days of the delivery date must be unused, in the original packaging, and subject to a 25% restocking fee.
                  </li>
                  <li>
                    Buyer is responsible for return shipping with a valid tracking.
                  </li>
                  <li>
                    Custom print items are NOT eligible for return.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button className="bg-eco hover:bg-eco-dark">
                Contact Us for More Details
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentReturnsPage;