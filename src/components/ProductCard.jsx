import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductCard({ product, isDistributor = false, onQuoteRequest }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleQuoteRequest = (e) => {
    e.preventDefault();
    if (onQuoteRequest) {
      onQuoteRequest(product);
    }
  };

  const unitsPerCase = product.pcsPerCase || 1;
  const pricingTiers = product.details?.pricing || [];

  let displayPrice = "Contact office";

  if (isDistributor) {
    if (!isNaN(product.bulkPrice)) {
      displayPrice = `$${(product.bulkPrice * unitsPerCase).toFixed(2)} per case`;
    }
  } else {
    const firstValidTier = pricingTiers.find(
      (tier) => typeof tier.pricePerUnit === "number" && !isNaN(tier.pricePerUnit)
    );
    if (firstValidTier) {
      displayPrice = `$${(firstValidTier.pricePerUnit * unitsPerCase).toFixed(2)} per case`;
    }
  }

  return (
    <div className="group bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden flex flex-col h-full relative">
      <Link
        to={`/retail/product/${product.id}`}
        className="flex flex-col flex-grow"
      >
        {/* Product Image */}
        <div className="relative h-52 bg-white flex items-center justify-center p-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Icons (Retail Only) */}
          {!isDistributor && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={handleAddToCart}
                className="p-2 bg-white rounded-full shadow hover:bg-[#25553d] hover:text-white transition"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <Link
                to={`/retail/product/${product.id}`}
                className="p-2 bg-white rounded-full shadow hover:bg-[#25553d] hover:text-white transition"
                title="View Product"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <p className="text-xs text-gray-500 mb-1">
            {product.details?.useCase || "General"}
          </p>

          {/* Name */}
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#25553d] line-clamp-2 mb-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>

          {/* Price */}
          <p className="text-sm font-bold text-[#25553d] mt-auto">{displayPrice}</p>
        </div>
      </Link>

      {/* Request Quote Button (Distributor Only) */}
      {isDistributor && (
        <div className="p-4">
          <Button
            onClick={handleQuoteRequest}
            variant="outline"
            className="w-full border-[#25553d] text-[#25553d] hover:bg-[#A4C3A2]/10 transition font-medium"
          >
            Request Quotation
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
