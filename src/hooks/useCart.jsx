import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    let items = savedCart ? JSON.parse(savedCart) : [];
    // Fix items with undefined quantities
    items = items.map(item => ({
      ...item,
      quantity: item.quantity !== undefined ? item.quantity : 1,
    }));
    return items;
  });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    const initialQuantity = Math.max(1, quantity || 1); // Ensure quantity is at least 1
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + initialQuantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: initialQuantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };

  const applyDiscount = (discountValue) => {
    setDiscount(discountValue);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discount,
        applyDiscount,
      }}
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