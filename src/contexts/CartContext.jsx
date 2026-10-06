import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

export const useCart = () =>
  useContext(CartContext) || {
    items: [],
    count: 0,
    addToCart() {
      return { ok: false, message: "Cart is unavailable." };
    },
    setQty() {
      return { ok: false, message: "Cart is unavailable." };
    },
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

  const addToCart = (product, amount = 1) => {
    const stock = Number(product.stock ?? 0);
    if (stock <= 0) {
      return { ok: false, message: "This item is out of stock." };
    }

    let result = { ok: true };
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const currentQty = existing?.qty || 0;
      const nextQty = currentQty + amount;
      if (nextQty > stock) {
        result = {
          ok: false,
          message: `Only ${stock} left of '${product.name}'.`,
        };
        return prev;
      }
      const line = {
        id: product.id,
        name: product.name,
        price_gbp: product.price_gbp,
        image: product.image_urls?.[0] || product.image || "",
        stock,
        qty: nextQty,
      };
      if (existing) {
        return prev.map((i) => (i.id === product.id ? line : i));
      }
      return [...prev, line];
    });
    return result;
  };

  const setQty = (id, qty) => {
    let result = { ok: true };
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (qty <= 0) return prev.filter((i) => i.id !== id);
      if (qty > item.stock) {
        result = {
          ok: false,
          message: `Only ${item.stock} left of '${item.name}'.`,
        };
        return prev;
      }
      return prev.map((i) => (i.id === id ? { ...i, qty } : i));
    });
    return result;
  };

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        addToCart,
        setQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
