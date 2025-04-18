import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Check, Truck, Shield, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { getProduct, getRelatedProducts, api } from "@/utils/api";
import { useCart } from "@/hooks/useCart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [settings, setSettings] = useState({
    freeDeliveryThreshold: { type: 'flat', value: 50 },
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const productData = await getProduct(id);
        setProduct(productData);
        const related = await getRelatedProducts(id);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        setSettings({
          freeDeliveryThreshold: response.data.freeDeliveryThreshold || { type: 'flat', value: 50 },
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to fetch settings");
      }
    };

    fetchProductData();
    fetchSettings();
    setQuantity(1);
    setActiveImageIndex(0);
  }, [id]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleAddToCart = () => {
    if (product) {
      if (!product.inStock) {
        toast.error("This product is out of stock and cannot be added to the cart.");
        return;
      }
      addToCart(product, quantity);
      toast.success(`${product.name} added to your cart`);
    }
  };
  const handleImageChange = (index) => setActiveImageIndex(index);

  const extractUnitsPerCase = (caseString) => {
    const match = caseString.match(/\((\d+)(?:pcs|pc)\)/);
    return match ? parseInt(match[1], 10) : product?.pcsPerCase || 1;
  };

  const calculatePricePerCase = () => {
    if (!product || !product.details || !product.details.pricing || product.details.pricing.length === 0) {
      return "N/A";
    }
    const firstTier = product.details.pricing[0];
    const units = extractUnitsPerCase(firstTier.case);
    const pricePerUnit = parseFloat(firstTier.pricePerUnit);
    if (isNaN(pricePerUnit)) {
      return "Please contact office";
    }
    return (pricePerUnit * units).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-full mt-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/retail">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const pricePerCase = calculatePricePerCase();

  return (
    <div className="bg-background">
      <div className="bg-muted py-3">
        <div className="container-custom">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-eco">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/retail" className="hover:text-eco">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="bg-white rounded-lg overflow-hidden mb-4 h-80 md:h-96">
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`w-20 h-20 rounded-md border-2 overflow-hidden flex-shrink-0 ${
                      activeImageIndex === index ? "border-eco" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl text-eco font-bold mb-4">
                {pricePerCase === "N/A" || pricePerCase === "Please contact office"
                  ? pricePerCase
                  : `$${pricePerCase} per case (${product.pcsPerCase} units)`}
              </p>

              <div className="border-t border-b py-4 my-6">
                <p className="text-gray-700 mb-4">{product.description}</p>

                <div className="space-y-2 mb-4">
                  <p><strong>Size:</strong> {product.details.size}</p>
                  <p><strong>Color:</strong> {product.details.color}</p>
                  <p><strong>Material:</strong> {product.details.material}</p>
                  <p><strong>Use Case:</strong> {product.details.useCase}</p>
                  <p><strong>MOQ:</strong> {product.moq} units</p>
                  <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
                </div>

                <div className="mb-4">
                  <strong>Pricing:</strong>
                  <ul className="list-disc pl-5 text-sm">
                    {product.details.pricing.map((tier, index) => (
                      <li key={index}>
                        {tier.case}: {typeof tier.pricePerUnit === "string" ? tier.pricePerUnit : `$${tier.pricePerUnit.toFixed(2)} per unit`}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 flex items-center justify-center border rounded-l-md hover:bg-muted transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <div className="w-14 h-10 flex items-center justify-center border-t border-b">
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 flex items-center justify-center border rounded-r-md hover:bg-muted transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-eco hover:bg-eco-dark"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <Check size={18} className="text-eco" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )}
                    <span>{product.inStock ? "In stock" : "Out of stock"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-eco" />
                    <span>Free shipping on orders over ${settings.freeDeliveryThreshold.value.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Shield className="text-eco h-6 w-6" />
                  <div>
                    <h4 className="font-medium">Eco-friendly</h4>
                    <p className="text-sm text-muted-foreground">Sustainable materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Truck className="text-eco h-6 w-6" />
                  <div>
                    <h4 className="font-medium">Fast Delivery</h4>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <CreditCard className="text-eco h-6 w-6" />
                  <div>
                    <h4 className="font-medium">Secure Payment</h4>
                    <p className="text-sm text-muted-foreground">Multiple options</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <Check className="text-eco h-6 w-6" />
                  <div>
                    <h4 className="font-medium">Quality Guaranteed</h4>
                    <p className="text-sm text-muted-foreground">Durable construction</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Category: <span className="text-eco">{product.category}</span></p>
                <p>SKU: {product.id.toString().padStart(6, '0')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-12 bg-eco-paper">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;