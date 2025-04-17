import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "99 Cents City Line",
    location: "Long Island",
    quote:
      "Top-notch Bags for 99 Cents Store! These non-woven shopping bags are a game-changer for our 99 cents store. They're strong, reliable, and the customers adore them. Five stars for quality and affordability!",
    rating: 5,
  },
  {
    name: "Best Liquid Store",
    location: "Manhattan",
    quote:
      "Outstanding Quality! As a wholesale buyer for our liquor store, we are extremely pleased with the non-woven shopping bags. Sturdy, durable, and the perfect size. Definitely, a 5-star product!",
    rating: 5,
  },
  {
    name: "711 Seven-Eleven",
    location: "Queens, NY",
    quote:
      "Impressive Quality! As a 7-Eleven owner, I can’t emphasize enough how great these non-woven bags are. They withstand heavy use, making them perfect for our convenience store. A definite 5-star product!",
    rating: 5,
  },
  {
    name: "GreenMart",
    location: "Brooklyn, NY",
    quote:
      "Fantastic Product! These non-woven bags are perfect for our grocery store. They’re eco-friendly, strong, and our customers love the design. A solid 5-star addition to our business!",
    rating: 5,
  },
  {
    name: "Sunny Pharmacy",
    location: "Bronx, NY",
    quote:
      "Highly Recommend! The non-woven bags are a great fit for our pharmacy. They’re durable and spacious enough for customer purchases. We’re thrilled with this 5-star product!",
    rating: 5,
  },
  {
    name: "QuickStop Deli",
    location: "Staten Island, NY",
    quote:
      "Amazing Bags! These non-woven shopping bags have been a hit at our deli. They’re tough, reusable, and our customers appreciate the quality. Easily a 5-star product!",
    rating: 5,
  },
  {
    name: "Urban Outfitters",
    location: "Jersey City, NJ",
    quote:
      "Great Quality! We switched to these non-woven bags for our retail store, and they’ve been perfect. Stylish, sturdy, and sustainable—definitely a 5-star choice for us!",
    rating: 5,
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Testimonials = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <section className="section-padding bg-paper overflow-hidden" ref={ref}>
      <div className="container-custom">
        <motion.div
          className="flex gap-6 md:gap-8 animate-scroll"
          initial="hidden"
          animate={controls}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <motion.div
              key={index}
              className="min-w-[300px] md:min-w-[400px] bg-white rounded-lg p-6 shadow-md mx-2 cursor-pointer"
              custom={index % testimonials.length}
              variants={cardVariant}
            >
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;