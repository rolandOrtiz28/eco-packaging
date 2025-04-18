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
import { calculateFees } from "@/utils/calculateFees";

function SidebarCart() {
  const [open, setOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, discount, applyDiscount, removeDiscount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [settings, setSettings] = useState({
    taxRate: { value: 0 },
    deliveryFee: { type: 'flat', value: 0 },
    freeDeliveryThreshold: { type: 'flat', value: 0 },
    surCharge: { type: 'flat', value: 0 },
  });

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Fetch tax and delivery settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');

        const updatedSettings = {
          taxRate: {
            value: (response.data.taxRate?.value !== undefined && !isNaN(parseFloat(response.data.taxRate.value))) ? parseFloat(response.data.taxRate.value) : 0,
          },
          deliveryFee: {
            type: response.data.deliveryFee?.type || 'flat',
            value: (response.data.deliveryFee?.value !== undefined && !isNaN(parseFloat(response.data.deliveryFee.value))) ? parseFloat(response.data.deliveryFee.value) : 0,
          },
          freeDeliveryThreshold: {
            type: response.data.freeDeliveryThreshold?.type || 'flat',
            value: (response.data.freeDeliveryThreshold?.value !== undefined && !isNaN(parseFloat(response.data.freeDeliveryThreshold.value))) ? parseFloat(response.data.freeDeliveryThreshold.value) : 0,
          },
          surCharge: {
            type: response.data.surCharge?.type || 'flat',
            value: (response.data.surCharge?.value !== undefined && !isNaN(parseFloat(response.data.surCharge.value))) ? parseFloat(response.data.surCharge.value) : 0,
          },
        };
      
        setSettings(updatedSettings);
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to fetch tax and delivery settings");
      }
    };
    fetchSettings();
  }, []);

  const getPricePerCase = (item) => {
    const quantity = item.quantity || 1;
    const unitsPerCase = item.pcsPerCase;
    let pricePerUnit = parseFloat(item.price) || 0;
    if (quantity >= 6 && quantity <= 50) {
      pricePerUnit = parseFloat(item.bulkPrice) || pricePerUnit;
    }
    const pricePerCase = pricePerUnit * unitsPerCase;

    return pricePerCase;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const pricePerCase = getPricePerCase(item);
    const itemTotal = pricePerCase * (item.quantity || 1);
  
    return total + itemTotal;
  }, 0);

  const { shipping, tax, surCharge, total } = calculateFees(subtotal, settings, discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);

    try {
      if (isNaN(subtotal) || subtotal <= 0) {
        throw new Error("Cannot apply promo code: Cart subtotal is invalid or zero.");
      }
      // Ensure only one promo code by resetting discount before applying a new one
      if (discount > 0) {
        removeDiscount();
      }
      const response = await api.post('/api/promo/apply', { code: couponCode, subtotal });
      applyDiscount(response.data.discount);
      toast.success(`Promo code applied! You saved $${response.data.discount.toFixed(2)}`);
      setCouponCode(""); // Clear the input after applying
    } catch (err) {
      console.error('Error applying promo code:', err.response?.data || err.message);
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
          className="relative hover:bg-eco-light/50 border-none rounded-full h-10 w-10"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-eco p-2 text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full md:w-[400px] flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center text-lg font-semibold">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Your Cart ({totalItems})
            </SheetTitle>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
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
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto flex-1 py-2 px-1 -mx-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${getPricePerCase(item).toFixed(2)} per case ({item.pcsPerCase || 0} units)
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity !== undefined ? item.quantity : 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      >
                        +
                      </Button>
                      <span className="text-sm text-muted-foreground ml-1">case(s)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-2 h-8"
                  disabled={discount > 0} // Disable input if a promo is already applied
                />
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  disabled={isApplyingCoupon || !couponCode.trim() || discount > 0}
                  className="h-8"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              
              {discount > 0 && (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm flex items-center justify-between">
                  <span>Discount applied: ${discount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      removeDiscount();
                      toast.info("Promo code removed");
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={14} className="mr-1" />
                    Remove
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Surcharge</span>
                  <span>${surCharge.toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-eco">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="default"
                  className="w-full h-11 bg-eco hover:bg-eco-dark"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/cart">View Cart</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={() => {
                      clearCart();
                      setOpen(false);
                    }}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SidebarCart;