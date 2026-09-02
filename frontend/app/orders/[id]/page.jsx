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

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, darkMode, showToast } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, router]);

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", color: muted }}>Order not found</p>
        <Link href="/orders" style={{ fontFamily: C.sans, fontSize: "0.85rem", color: C.primary, textDecoration: "none" }}>← Back to Orders</Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const currentStatusIndex = statusOrder.indexOf(order.status);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    setCancelling(true);
    try {
      await apiRequest(`/api/orders/${id}/cancel`, "POST");
      showToast("Order cancelled successfully");
      router.refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <Link href="/orders" style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </Link>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: status.bg, color: status.color, padding: "0.75rem 1.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{status.icon}</span>
              <span style={{ fontFamily: C.sans, fontSize: "0.85rem", fontWeight: 600 }}>{status.label}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "3rem" }}>
          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Order Items */}
            <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                Order Items ({order.items.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem", padding: "1rem", background: dm ? "#211c16" : C.surfaceLow, borderRadius: "0.75rem" }}>
                    <Link href={`/products/${item.product._id}`} style={{ flexShrink: 0 }}>
                      <div style={{ width: "100px", height: "100px", borderRadius: "0.75rem", overflow: "hidden", background: C.surfaceDim }}>
                        <img
                          src={item.product.image || placeholderImgs[item.product.category] || placeholderImgs.Pottery}
                          alt={item.product.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.product._id}`} style={{ textDecoration: "none" }}>
                        <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.25rem" }}>
                          {item.product.category}
                        </p>
                        <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: text, marginBottom: "0.25rem", lineHeight: 1.3 }}>
                          {item.product.title}
                        </h3>
                      </Link>
                      {item.product.seller && (
                        <Link href={`/artisans/${item.product.seller._id}`} style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted, textDecoration: "none" }}>
                          by {item.product.seller.name}
                        </Link>
                      )}
                      <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted, marginTop: "0.5rem" }}>
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: C.sans, fontSize: "1.1rem", fontWeight: 700, color: text }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Timeline */}
            <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "2rem" }}>Order Progress</h2>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "0", bottom: "0", width: "2px", background: borderColor, zIndex: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {statusOrder.map((s, i) => {
                    const stepStatus = statusConfig[s];
                    const isCompleted = currentStatusIndex > i;
                    const isCurrent = currentStatusIndex === i;
                    const isFuture = currentStatusIndex < i;
                    return (
                      <div key={s} style={{ display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
                        <div style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                          background: isCompleted || isCurrent ? stepStatus.color : borderColor,
                          color: isCompleted || isCurrent ? "white" : muted,
                          border: isCurrent ? `3px solid ${cardBg}` : "none",
                          transition: "all 0.3s",
                        }}>
                          {isCompleted ? "✓" : stepStatus.icon}
                        </div>
                        <div style={{ flex: 1, paddingTop: "0.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                            <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", fontWeight: 400, color: isCompleted || isCurrent ? text : muted }}>
                              {stepStatus.label}
                            </h3>
                            {isCurrent && (
                              <span style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 600, color: "white", background: stepStatus.color, padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>Current</span>
                            )}
                          </div>
                          <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: muted }}>
                            {isCompleted ? `Completed on ${order.updatedAt ? formatDate(order.updatedAt) : "—"}` : "Waiting..."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Shipping Address</h2>
              <div style={{ fontFamily: C.sans, color: text, lineHeight: 1.8 }}>
                <p style={{ fontWeight: 600 }}>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.landmark && <p>{order.shippingAddress.landmark}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Payment Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Payment Method</p>
                  <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: text }}>
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "card" ? "Credit / Debit Card" : "UPI / Net Banking"}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Payment Status</p>
                  <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: order.paymentStatus === "paid" ? "#5a7a4a" : order.paymentStatus === "pending" ? "#b8860b" : C.primary }}>
                    {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "pending" ? "Pending" : "Failed"}
                  </p>
                </div>
                {order.paymentMethod !== "cod" && order.transactionId && (
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.35rem" }}>Transaction ID</p>
                    <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: text, fontFamily: "monospace" }}>{order.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cancel Button for eligible orders */}
            {["pending", "confirmed"].includes(order.status) && (
              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}`, borderLeft: `4px solid ${C.primary}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.1rem", fontWeight: 400, color: text, marginBottom: "0.25rem" }}>Need to cancel?</p>
                    <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted }}>
                      Orders can be cancelled before they are shipped. Refunds will be processed within 5-7 business days.
                    </p>
                  </div>
                  <Button onClick={handleCancel} variant="danger" loading={cancelling} size="lg">
                    Cancel Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
              <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>Subtotal</span>
                  <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted }}>Shipping</span>
                  <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>
                    {order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString()}`}
                  </span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#5a7a4a" }}>
                    <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 500 }}>Discount</span>
                    <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600 }}>−₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: `1px solid ${borderColor}` }}>
                  <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text }}>Total Paid</span>
                  <span style={{ fontFamily: C.sans, fontSize: "1.25rem", fontWeight: 700, color: text }}>₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ paddingTop: "1rem", borderTop: `1px solid ${borderColor}` }}>
                <p style={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "0.5rem" }}>Order Details</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: C.sans, fontSize: "0.82rem", color: muted }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Order Date</span>
                    <span style={{ color: text, fontWeight: 500 }}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Order ID</span>
                    <span style={{ color: text, fontWeight: 500, fontFamily: "monospace" }}>{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(159,64,45,0.06)", borderRadius: "1rem", border: `1px solid rgba(159,64,45,0.2)` }}>
              <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", fontWeight: 400, color: text, marginBottom: "0.5rem" }}>Need Help?</p>
              <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginBottom: "1rem" }}>
                Contact the artisan directly or reach out to our support team.
              </p>
              {order.items[0]?.product?.seller && (
                <Link href={`/artisans/${order.items[0].product.seller._id}`} style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, fontWeight: 500, textDecoration: "none" }}>
                  Contact {order.items[0].product.seller.name} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}