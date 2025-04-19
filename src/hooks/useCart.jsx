import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    let items = savedCart ? JSON.parse(savedCart) : [];
    // Ensure quantity is set
    items = items.map(item => ({
      ...item,
      quantity: item.quantity !== undefined ? item.quantity : 1,
    }));
    return items;
  });

  const [discount, setDiscount] = useState(() => {
    const savedDiscount = localStorage.getItem("cartDiscount");
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });

  // Sync cart items to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync discount to localStorage
  useEffect(() => {
    localStorage.setItem("cartDiscount", discount.toString());
  }, [discount]);

  const addToCart = (product, quantity) => {
    const initialQuantity = Math.max(1, quantity || 1);
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

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);
      if (updatedCart.length === 0) {
        setDiscount(0); // Reset discount if cart becomes empty
        localStorage.removeItem("cartDiscount");
      }
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartDiscount");
  };

  const applyDiscount = (discountValue) => {
    setDiscount(discountValue);
  };

  const removeDiscount = () => {
    setDiscount(0);
    localStorage.removeItem("cartDiscount");
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
        removeDiscount,
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