"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";

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

function WishlistItem({ product, onAddToCart, onRemove, darkMode }) {
  const dm = darkMode;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const inStock = product.stock > 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr auto auto auto", gap: "1.5rem", alignItems: "center", padding: "1.5rem", background: cardBg, borderRadius: "1rem", border: `1px solid ${borderColor}` }}>
      <Link href={`/products/${product._id}`} style={{ display: "block" }}>
        <div style={{ aspectRatio: "1", borderRadius: "0.75rem", overflow: "hidden", background: C.surfaceDim }}>
          <img
            src={product.image || placeholderImgs[product.category] || placeholderImgs.Pottery}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Link>

      <div style={{ minWidth: 0 }}>
        <Link href={`/products/${product._id}`} style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.25rem" }}>
            {product.category}
          </p>
          <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3 }}>
            {product.title}
          </h3>
        </Link>
        {product.seller && (
          <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>
            by <span style={{ fontFamily: C.serif, fontStyle: "italic", color: text }}>{product.seller.name}</span>
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
        <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text }}>₹{product.price}</span>
        <span style={{
          fontFamily: C.sans,
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "0.15rem 0.5rem",
          borderRadius: "9999px",
          background: inStock ? "rgba(90,122,74,0.15)" : `rgba(159,64,45,0.15)`,
          color: inStock ? "#5a7a4a" : C.primary,
        }}>
          {inStock ? `${product.stock} left` : "Sold out"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          size="sm"
          variant={inStock ? "primary" : "outline"}
        >
          Add to Cart
        </Button>
        <button
          onClick={() => onRemove(product._id)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "0.5rem",
            border: `1px solid ${borderColor}`,
            background: cardBg,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          <svg width="16" height="16" fill="none" stroke={C.primary} strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, removeFromWishlist, darkMode, user, showToast } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  useEffect(() => {
    if (!user) return;
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products and filter by wishlist
        const data = await apiRequest("/api/products");
        const wishlistProducts = data.filter(p => wishlist.includes(p._id));
        setProducts(wishlistProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [user, wishlist]);

  if (!user) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem" }}>🤍</div>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Your wishlist is empty</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          Sign in to save your favorite handmade pieces and never lose them.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => router.push("/login")} style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", border: "none", borderRadius: "9999px", padding: "1rem 2.5rem", cursor: "pointer" }}>
            Sign In
          </button>
          <button onClick={() => router.push("/signup")} style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, border: `2px solid ${C.primary}`, color: C.primary, background: "transparent", borderRadius: "9999px", padding: "1rem 2.5rem", cursor: "pointer" }}>
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Saved Items</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
              My Wishlist ({products.length})
            </h1>
          </div>
          {products.length > 0 && (
            <button
              onClick={() => { if (window.confirm("Remove all items from wishlist?")) products.forEach(p => removeFromWishlist(p._id)); }}
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
              Clear Wishlist
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🤍</div>
            <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", color: muted, marginBottom: "1rem" }}>
              Your wishlist is empty
            </p>
            <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px", margin: "0 auto 2rem" }}>
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none", display: "inline-block" }}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {products.map(product => (
              <WishlistItem
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                onRemove={removeFromWishlist}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}