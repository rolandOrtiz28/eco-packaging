import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";

function SidebarCart() {
  const [open, setOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, discount, applyDiscount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [settings, setSettings] = useState({
    taxRate: 0.08,
    deliveryFee: 9.99,
    freeDeliveryThreshold: 50,
  });

  const totalItems = cartItems.length;

  // Fetch tax and delivery settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        setSettings({
          taxRate: response.data.taxRate || 0.08,
          deliveryFee: response.data.deliveryFee || 9.99,
          freeDeliveryThreshold: response.data.freeDeliveryThreshold || 50,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to fetch tax and delivery settings");
      }
    };
    fetchSettings();
  }, []);

  // Function to determine the price per case based on quantity
  const getPricePerCase = (item) => {
    const quantity = item.quantity || 1; // Default to 1 if undefined
    const unitsPerCase = parseInt(item.pcsPerCase) || 0;

    let pricePerUnit = parseFloat(item.price) || 0;
    if (quantity >= 6 && quantity <= 50) {
      pricePerUnit = parseFloat(item.bulkPrice) || pricePerUnit;
    }

    return pricePerUnit * unitsPerCase;
  };

  console.log('Cart items in SidebarCart:', cartItems);

  // Calculate subtotal using dynamic price per case
  const subtotal = cartItems.reduce((total, item) => {
    const price = getPricePerCase(item);
    const qty = item.quantity !== undefined ? item.quantity : 1; // Default to 1 if undefined
    return total + (isNaN(price) ? 0 : price) * qty;
  }, 0);
  console.log('Subtotal in SidebarCart:', subtotal);

  const shipping = subtotal > settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const tax = subtotal * settings.taxRate;
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);

    try {
      console.log('Applying promo code with data in SidebarCart:', { code: couponCode, subtotal });
      if (isNaN(subtotal) || subtotal <= 0) {
        throw new Error("Cannot apply promo code: Cart subtotal is invalid or zero.");
      }
      const response = await api.post('/promo/apply', { code: couponCode, subtotal });
      applyDiscount(response.data.discount);
      toast.success(`Promo code applied! You saved $${response.data.discount}`);
    } catch (err) {
      console.error('Error applying promo code in SidebarCart:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.message || "Failed to apply promo code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to proceed to checkout.");
      navigate("/login");
      setOpen(false);
      return;
    }
    navigate("/checkout");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-eco-light/50 border-none"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-[90vw]">
        <SheetHeader className="space-y-2 pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <Button
              asChild
              variant="outline"
              className="mt-4"
              onClick={() => setOpen(false)}
            >
              <Link to="/retail">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-350px)]">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${getPricePerCase(item).toFixed(2)} per case ({item.pcsPerCase || 0} units)
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <span>-</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity !== undefined ? item.quantity : 1} case(s)</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      >
                        <span>+</span>
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4 mt-6">
              <Separator />
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600">
                  Discount applied: ${discount.toFixed(2)}
                </p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-eco">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="default"
                  className="w-full bg-eco hover:bg-eco-dark"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => {
                    clearCart();
                    setOpen(false);
                  }}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SidebarCart;