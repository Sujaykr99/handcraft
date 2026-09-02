"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
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

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CheckoutPage() {
  const { cart, clearCart, user, showToast, darkMode } = useApp();
  const router = useRouter();
  const [step, setStep] = useState("shipping");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Shipping
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    // Payment
    paymentMethod: "cod",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";
  const inputBg = dm ? "#211c16" : C.surfaceDim;

  const validItems = cart.filter(item => item.product && item.product.stock > 0);
  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Please sign in to checkout</p>
        <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, maxWidth: "400px" }}>
          You need to be logged in to place an order.
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

  if (validItems.length === 0) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Your cart is empty</p>
        <Link href="/products" style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", borderRadius: "9999px", padding: "1rem 2.5rem", textDecoration: "none" }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  const validateShipping = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit PIN code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (formData.paymentMethod === "cod") return true;
    const newErrors = {};
    if (!formData.cardNumber.replace(/\s/g, "")) newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) newErrors.cardNumber = "Enter a valid 16-digit card number";
    if (!formData.cardExpiry) newErrors.cardExpiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = "Use MM/YY format";
    if (!formData.cardCvv) newErrors.cardCvv = "CVV is required";
    else if (!/^\d{3}$/.test(formData.cardCvv)) newErrors.cardCvv = "Enter a valid 3-digit CVV";
    if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const grouped = digits.replace(/(\d{4})/g, "$1 ").trim();
    return grouped;
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "shipping") {
      if (!validateShipping()) return;
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (step === "payment") {
      if (!validatePayment()) return;
    }
    if (step === "review") {
      setLoading(true);
      try {
        const orderData = {
          items: validItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            landmark: formData.landmark,
          },
          paymentMethod: formData.paymentMethod,
          subtotal,
          shipping,
          total,
        };

        const data = await apiRequest("/api/orders", "POST", orderData);
        clearCart();
        showToast("Order placed successfully!");
        router.push(`/orders/${data._id}`);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    if (step === "payment") setStep("shipping");
    else if (step === "review") setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const steps = [
    { key: "shipping", label: "Shipping", number: 1 },
    { key: "payment", label: "Payment", number: 2 },
    { key: "review", label: "Review", number: 3 },
  ];
  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Progress Steps */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0", marginBottom: "3rem" }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  width: "100%",
                  height: "2px",
                  background: i < currentStepIndex ? C.primary : C.surfaceHigh,
                  zIndex: 0,
                }} />
              )}
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: C.sans,
                fontSize: "0.75rem",
                fontWeight: 700,
                background: i < currentStepIndex
                  ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`
                  : i === currentStepIndex
                    ? C.primary
                    : C.surfaceHigh,
                color: i <= currentStepIndex ? "white" : muted,
                border: i === currentStepIndex ? `3px solid ${C.surface}` : "none",
                zIndex: 1,
                transition: "all 0.3s",
              }}>
                {i < currentStepIndex ? "✓" : s.number}
              </div>
              <span style={{ fontFamily: C.sans, fontSize: "0.72rem", color: i <= currentStepIndex ? text : muted, marginTop: "0.5rem", fontWeight: i <= currentStepIndex ? 500 : 400 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "3rem" }}>
          {/* Form Section */}
          <div>
            {/* Shipping Step */}
            {step === "shipping" && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                    Shipping Address
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <Input
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      error={errors.fullName}
                      required
                      autoComplete="name"
                      style={{ width: "100%", background: inputBg, border: errors.fullName ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={errors.email}
                      required
                      autoComplete="email"
                      style={{ width: "100%", background: inputBg, border: errors.email ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={errors.phone}
                      required
                      placeholder="9876543210"
                      autoComplete="tel"
                      style={{ width: "100%", background: inputBg, border: errors.phone ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                    />
                    <Input
                      label="PIN Code"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      error={errors.pincode}
                      required
                      placeholder="110001"
                      autoComplete="postal-code"
                      style={{ width: "100%", background: inputBg, border: errors.pincode ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                    />
                  </div>

                  <Input
                    label="Full Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    error={errors.address}
                    required
                    placeholder="House/Flat No., Building, Street, Area"
                    autoComplete="street-address"
                    style={{ width: "100%", background: inputBg, border: errors.address ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", marginTop: "0.5rem" }}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      error={errors.city}
                      required
                      autoComplete="address-level2"
                      style={{ width: "100%", background: inputBg, border: errors.city ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                    />
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      style={{ width: "100%", background: inputBg, border: errors.state ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", cursor: "pointer" }}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>

                  <Input
                    label="Landmark (Optional)"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    placeholder="Nearby landmark for easier delivery"
                    autoComplete="address-level1"
                    style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", marginTop: "0.5rem" }}
                  />
                </div>

                <Button type="submit" size="lg" variant="primary" fullWidth>
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                    Payment Method
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", badge: "No extra charges" },
                      { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay, UPI", badge: "Secure payment" },
                      { value: "upi", label: "UPI / Net Banking", desc: "PhonePe, Google Pay, Paytm", badge: "Instant confirmation" },
                    ].map(method => (
                      <label
                        key={method.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "1rem 1.25rem",
                          background: formData.paymentMethod === method.value ? "rgba(159,64,45,0.06)" : "transparent",
                          border: formData.paymentMethod === method.value ? `2px solid ${C.primary}` : `1px solid ${borderColor}`,
                          borderRadius: "0.875rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                          style={{ accentColor: C.primary, width: "18px", height: "18px" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 500, color: text }}>{method.label}</span>
                            <span style={{ fontFamily: C.sans, fontSize: "0.65rem", fontWeight: 600, color: "white", background: C.primary, padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{method.badge}</span>
                          </div>
                          <p style={{ fontFamily: C.sans, fontSize: "0.78rem", color: muted, marginTop: "0.15rem" }}>{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.paymentMethod !== "cod" && (
                  <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                    <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Card Details</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <Input
                        label="Card Number"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                        error={errors.cardNumber}
                        required
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                        style={{ width: "100%", background: inputBg, border: errors.cardNumber ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", letterSpacing: "0.1em" }}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
                        <Input
                          label="Expiry (MM/YY)"
                          value={formData.cardExpiry}
                          onChange={(e) => handleInputChange("cardExpiry", formatExpiry(e.target.value))}
                          error={errors.cardExpiry}
                          required
                          placeholder="12/28"
                          autoComplete="cc-exp"
                          style={{ width: "100%", background: inputBg, border: errors.cardExpiry ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                        />
                        <Input
                          label="CVV"
                          type="password"
                          value={formData.cardCvv}
                          onChange={(e) => handleInputChange("cardCvv", e.target.value)}
                          error={errors.cardCvv}
                          required
                          placeholder="123"
                          autoComplete="cc-csc"
                          style={{ width: "100%", background: inputBg, border: errors.cardCvv ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                        />
                        <Input
                          label="Name on Card"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          error={errors.cardName}
                          required
                          autoComplete="cc-name"
                          style={{ width: "100%", background: inputBg, border: errors.cardName ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button type="button" onClick={goBack} variant="ghost" size="lg">
                    ← Back
                  </Button>
                  <Button type="submit" size="lg" variant="primary" fullWidth>
                    {step === "payment" ? "Continue to Review" : "Place Order"}
                  </Button>
                </div>
              </form>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                    Shipping Address
                  </h2>
                  <div style={{ fontFamily: C.sans, color: text, lineHeight: 1.8 }}>
                    <p style={{ fontWeight: 600 }}>{formData.fullName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.landmark && `${formData.landmark}, `}{formData.city}, {formData.state} - {formData.pincode}</p>
                    <p>Phone: {formData.phone}</p>
                    <p>Email: {formData.email}</p>
                  </div>
                </div>

                <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                    Payment Method
                  </h2>
                  <p style={{ fontFamily: C.sans, color: text }}>
                    {formData.paymentMethod === "cod" && "Cash on Delivery — Pay ₹" + total.toLocaleString() + " on delivery"}
                    {formData.paymentMethod === "card" && `Card ending in ${formData.cardNumber.replace(/\s/g, "").slice(-4)}`}
                    {formData.paymentMethod === "upi" && "UPI / Net Banking"}
                  </p>
                </div>

                <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${borderColor}` }}>
                    Order Items
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {validItems.map(item => (
                      <div key={item.product._id} style={{ display: "flex", gap: "1rem", padding: "1rem", background: dm ? "#211c16" : C.surfaceLow, borderRadius: "0.75rem" }}>
                        <div style={{ width: "60px", height: "60px", borderRadius: "0.5rem", overflow: "hidden", flexShrink: 0, background: C.surfaceDim }}>
                          <img src={item.product.image || placeholderImgs[item.product.category] || placeholderImgs.Pottery} alt={item.product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: C.sans, fontSize: "0.85rem", fontWeight: 500, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.title}</p>
                          <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>Qty: {item.quantity} × ₹{item.product.price}</p>
                        </div>
                        <span style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 600, color: text }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button type="button" onClick={goBack} variant="ghost" size="lg">
                    ← Back
                  </Button>
                  <Button type="submit" onClick={handleSubmit} size="lg" variant="primary" fullWidth loading={loading}>
                    {loading ? "Placing Order..." : `Place Order — ₹${total.toLocaleString()}`}
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

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", maxHeight: "300px", overflowY: "auto" }}>
                {validItems.map(item => (
                  <div key={item.product._id} style={{ display: "flex", gap: "0.75rem" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "0.5rem", overflow: "hidden", flexShrink: 0, background: C.surfaceDim }}>
                      <img src={item.product.image || placeholderImgs[item.product.category] || placeholderImgs.Pottery} alt={item.product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: C.sans, fontSize: "0.8rem", fontWeight: 500, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.title}</p>
                      <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: muted }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontFamily: C.sans, fontSize: "0.8rem", fontWeight: 600, color: text }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "1rem", borderTop: `1px solid ${borderColor}` }}>
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
                  <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: muted }}>Free shipping on orders over ₹2,000</p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: `1px solid ${borderColor}` }}>
                  <span style={{ fontFamily: C.sans, fontSize: "1rem", fontWeight: 600, color: text }}>Total</span>
                  <span style={{ fontFamily: C.sans, fontSize: "1.25rem", fontWeight: 700, color: text }}>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <p style={{ fontFamily: C.sans, fontSize: "0.7rem", color: muted, textAlign: "center", marginTop: "1.5rem" }}>
                Your order will be processed within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}