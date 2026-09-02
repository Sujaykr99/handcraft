"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUserState] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const setUser = useCallback((u) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    const savedDarkMode = localStorage.getItem("darkMode");
    const token = localStorage.getItem("token");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    if (!token) {
      setAuthReady(true);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth failed");
        return res.json();
      })
      .then((userData) => setUser(userData))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserState(null);
      })
      .finally(() => setAuthReady(true));
  }, [setUser]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      const updated = exists
        ? prev.map((i) => (i._id === product._id ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { ...product, quantity: qty }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
    showToast(`${product.title} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
    showToast("Removed from cart", "info");
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      showToast(prev.includes(id) ? "Removed from wishlist" : "Saved to wishlist", "info");
      return updated;
    });
  }, [showToast]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }, [setUser]);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        user,
        setUser,
        authReady,
        wishlist,
        toggleWishlist,
        toasts,
        showToast,
        darkMode,
        toggleDarkMode,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};