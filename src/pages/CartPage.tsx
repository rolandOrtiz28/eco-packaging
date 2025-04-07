
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  
  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    
    // Simulate API call delay
    setTimeout(() => {
      alert(`Sorry, coupon "${couponCode}" is invalid or expired.`);
      setIsApplyingCoupon(false);
    }, 1000);
  };
  
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-background py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                
                <div>
                  {cartItems.map(item => (
                    <div key={item.id} className="px-6 py-6 border-b last:border-0 flex flex-col sm:flex-row">
                      <div className="sm:w-24 h-24 bg-muted rounded overflow-hidden mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow sm:ml-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              SKU: {item.id.toString().padStart(6, '0')}
                            </p>
                          </div>
                          <p className="font-medium text-eco">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-muted transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="w-12 h-8 border-t border-b text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-muted transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-6 py-4 bg-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={18} className="text-muted-foreground" />
                    <button 
                      onClick={clearCart}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                  <Link to="/retail" className="flex items-center text-eco hover:underline">
                    <ShoppingBag size={18} className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              {/* Coupon Section */}
              <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
                <h2 className="font-semibold mb-4">Apply Coupon Code</h2>
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
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-24">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 
                          ? "Free" 
                          : `$${shipping.toFixed(2)}`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-eco">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-eco hover:bg-eco-dark"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Shipping calculated at checkout. Tax may vary based on location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/retail">
              <Button className="bg-eco hover:bg-eco-dark">
                <ShoppingBag size={18} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
