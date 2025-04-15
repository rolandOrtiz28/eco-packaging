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

  const extractUnitsPerCase = (caseString) => {
    const match = caseString.match(/\((\d+)(?:pcs|pc)\)/);
    return match ? parseInt(match[1], 10) : product.pcsPerCase;
  };

  const unitsPerCase = product.pcsPerCase;
  const bulkPricePerCase = (product.bulkPrice * unitsPerCase).toFixed(2);

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden card-hover flex flex-col h-full">
      <Link to={`/retail/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-md mb-2 line-clamp-1">{product.name}</h3>
          
          {!isDistributor ? (
            <div className="mb-3">
              <p className="text-eco font-bold text-sm mb-2">
                1 Case: {product.pcsPerCase}pcs
              </p>
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
                    <p key={index} className="text-sm text-gray-700 mb-1">
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
            <div className="mb-3">
              <p className="text-eco font-bold text-sm">${bulkPricePerCase} per case</p>
              <p className="text-sm text-muted-foreground">MOQ: {product.moq} Cases</p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          
          <div className="text-sm text-gray-700 space-y-1">
            {product.details.note && (
              <p className="line-clamp-1">
                <strong>Note:</strong> {product.details.note}
              </p>
            )}
            <p><strong>Size:</strong> {product.details.size}</p>
            <p><strong>Color:</strong> {product.details.color}</p>
            <p><strong>Material:</strong> {product.details.material}</p>
            <p><strong>Use Case:</strong> {product.details.useCase}</p>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        {!isDistributor ? (
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-eco hover:bg-eco-dark text-white"
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            onClick={handleQuoteRequest}
            variant="outline"
            className="w-full border-eco text-eco hover:bg-eco/10 hover:text-eco"
          >
            Request Quote
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;