"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useApp } from "@/context/AppContext";

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
  pending: { label: "Order Placed", color: "#9f402d", bg: "rgba(159,64,45,0.1)", icon: "⏳" },
  confirmed: { label: "Confirmed", color: "#3a7a4a", bg: "rgba(58,122,74,0.1)", icon: "✓" },
  processing: { label: "Processing", color: "#b8860b", bg: "rgba(184,134,11,0.1)", icon: "⚙️" },
  shipped: { label: "Shipped", color: "#1e4d8c", bg: "rgba(30,77,140,0.1)", icon: "📦" },
  delivered: { label: "Delivered", color: "#5a7a4a", bg: "rgba(90,122,74,0.1)", icon: "✅" },
  cancelled: { label: "Cancelled", color: "#9f402d", bg: "rgba(159,64,45,0.1)", icon: "✕" },
};

const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];

function OrderCard({ order, darkMode }) {
  const dm = darkMode;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const status = statusConfig[order.status] || statusConfig.pending;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link href={`/orders/${order._id}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "1.5rem", border: `1px solid ${borderColor}`, transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,27,23,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary }}>Order</span>
              <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 700, color: text, fontFamily: "monospace" }}>{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted }}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ background: status.bg, color: status.color, padding: "0.5rem 1rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>{status.icon}</span>
              <span style={{ fontFamily: C.sans, fontSize: "0.75rem", fontWeight: 600 }}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} style={{ flexShrink: 0, width: "70px" }}>
              <div style={{ aspectRatio: "1", borderRadius: "0.5rem", overflow: "hidden", background: C.surfaceDim }}>
                <img
                  src={item.product?.image || placeholderImgs[item.product?.category] || placeholderImgs.Pottery}
                  alt={item.product?.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: muted, marginTop: "0.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.product?.title || "Product"}
              </p>
            </div>
          ))}
          {order.items.length > 3 && (
            <div style={{ flexShrink: 0, width: "70px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ aspectRatio: "1", borderRadius: "0.5rem", background: C.surfaceDim, display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${borderColor}` }}>
                <span style={{ fontFamily: C.sans, fontSize: "0.75rem", fontWeight: 600, color: muted }}>+{order.items.length - 3}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: "1rem" }}>
          <div style={{ display: "flex", gap: "0", position: "relative" }}>
            {statusOrder.map((s, i) => {
              const stepStatus = statusConfig[s];
              const isActive = statusOrder.indexOf(order.status) >= i;
              const isCurrent = order.status === s;
              return (
                <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    background: isActive ? stepStatus.color : borderColor,
                    color: isActive ? "white" : muted,
                    border: isCurrent ? `3px solid ${cardBg}` : "none",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}>
                    {isActive ? "✓" : stepStatus.icon}
                  </div>
                  <p style={{ fontFamily: C.sans, fontSize: "0.6rem", color: isActive ? text : muted, marginTop: "0.5rem", textAlign: "center", fontWeight: isActive ? 500 : 400 }}>
                    {stepStatus.label}
                  </p>
                  {i < statusOrder.length - 1 && (
                    <div style={{
                      position: "absolute",
                      top: "14px",
                      left: "50%",
                      width: "100%",
                      height: "2px",
                      background: i < statusOrder.indexOf(order.status) ? statusConfig[statusOrder[i + 1]].color : borderColor,
                      zIndex: 1,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: `1px solid ${borderColor}` }}>
          <span style={{ fontFamily: C.sans, fontSize: "1.1rem", fontWeight: 700, color: text }}>
            ₹{order.total.toLocaleString()}
          </span>
          <span style={{ fontFamily: C.sans, fontSize: "0.75rem", color: C.primary, fontWeight: 500 }}>
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { user, darkMode, showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/orders");
        setOrders(data);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, showToast]);

  if (!user) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Please sign in to view orders</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          Your order history will appear here once you're logged in.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link href="/signup" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, border: `2px solid ${C.primary}`, color: C.primary, borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Order History</p>
          <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
            My Orders
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginTop: "0.5rem" }}>
            Track and manage all your HandArt purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📦</div>
            <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.75rem", color: muted, marginBottom: "1rem" }}>
              No orders yet
            </p>
            <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px", margin: "0 auto 2rem" }}>
              Your order history will appear here once you make a purchase.
            </p>
            <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none", display: "inline-block" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map(order => (
              <OrderCard key={order._id} order={order} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}