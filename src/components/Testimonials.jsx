// src/components/Testimonials.jsx
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Owner, Green Boutique",
    quote: "Eco Packaging Products Inc. has transformed our packaging with their sustainable solutions. Our customers love the quality and eco-friendly design!",
    rating: 5,
  },
  {
    name: "Michael Carter",
    role: "Manager, FreshMart",
    quote: "The reusable grocery bags are a game-changer. Durable, stylish, and environmentally friendly—exactly what we needed for our store.",
    rating: 4,
  },
  {
    name: "Emily Davis",
    role: "Event Planner",
    quote: "Their custom print gift bags added a perfect touch to our events. The team was quick to deliver, and the quality exceeded our expectations.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-eco-paper">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-eco font-medium mb-2">TESTIMONIALS</h6>
          <h2 className="text-3xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Hear from businesses that have made the switch to sustainable packaging with Eco Packaging Products Inc.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;