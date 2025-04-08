import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; // Import toast for notifications

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      const newQuantity = existingItemIndex > -1 ? prevItems[existingItemIndex].quantity + quantity : quantity;

      // Enforce 50-case limit
      if (newQuantity > 50) {
        toast.error("You cannot order more than 50 cases of any product. Please contact our office for larger orders.");
        return prevItems; // Do not add if quantity exceeds 50 cases
      }

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          pricingTiers: product.details.pricing, // Store the pricing tiers
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            ...product,
            quantity,
            pricingTiers: product.details.pricing, // Store the pricing tiers
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity > 50) {
      toast.error("You cannot order more than 50 cases of any product. Please contact our office for larger orders.");
      return; // Do not update if quantity exceeds 50 cases
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}