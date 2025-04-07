
import { useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

const SidebarCart = () => {
  const [open, setOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalItems = cartItems.length;
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-250px)]">
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
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <span>-</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  asChild 
                  variant="default" 
                  className="w-full bg-eco hover:bg-eco-dark"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/checkout">Checkout</Link>
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
};

export default SidebarCart;
