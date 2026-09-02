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

const statusConfig = {
  pending: { label: "Pending", color: "#9f402d", bg: "rgba(159,64,45,0.1)" },
  confirmed: { label: "Confirmed", color: "#3a7a4a", bg: "rgba(58,122,74,0.1)" },
  processing: { label: "Processing", color: "#b8860b", bg: "rgba(184,134,11,0.1)" },
  shipped: { label: "Shipped", color: "#1e4d8c", bg: "rgba(30,77,140,0.1)" },
  delivered: { label: "Delivered", color: "#5a7a4a", bg: "rgba(90,122,74,0.1)" },
  cancelled: { label: "Cancelled", color: "#9f402d", bg: "rgba(159,64,45,0.1)" },
};

export default function StudioDashboardPage() {
  const { user, darkMode, showToast } = useApp();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  if (!user || user.role !== "artisan") {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Artisan Studio Access Required</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          This area is for registered artisans only.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link href="/signup" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, border: `2px solid ${C.primary}`, color: C.primary, borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Join as Artisan
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          apiRequest("/api/products?seller=me"),
          apiRequest("/api/orders/artisan"),
        ]);
        const products = productsRes.products || productsRes;
        const orders = ordersRes.orders || ordersRes;

        setStats({
          totalProducts: products.length,
          activeProducts: products.filter(p => p.stock > 0).length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => ["pending", "confirmed", "processing"].includes(o.status)).length,
          revenue: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0),
        });
        setRecentOrders(orders.slice(0, 5));
        setRecentProducts(products.slice(0, 4));
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const statCards = [
    { key: "totalProducts", label: "Total Products", icon: "📦", color: C.primary },
    { key: "activeProducts", label: "Active Listings", icon: "✅", color: "#5a7a4a" },
    { key: "totalOrders", label: "Total Orders", icon: "📋", color: "#1e4d8c" },
    { key: "pendingOrders", label: "Pending Orders", icon: "⏳", color: "#b8860b" },
    { key: "revenue", label: "Total Revenue", icon: "💰", color: "#8b4513", format: "currency" },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Welcome back</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
              Artisan Studio
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginTop: "0.5rem" }}>
              Manage your products, orders, and studio profile
            </p>
          </div>
          <Link href="/studio/products/new" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <span>+</span> Add Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {statCards.map(stat => (
            <div key={stat.key} style={{ background: cardBg, borderRadius: "1.25rem", padding: "1.5rem", border: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontFamily: C.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: muted }}>{stat.label}</p>
                <div style={{ width: "40px", height: "40px", borderRadius: "0.75rem", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                {stat.format === "currency" ? (
                  <p style={{ fontFamily: C.sans, fontSize: "1.75rem", fontWeight: 700, color: text }}>₹{stats[stat.key].toLocaleString()}</p>
                ) : (
                  <p style={{ fontFamily: C.sans, fontSize: "2rem", fontWeight: 700, color: text }}>{stats[stat.key].toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          <Link href="/studio/products" style={{ textDecoration: "none", display: "block", background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,27,23,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontFamily: C.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.5rem" }}>Products</p>
                <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: text }}>Manage Listings</h3>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "0.75rem", background: `rgba(159,64,45,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>📦</div>
            </div>
            <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted, marginBottom: "1.5rem" }}>
              Add, edit, or remove your handmade products. {stats.totalProducts} products total, {stats.activeProducts} active.
            </p>
            <span style={{ fontFamily: C.sans, fontSize: "0.8rem", color: C.primary, fontWeight: 500 }}>View Products →</span>
          </Link>

          <Link href="/studio/orders" style={{ textDecoration: "none", display: "block", background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,27,23,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontFamily: C.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.5rem" }}>Orders</p>
                <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: text }}>Manage Orders</h3>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "0.75rem", background: "rgba(30,77,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>📋</div>
            </div>
            <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted, marginBottom: "1.5rem" }}>
              Process and track customer orders. {stats.pendingOrders} pending, {stats.totalOrders} total.
            </p>
            <span style={{ fontFamily: C.sans, fontSize: "0.8rem", color: C.primary, fontWeight: 500 }}>View Orders →</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Recent Orders */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: text }}>Recent Orders</h2>
              <Link href="/studio/orders" style={{ fontFamily: C.sans, fontSize: "0.75rem", color: C.primary, fontWeight: 500, textDecoration: "none" }}>View All →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", color: muted, fontFamily: C.sans }}>Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: muted, fontFamily: C.sans" }}>
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</p>
                <p>No orders yet</p>
                <p style={{ fontSize: "0.85rem" }}>Your orders will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {recentOrders.map(order => (
                  <Link href={`/studio/orders/${order._id}`} key={order._id} style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: dm ? "#211c16" : C.surfaceLow, borderRadius: "0.75rem", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = dm ? "#2a2218" : C.surfaceDim}
                    onMouseLeave={e => e.currentTarget.style.background = dm ? "#211c16" : C.surfaceLow}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "0.5rem", overflow: "hidden", flexShrink: 0, background: C.surfaceDim }}>
                        {order.items[0]?.product?.image && (
                          <img src={order.items[0].product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: "0.85rem", fontWeight: 500, color: text }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>
                          {order.items.length} item(s) • ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontFamily: C.sans,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "9999px",
                        background: statusConfig[order.status]?.bg || "rgba(159,64,45,0.1)",
                        color: statusConfig[order.status]?.color || C.primary,
                      }}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: text }}>Recent Products</h2>
              <Link href="/studio/products" style={{ fontFamily: C.sans, fontSize: "0.75rem", color: C.primary, fontWeight: 500, textDecoration: "none" }}>View All →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", color: muted, fontFamily: C.sans }}>Loading...</div>
            ) : recentProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: muted, fontFamily: C.sans" }}>
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</p>
                <p>No products yet</p>
                <Link href="/studio/products/new" style={{ fontFamily: C.sans, fontSize: "0.85rem", color: C.primary, fontWeight: 500, textDecoration: "none", display: "inline-block", marginTop: "1rem" }}>
                  Add Your First Product →
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {recentProducts.map(product => (
                  <Link href={`/studio/products/${product._id}/edit`} key={product._id} style={{ textDecoration: "none", display: "block", background: dm ? "#211c16" : C.surfaceLow, borderRadius: "0.75rem", overflow: "hidden", transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                      <img
                        src={product.image || placeholderImgs[product.category] || placeholderImgs.Pottery}
                        alt={product.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                      />
                    </div>
                    <div style={{ padding: "0.75rem" }}>
                      <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.25rem" }}>
                        {product.category}
                      </p>
                      <h4 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "0.9rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.title}
                      </h4>
                      <p style={{ fontFamily: C.sans, fontSize: "0.8rem", fontWeight: 600, color: text }}>₹{product.price}</p>
                      <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: product.stock > 0 ? "#5a7a4a" : C.primary, fontWeight: 500 }}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}