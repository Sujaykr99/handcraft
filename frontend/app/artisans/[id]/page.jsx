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

export default function ArtisanProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, darkMode, showToast, wishlist, toggleWishlist, addToCart } = useApp();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const inputBg = dm ? "#211c16" : C.surfaceDim;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artisanRes, productsRes] = await Promise.all([
          apiRequest(`/api/users/${id}`),
          apiRequest(`/api/products?seller=${id}`),
        ]);
        setArtisan(artisanRes);
        setProducts(productsRes.products || productsRes);
      } catch (err) {
        showToast(err.message, "error");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router, showToast]);

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading artisan profile...</div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted }}>Artisan not found</p>
        <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.85rem", color: C.primary, textDecoration: "none" }}>← Back to Collection</Link>
      </div>
    );
  }

  const isOwner = user && user._id === artisan._id;
  const artisanProducts = products.filter(p => p.stock > 0);
  const totalSales = products.reduce((sum, p) => sum + (p.sold || 0), 0);

  const tabs = [
    { key: "products", label: "Products", count: artisanProducts.length },
    { key: "about", label: "About", count: null },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Profile Header */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2rem", alignItems: "start", marginBottom: "3rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "140px", height: "140px", borderRadius: "50%", overflow: "hidden", border: `4px solid ${C.primary}`, background: C.surfaceDim }}>
              {artisan.avatar ? (
                <img src={artisan.avatar} alt={artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, fontFamily: C.sans, fontSize: "3rem", fontWeight: 700, color: "white" }}>
                  {artisan.name?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
            </div>
            {isOwner && (
              <Link href="/studio/profile" style={{ position: "absolute", bottom: "0", right: "0", width: "36px", height: "36px", borderRadius: "50%", background: C.primary, color: "white", border: "3px solid", borderColor: bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1rem" }}>
                ✎
              </Link>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
                {artisan.name}
              </h1>
              {artisan.verified && (
                <span style={{ fontFamily: C.sans, fontSize: "0.65rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "rgba(90,122,74,0.15)", color: "#5a7a4a" }}>
                  ✓ Verified Artisan
                </span>
              )}
            </div>
            {artisan.location && (
              <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {artisan.location}
              </p>
            )}
            {artisan.specialties && artisan.specialties.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {artisan.specialties.map(specialty => (
                  <span key={specialty} style={{ fontFamily: C.sans, fontSize: "0.7rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", background: `rgba(159,64,45,0.1)`, color: C.primary, fontWeight: 500 }}>
                    {specialty}
                  </span>
                ))}
              </div>
            )}
            <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted }}>
              Member since {new Date(artisan.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "right" }}>
            {isOwner ? (
              <Link href="/studio">
                <Button variant="primary" size="lg">Go to Studio</Button>
              </Link>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary }}>Total Products</p>
                  <p style={{ fontFamily: C.sans, fontSize: "1.5rem", fontWeight: 700, color: text }}>{artisanProducts.length}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary }}>Total Sales</p>
                  <p style={{ fontFamily: C.sans, fontSize: "1.5rem", fontWeight: 700, color: text }}>{totalSales}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: cardBg, borderRadius: "1.25rem", border: `1px solid ${borderColor}`, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}` }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  padding: "1rem 1.5rem",
                  background: activeTab === tab.key ? `rgba(159,64,45,0.08)` : "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.key ? `3px solid ${C.primary}` : "none",
                  cursor: "pointer",
                  fontFamily: C.sans,
                  fontSize: "0.85rem",
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? C.primary : muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span style={{ fontFamily: C.sans, fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: activeTab === tab.key ? C.primary : borderColor, color: activeTab === tab.key ? "white" : muted }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "2rem" }}>
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {artisanProducts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
                    <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted, marginBottom: "0.5rem" }}>
                      {isOwner ? "No products yet" : "No products available"}
                    </p>
                    <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginBottom: "1.5rem" }}>
                      {isOwner ? "Start by adding your first handmade creation" : "This artisan hasn't listed any products yet"}
                    </p>
                    {isOwner && (
                      <Link href="/studio/products/new">
                        <Button variant="primary">Add Your First Product</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                    {artisanProducts.map(product => (
                      <Link href={`/products/${product._id}`} key={product._id} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{
                          background: cardBg,
                          borderRadius: "1rem",
                          overflow: "hidden",
                          border: `1px solid ${borderColor}`,
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(30,27,23,0.12)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                            <img
                              src={product.image || placeholderImgs[product.category] || placeholderImgs.Pottery}
                              alt={product.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            />
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id); }}
                              style={{
                                position: "absolute", top: "10px", right: "10px", zIndex: 2,
                                background: "rgba(255,248,241,0.92)", border: "none", borderRadius: "50%",
                                width: "34px", height: "34px", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 10px rgba(30,27,23,0.12)", transition: "transform 0.2s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                              <svg width="14" height="14" fill={wishlist.includes(product._id) ? C.primary : "none"} stroke={C.primary} strokeWidth="1.5" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                              </svg>
                            </button>
                          </div>
                          <div style={{ padding: "1.1rem 1.25rem 0.75rem" }}>
                            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>
                              {product.category}
                            </p>
                            <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3 }}>
                              {product.title}
                            </h3>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text }}>₹{product.price}</span>
                              <span style={{ fontFamily: C.sans, fontSize: "0.7rem", color: product.stock > 0 ? "#5a7a4a" : C.primary, fontWeight: 600 }}>
                                {product.stock > 0 ? `${product.stock} left` : "Sold out"}
                              </span>
                            </div>
                          </div>
                          <div style={{ padding: "0 1.25rem 1.25rem" }}>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                              disabled={product.stock === 0}
                              style={{
                                width: "100%", padding: "0.65rem", borderRadius: "9999px", border: "none",
                                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                                fontFamily: C.sans, fontSize: "0.8rem", fontWeight: 600,
                                transition: "opacity 0.2s, transform 0.15s",
                                background: product.stock > 0 ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.surfaceHigh,
                                color: product.stock > 0 ? "white" : muted
                              }}
                            >
                              {product.stock > 0 ? "Add to Collection" : "Sold Out"}
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div style={{ maxWidth: "800px" }}>
                {artisan.bio ? (
                  <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Story</h2>
                    <p style={{ fontFamily: C.sans, fontSize: "1rem", color: text, lineHeight: 1.8 }}>
                      {artisan.bio}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem", color: muted, fontFamily: C.sans }}>
                    {isOwner ? "Add your story in Studio → Profile" : "This artisan hasn't shared their story yet"}
                  </div>
                )}

                {artisan.socialLinks && Object.keys(artisan.socialLinks).length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Connect</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      {Object.entries(artisan.socialLinks).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: C.sans, fontSize: "0.85rem", color: C.primary, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", border: `1px solid ${borderColor}`, borderRadius: "0.75rem", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = `rgba(159,64,45,0.05)`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ textTransform: "capitalize" }}>{platform}</span>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Craft Specialties</h2>
                  {artisan.specialties && artisan.specialties.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                      {artisan.specialties.map(specialty => (
                        <span key={specialty} style={{ fontFamily: C.sans, fontSize: "0.85rem", padding: "0.5rem 1.25rem", borderRadius: "9999px", background: `rgba(159,64,45,0.1)`, color: C.primary, fontWeight: 500 }}>
                          {specialty}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>
                      {isOwner ? "Add your specialties in Studio → Profile" : "No specialties listed"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}