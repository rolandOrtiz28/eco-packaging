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
    // Match both "pcs" and "pc" (e.g., "(500pcs)" or "(500pc)")
    const match = caseString.match(/\((\d+)(?:pcs|pc)\)/);
    return match ? parseInt(match[1], 10) : product.pcsPerCase; // Fallback to pcsPerCase if not found
  };

  // Calculate the per-case price for the distributor mode (bulk price)
  const unitsPerCase = product.pcsPerCase; // Use pcsPerCase instead of moq
  const bulkPricePerCase = (product.bulkPrice * unitsPerCase).toFixed(2); // Total price per case using bulkPrice

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden card-hover">
      <Link to={`/retail/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-md mb-1 line-clamp-1">{product.name}</h3>
          {!isDistributor ? (
            <div className="mb-4">
              {/* Display the number of pieces in 1 case in green text */}
              <p className="text-eco font-bold text-sm mb-1">
                1 Case: {product.pcsPerCase}pcs
              </p>
              {/* Display pricing tiers */}
              {(() => {
  const pricing = product.details?.pricing;
  if (!Array.isArray(pricing)) {
    console.warn("⚠️ Invalid pricing data for product:", product);
    return <p className="text-red-500 text-sm">⚠️ Pricing unavailable</p>;
  }

  return pricing.map((priceTier, index) => {
    const units = extractUnitsPerCase(priceTier.case);
    const parsedPricePerUnit = parseFloat(priceTier.pricePerUnit);
    const pricePerCase = !isNaN(parsedPricePerUnit)
      ? (parsedPricePerUnit * units).toFixed(2)
      : "Please contact office";

    return (
      <p key={index} className="text-sm text-gray-700">
        {priceTier.case.replace(/\(.*?\)/, "")}:{" "}
        {!isNaN(parsedPricePerUnit) ? (
          <>
            <span>¢ {parsedPricePerUnit.toFixed(2)} ea - </span>
            <span className="text-eco font-bold">${pricePerCase} per case</span>
          </>
        ) : (
          <span className="text-eco font-bold">{pricePerCase}</span>
        )}
      </p>
    );
  });
})()}
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-eco font-bold text-sm">${bulkPricePerCase} per case</p>
              <p className="text-sm text-muted-foreground">MOQ: {product.moq} Cases</p>
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