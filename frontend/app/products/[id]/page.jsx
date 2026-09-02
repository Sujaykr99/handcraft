"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Pottery: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80",
  Textiles: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80",
  Jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  Paintings: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  Woodwork: "https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=800&q=80",
  Candles: "https://images.unsplash.com/photo-1602607144655-c63d4d47f86a?w=800&q=80",
  Baskets: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
  Leather: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, darkMode, user } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted }}>Product not found</p>
        <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.85rem", color: C.primary, textDecoration: "none" }}>← Back to Collection</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image || placeholderImgs[product.category] || placeholderImgs.Pottery];
  const isWishlisted = wishlist.includes(product._id);
  const inStock = product.stock > 0;
  const isOwner = user && user._id === product.seller?._id;

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "2rem", fontFamily: C.sans, fontSize: "0.78rem", color: muted }}>
          <Link href="/" style={{ color: muted, textDecoration: "none", transition: "color 0.2s" }}>Home</Link>
          <span style={{ margin: "0 0.5rem" }}>/</span>
          <Link href="/products" style={{ color: muted, textDecoration: "none", transition: "color 0.2s" }}>Collection</Link>
          <span style={{ margin: "0 0.5rem" }}>/</span>
          <span style={{ color: text }}>{product.title}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          {/* Image Gallery */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ borderRadius: "1.5rem", overflow: "hidden", background: cardBg, boxShadow: "0 8px 40px rgba(30,27,23,0.08)" }}>
              <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }}
                />
                {images.length > 1 && (
                  <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem" }}>
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        style={{
                          width: i === selectedImage ? "24px" : "8px",
                          height: "8px",
                          borderRadius: "9999px",
                          border: "none",
                          background: i === selectedImage ? C.primary : "rgba(255,248,241,0.5)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div style={{ display: "flex", gap: "0.75rem", padding: "1rem", overflowX: "auto" }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        flexShrink: 0,
                        width: "80px",
                        height: "80px",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        border: i === selectedImage ? `2px solid ${C.primary}` : "2px solid transparent",
                        background: cardBg,
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <img src={img} alt={`${product.title} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist button for gallery */}
            <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10 }} />
          </div>

          {/* Product Info */}
          <div>
            <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.primary, marginBottom: "0.5rem" }}>
              {product.category}
            </p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text, marginBottom: "0.5rem", lineHeight: 1.2 }}>
              {product.title}
            </h1>

            {product.seller && (
              <Link href={`/artisans/${product.seller._id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", textDecoration: "none" }}>
                <span style={{ fontFamily: C.sans, fontSize: "0.72rem", color: C.primary, fontWeight: 500 }}>by</span>
                <span style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: text }}>{product.seller.name}</span>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: C.primary }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: C.sans, fontSize: "1.5rem", fontWeight: 700, color: text }}>₹{product.price}</span>
              <span style={{
                fontFamily: C.sans,
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: inStock ? "rgba(90,122,74,0.15)" : `rgba(159,64,45,0.15)`,
                color: inStock ? "#5a7a4a" : C.primary,
              }}>
                {inStock ? `${product.stock} in stock` : "Sold out"}
              </span>
            </div>

            <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: `1px solid ${borderColor}` }}>
              <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            {inStock && !isOwner && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${borderColor}`, borderRadius: "0.75rem", overflow: "hidden" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{
                      padding: "0.75rem 1.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: quantity > 1 ? "pointer" : "not-allowed",
                      fontFamily: C.sans,
                      fontSize: "1rem",
                      color: quantity > 1 ? text : muted,
                      transition: "background 0.2s",
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text, padding: "0 1.5rem", minWidth: "50px", textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{
                      padding: "0.75rem 1.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: quantity < product.stock ? "pointer" : "not-allowed",
                      fontFamily: C.sans,
                      fontSize: "1rem",
                      color: quantity < product.stock ? text : muted,
                      transition: "background 0.2s",
                    }}
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  fullWidth={false}
                  variant="primary"
                  style={{ flex: 1, minWidth: "200px" }}
                >
                  Add to Collection
                </Button>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "0.75rem",
                    border: `1px solid ${borderColor}`,
                    background: cardBg,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="18" height="18" fill={isWishlisted ? C.primary : "none"} stroke={C.primary} strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
            )}

            {isOwner && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(159,64,45,0.06)", borderRadius: "0.75rem" }}>
                <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted }}>
                  This is your product. Manage it from your <Link href="/studio/products" style={{ color: C.primary, textDecoration: "none", fontWeight: 500 }}>Artisan Studio</Link>.
                </p>
              </div>
            )}

            {!inStock && !isOwner && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(159,64,45,0.06)", borderRadius: "0.75rem" }}>
                <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, fontWeight: 500 }}>This item is currently sold out.</p>
              </div>
            )}

            {/* Product Meta */}
            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Category</p>
                  <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: text }}>{product.category}</p>
                </div>
                {product.materials && (
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Materials</p>
                    <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: text }}>{product.materials}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Dimensions</p>
                    <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: text }}>{product.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products / Artisan Other Products */}
        {product.seller && (
          <section style={{ marginTop: "5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>More from</p>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", fontWeight: 400, color: text }}>{product.seller.name}</h2>
              </div>
              <Link href={`/artisans/${product.seller._id}`} style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, fontWeight: 500, textDecoration: "none" }}>
                View Studio →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {/* Related products would be fetched here */}
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: muted, fontFamily: C.sans }}>
                More products from this artisan coming soon...
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}