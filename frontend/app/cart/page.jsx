"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const C = {
  serif: "'Newsreader', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  primary: "#9f402d",
  primaryLight: "#e2725b",
  surface: "#fff8f1",
  surfaceLow: "#faf2ea",
  surfaceDim: "#ede7df",
  surfaceHigh: "#e8e1da",
  onSurface: "#1e1b17",
  muted: "#6b6560",
};

const placeholderImgs = {
  Pottery: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&q=80",
  Textiles: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&q=80",
  Jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
  Paintings: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80",
  Woodwork: "https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=500&q=80",
  Candles: "https://images.unsplash.com/photo-1602607144655-c63d4d47f86a?w=500&q=80",
  Baskets: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80",
  Leather: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
};

function CartItem({ item, onUpdateQuantity, onRemove, darkMode }) {
  const dm = darkMode;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr auto auto", gap: "1.5rem", alignItems: "center", padding: "1.5rem", background: cardBg, borderRadius: "1rem", border: `1px solid ${borderColor}` }}>
      <Link href={`/products/${item.product._id}`} style={{ display: "block" }}>
        <div style={{ aspectRatio: "1", borderRadius: "0.75rem", overflow: "hidden", background: C.surfaceDim }}>
          <img
            src={item.product.image || placeholderImgs[item.product.category] || placeholderImgs.Pottery}
            alt={item.product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Link>

      <div style={{ minWidth: 0 }}>
        <Link href={`/products/${item.product._id}`} style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.25rem" }}>
            {item.product.category}
          </p>
          <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3 }}>
            {item.product.title}
          </h3>
        </Link>
        {item.product.seller && (
          <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>
            by <span style={{ fontFamily: C.serif, fontStyle: "italic", color: text }}>{item.product.seller.name}</span>
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontFamily: C.sans, fontSize: "1.1rem", fontWeight: 600, color: text, whiteSpace: "nowrap" }}>
          ₹{item.product.price}
        </span>
        <div style={{ display: "flex", alignItems: "center", border: `1px solid ${borderColor}`, borderRadius: "0.75rem", overflow: "hidden" }}>
          <button
            onClick={() => onUpdateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              cursor: item.quantity > 1 ? "pointer" : "not-allowed",
              fontFamily: C.sans,
              fontSize: "1rem",
              color: item.quantity > 1 ? text : muted,
            }}
          >
            −
          </button>
          <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text, padding: "0 1rem", minWidth: "40px", textAlign: "center" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
            disabled={item.quantity >= item.product.stock}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              cursor: item.quantity < item.product.stock ? "pointer" : "not-allowed",
              fontFamily: C.sans,
              fontSize: "1rem",
              color: item.quantity < item.product.stock ? text : muted,
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
        <span style={{ fontFamily: C.sans, fontSize: "1.1rem", fontWeight: 700, color: text, whiteSpace: "nowrap" }}>
          ₹{item.product.price * item.quantity}
        </span>
        <button
          onClick={() => onRemove(item.product._id)}
          style={{
            fontFamily: C.sans,
            fontSize: "0.7rem",
            color: C.primary,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function CartSummary({ subtotal, shipping, total, onCheckout, darkMode }) {
  const dm = darkMode;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  return (
    <div style={{ position: "sticky", top: "100px", background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}`, boxShadow: "0 8px 40px rgba(30,27,23,0.05)" }}>
      <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
        Order Summary
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>Subtotal</span>
          <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>₹{subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>Shipping</span>
          <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>
            {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
          </span>
        </div>
        {shipping > 0 && (
          <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>
            Free shipping on orders over ₹2,000
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: `1px solid ${borderColor}` }}>
          <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text }}>Total</span>
          <span style={{ fontFamily: C.sans, fontSize: "1.25rem", fontWeight: 700, color: text }}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <Button onClick={onCheckout} fullWidth size="lg" variant="primary">
        Proceed to Checkout
      </Button>

      <p style={{ textAlign: "center", fontFamily: C.sans, fontSize: "0.75rem", color: muted, marginTop: "1rem" }}>
        Secure checkout powered by HandArt
      </p>
    </div>
  );
}

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, darkMode, user, showToast } = useApp();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const inputBg = dm ? "#211c16" : C.surfaceDim;

  if (!user) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Your collection is empty</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          Sign in to view your saved cart items or start shopping to fill it up.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, border: `2px solid ${C.primary}`, color: C.primary, borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validItems = cart.filter(item => item.product && item.product.stock > 0);
  const outOfStockItems = cart.filter(item => item.product && item.product.stock === 0);
  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping - discount;

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === "HANDART10") {
      setDiscount(Math.round(subtotal * 0.1));
      setPromoError("");
      showToast("10% discount applied!");
    } else if (promoCode.toUpperCase() === "WELCOME50") {
      setDiscount(50);
      setPromoError("");
      showToast("₹50 off applied!");
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
    }
  };

  if (validItems.length === 0 && outOfStockItems.length === 0) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem" }}>🛍️</div>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Your collection is empty</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          Looks like you haven't added anything yet. Time to discover something beautiful.
        </p>
        <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Your Collection</p>
              <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
                Shopping Cart ({validItems.length})
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => { if (window.confirm("Clear all items from cart?")) clearCart(); }}
                style={{
                  fontFamily: C.sans,
                  fontSize: "0.75rem",
                  color: C.primary,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {outOfStockItems.length > 0 && (
            <div style={{ background: "rgba(159,64,45,0.06)", borderRadius: "1rem", padding: "1.5rem", marginBottom: "2rem", border: `1px solid rgba(159,64,45,0.2)` }}>
              <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, fontWeight: 500, marginBottom: "0.5rem" }}>
                ⚠ {outOfStockItems.length} item(s) are out of stock and have been removed from your total
              </p>
              <button
                onClick={() => outOfStockItems.forEach(item => removeFromCart(item.product._id))}
                style={{
                  fontFamily: C.sans,
                  fontSize: "0.75rem",
                  color: C.primary,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Remove unavailable items
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {validItems.map(item => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={removeFromCart}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* Promo Code */}
          <div style={{ marginTop: "2rem", background: cardBg, borderRadius: "1rem", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
            <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.1rem", fontWeight: 400, color: text, marginBottom: "1rem" }}>Promo Code</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Input
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                placeholder="Enter code"
                style={{
                  flex: 1,
                  background: inputBg,
                  border: promoError ? "2px solid #9f402d" : "none",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1.1rem",
                  fontFamily: C.sans,
                  fontSize: "0.875rem",
                  color: text,
                  outline: "none",
                }}
              />
              <Button onClick={handlePromoApply} variant="outline" disabled={!promoCode.trim()}>
                Apply
              </Button>
            </div>
            {promoError && (
              <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: C.primary, marginTop: "0.5rem" }}>{promoError}</p>
            )}
            {discount > 0 && (
              <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: "#5a7a4a", marginTop: "0.5rem", fontWeight: 500 }}>
                ✓ Discount applied: -₹{discount.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onCheckout={() => router.push("/checkout")}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}