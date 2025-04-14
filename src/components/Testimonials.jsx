// src/components/Testimonials.jsx
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "99 cents City Line",
   location: "Long Island",
    quote: "Top-notch Bags for 99 Cents Store! These non-woven shopping bags are a game-changer for our 99 cents store. They're strong, reliable, and the customers adore them. Five stars for quality and affordability!",
    rating: 5,
  },
  {
    name: "Best Liquid Store",
   location: "Manhattan",
    quote: "Outstanding Quality! As a wholesale buyer for our liquor store, we are extremely pleased with the non-woven shopping bags. Sturdy, durable, and the perfect size. Definitely, a 5-star product!",
    rating: 5,
  },
  {
    name: "711 Seven-Eleven",
   location: "Queens, NY",
    quote: "Impressive Quality! As a 7-Eleven owner, I can’t emphasize enough how great these non-woven bags are. They withstand heavy use, making them perfect for our convenience store. A definite 5-star product!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
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
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;