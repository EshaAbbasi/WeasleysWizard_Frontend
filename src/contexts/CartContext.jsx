import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

// safe default so pages without a provider (owner/admin) don't crash
export const useCart = () =>
  useContext(CartContext) || {
    items: [],
    count: 0,
    addToCart() {},
    removeFromCart() {},
    clearCart() {},
  };

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addToCart = (product) =>
    setItems((prev) =>
      prev.find((i) => i.id === product.id)
        ? prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...product, qty: 1 }],
    );

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, count, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
