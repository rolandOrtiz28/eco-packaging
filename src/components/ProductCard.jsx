import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

function ProductCard({ product, isDistributor = false, onQuoteRequest }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleQuoteRequest = () => {
    if (onQuoteRequest) {
      onQuoteRequest(product);
    }
  };

  // Function to extract the number of units per case from the pricing tier's case string
  const extractUnitsPerCase = (caseString) => {
    const match = caseString.match(/\((\d+)pcs\)/);
    return match ? parseInt(match[1], 10) : product.moq; // Fallback to moq if not found
  };

  // Calculate the per-case price for the distributor mode (bulk price)
  const unitsPerCase = product.moq; // Number of units per case (from moq)
  const bulkPricePerCase = (product.bulkPrice * unitsPerCase).toFixed(2); // Total price for 6 to 50 cases

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden card-hover">
      <Link to={`/retail/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          {!isDistributor ? (
            <div className="mb-4">
              {/* Display the number of pieces in 1 case in green text */}
              <p className="text-eco font-bold text-sm mb-1">
                1 Case: {product.moq}pcs
              </p>
              {/* Display pricing tiers */}
              {product.details.pricing.map((priceTier, index) => {
                const units = extractUnitsPerCase(priceTier.case);
                const pricePerCase =
                  typeof priceTier.pricePerUnit === "number"
                    ? (priceTier.pricePerUnit * units).toFixed(2)
                    : "Please contact office"; // For 50+ cases
                return (
                  <p key={index} className="text-sm text-gray-700">
                    {priceTier.case.replace(/\(.*?\)/, "")}:{" "} {/* Remove (1000pcs) from the case string */}
                    {typeof priceTier.pricePerUnit === "number" ? (
                      <>
                        <span>¢ {priceTier.pricePerUnit.toFixed(2)} ea - </span>
                        <span className="text-eco font-bold">${pricePerCase} per case</span>
                      </>
                    ) : (
                      <span className="text-eco font-bold">{pricePerCase}</span>
                    )}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-eco font-bold text-sm">${bulkPricePerCase} per case</p>
              <p className="text-sm text-muted-foreground">MOQ: {product.moq} units per case</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          <div className="text-sm text-gray-700 mb-2">
          {product.details.note && <p><strong>Note:</strong> {product.details.note}</p>}
            <p><strong>Size:</strong> {product.details.size}</p>
            <p><strong>Color:</strong> {product.details.color}</p>
            <p><strong>Material:</strong> {product.details.material}</p>
            <p><strong>Use Case:</strong> {product.details.useCase}</p>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        {!isDistributor ? (
          <Button onClick={handleAddToCart} className="w-full bg-eco hover:bg-eco-dark">
            Add to Cart
          </Button>
        ) : (
          <Button
            onClick={handleQuoteRequest}
            variant="outline"
            className="w-full border-eco text-eco hover:bg-eco/10"
          >
            Request Quote
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;