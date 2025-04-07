
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  isDistributor?: boolean;
  onQuoteRequest?: (product: Product) => void;
};

const ProductCard = ({ product, isDistributor = false, onQuoteRequest }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleQuoteRequest = () => {
    if (onQuoteRequest) {
      onQuoteRequest(product);
    }
  };

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
            <p className="text-eco font-bold mb-2">${product.price.toFixed(2)}</p>
          ) : (
            <div className="mb-2">
              <p className="text-eco font-bold">${product.bulkPrice.toFixed(2)}/unit</p>
              <p className="text-sm text-muted-foreground">MOQ: {product.moq} units</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        {!isDistributor ? (
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-eco hover:bg-eco-dark"
          >
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
};

export default ProductCard;
