import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aurelle_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem("aurelle_cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total (assuming price is formatted like "$700")
  const cartTotal = items.reduce((total, item) => {
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return total + numericPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
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
