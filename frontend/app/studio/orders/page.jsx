"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  pending: { label: "Pending", color: "#9f402d", bg: "rgba(159,64,45,0.1)", next: "confirmed" },
  confirmed: { label: "Confirmed", color: "#3a7a4a", bg: "rgba(58,122,74,0.1)", next: "processing" },
  processing: { label: "Processing", color: "#b8860b", bg: "rgba(184,134,11,0.1)", next: "shipped" },
  shipped: { label: "Shipped", color: "#1e4d8c", bg: "rgba(30,77,140,0.1)", next: "delivered" },
  delivered: { label: "Delivered", color: "#5a7a4a", bg: "rgba(90,122,74,0.1)", next: null },
  cancelled: { label: "Cancelled", color: "#9f402d", bg: "rgba(159,64,45,0.1)", next: null },
};

const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function StudioOrdersPage() {
  const { user, darkMode, showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

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
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/orders/artisan");
        setOrders(data.orders || data);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showToast]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiRequest(`/api/orders/${orderId}/status`, "PUT", { status: newStatus });
      showToast(`Order marked as ${statusConfig[newStatus].label}`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => !filterStatus || o.status === filterStatus);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.4rem" }}>Order Management</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
              Orders ({orders.length})
            </h1>
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {statusOrder.map(status => {
            const count = orders.filter(o => o.status === status).length;
            const config = statusConfig[status];
            return (
              <div key={status} style={{ background: cardBg, borderRadius: "1rem", padding: "1.25rem", border: `1px solid ${borderColor}`, textAlign: "center" }}>
                <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: muted, marginBottom: "0.5rem" }}>{config.label}</p>
                <p style={{ fontFamily: C.sans, fontSize: "2rem", fontWeight: 700, color: config.color }}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div style={{ background: cardBg, borderRadius: "1rem", padding: "1rem 1.5rem", border: `1px solid ${borderColor}`, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: C.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary }}>Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ background: inputBg, border: "none", borderRadius: "0.5rem", padding: "0.5rem 1rem", fontFamily: C.sans, fontSize: "0.85rem", color: text, outline: "none", cursor: "pointer" }}
          >
            <option value="">All Statuses</option>
            {statusOrder.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
            <option value="cancelled">Cancelled</option>
          </select>
          <span style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted }}>
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: "1rem", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr auto auto", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{ height: "80px", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "0.5rem" }} />
                  <div>
                    <div style={{ height: "16px", width: "60%", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px", marginBottom: "0.5rem" }} />
                    <div style={{ height: "12px", width: "40%", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px" }} />
                  </div>
                  <div style={{ height: "28px", width: "100px", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "9999px" }} />
                  <div style={{ height: "36px", width: "120px", background: "linear-gradient(90deg, #ede7df 25%, #e8e1da 50%, #ede7df 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "0.5rem" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted, marginBottom: "0.5rem" }}>No orders found</p>
            <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>
              {filterStatus ? "Try changing the filter" : "Orders will appear here when customers purchase your products"}
            </p>
          </div>
        ) : (
          <div style={{ background: cardBg, borderRadius: "1.25rem", border: `1px solid ${borderColor}`, overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 140px 160px 180px", gap: "1rem", padding: "1rem 1.5rem", background: dm ? "#211c16" : C.surfaceLow, borderBottom: `1px solid ${borderColor}`, fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, fontWeight: 600 }}>
              <span>Image</span>
              <span>Product / Customer</span>
              <span>Qty</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Table Rows */}
            {filteredOrders.map((order, index) => (
              <div
                key={order._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 140px 140px 160px 180px",
                  gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  alignItems: "center",
                  borderBottom: index < filteredOrders.length - 1 ? `1px solid ${borderColor}` : "none",
                  transition: "background 0.2s",
                }}
              >
                {/* Product Image */}
                <div style={{ width: "70px", height: "70px", borderRadius: "0.5rem", overflow: "hidden", background: C.surfaceDim }}>
                  {order.items[0]?.product?.image && (
                    <img src={order.items[0].product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>

                {/* Product / Customer Info */}
                <div style={{ minWidth: 0 }}>
                  <Link href={`/studio/orders/${order._id}`} style={{ textDecoration: "none" }}>
                    <p style={{ fontFamily: C.sans, fontSize: "0.85rem", fontWeight: 500, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {order.items[0]?.product?.title || "Product"}
                    </p>
                  </Link>
                  <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted, marginTop: "0.25rem" }}>
                    {order.items.length > 1 && `+${order.items.length - 1} more • `}
                    {order.shippingAddress?.fullName || "Customer"}
                  </p>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: muted }}>
                    #{order._id.slice(-8).toUpperCase()} • {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Quantity */}
                <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>

                {/* Amount */}
                <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>
                  ₹{order.total.toLocaleString()}
                </span>

                {/* Status Badge */}
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    disabled={updatingId === order._id || order.status === "delivered" || order.status === "cancelled"}
                    style={{
                      background: statusConfig[order.status].bg,
                      color: statusConfig[order.status].color,
                      border: "none",
                      borderRadius: "9999px",
                      padding: "0.35rem 0.85rem",
                      fontFamily: C.sans,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      cursor: updatingId === order._id ? "not-allowed" : "pointer",
                      outline: "none",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23${statusConfig[order.status].color.slice(1)}' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      paddingRight: "2rem",
                    }}
                  >
                    {statusOrder.map(s => (
                      <option key={s} value={s} style={{ background: cardBg, color: text }}>
                        {statusConfig[s].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/studio/orders/${order._id}`} style={{ flex: 1, textAlign: "center" }}>
                    <Button variant="outline" size="sm" fullWidth>
                      View
                    </Button>
                  </Link>
                  {order.status !== "delivered" && order.status !== "cancelled" && statusConfig[order.status].next && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusUpdate(order._id, statusConfig[order.status].next)}
                      loading={updatingId === order._id}
                      fullWidth
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}