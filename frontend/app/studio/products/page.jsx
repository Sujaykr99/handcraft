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

const categories = ["Pottery", "Jewellery", "Textiles", "Paintings", "Woodwork", "Candles", "Baskets", "Leather"];

export default function StudioProductsPage() {
  const { user, darkMode, showToast } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const inputBg = dm ? "#211c16" : C.surfaceDim;

  if (!user || user.role !== "artisan") {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Artisan Access Required</p>
        <Link href="/studio" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
          Back to Studio
        </Link>
      </div>
    );
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/products?seller=me");
        setProducts(data.products || data);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [showToast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiRequest(`/api/products/${id}`, "DELETE");
      showToast("Product deleted");
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesStock = !filterStock || (filterStock === "in-stock" ? p.stock > 0 : p.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Product Management</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
              Your Products ({products.length})
            </h1>
          </div>
          <Link href="/studio/products/new">
            <Button size="lg" variant="primary">
              + Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div style={{ background: cardBg, borderRadius: "1rem", padding: "1.5rem", border: `1px solid ${borderColor}`, marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
            <div>
              <label style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, display: "block", marginBottom: "0.35rem" }}>Search Products</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontFamily: C.sans, fontSize: "0.85rem", color: text, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, display: "block", marginBottom: "0.35rem" }}>Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontFamily: C.sans, fontSize: "0.85rem", color: text, outline: "none", cursor: "pointer" }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, display: "block", marginBottom: "0.35rem" }}>Stock Status</label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontFamily: C.sans, fontSize: "0.85rem", color: text, outline: "none", cursor: "pointer" }}
              >
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <span style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted }}>
                {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>
        </div>

        {/* Products Table/Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: "1rem", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
                <div style={{ height: "160px", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "0.75rem", marginBottom: "1rem" }} />
                <div style={{ height: "16px", width: "60%", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px", marginBottom: "0.5rem" }} />
                <div style={{ height: "12px", width: "40%", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px" }} />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted, marginBottom: "0.5rem" }}>No products found</p>
            <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginBottom: "1.5rem" }}>
              {search || filterCategory || filterStock ? "Try adjusting your filters" : "Start by adding your first product"}
            </p>
            {!search && !filterCategory && !filterStock && (
              <Link href="/studio/products/new">
                <Button variant="primary">Add Your First Product</Button>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {filteredProducts.map(product => (
              <div
                key={product._id}
                style={{
                  background: cardBg,
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: `1px solid ${borderColor}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,27,23,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                  <img
                    src={product.image || placeholderImgs[product.category] || placeholderImgs.Pottery}
                    alt={product.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                  />
                  <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{
                      fontFamily: C.sans,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      background: product.stock > 0 ? "rgba(90,122,74,0.9)" : `rgba(159,64,45,0.9)`,
                      color: "white",
                    }}>
                      {product.stock > 0 ? `${product.stock} left` : "Sold Out"}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: C.sans, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.25rem" }}>
                        {product.category}
                      </p>
                      <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.title}
                      </h3>
                    </div>
                    <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 700, color: text }}>₹{product.price}</span>
                  </div>
                  <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: muted, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {product.description}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/studio/products/${product._id}/edit`} style={{ flex: 1, textAlign: "center" }}>
                      <Button variant="outline" size="sm" fullWidth>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                      loading={deletingId === product._id}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}