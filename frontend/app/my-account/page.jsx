"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function MyAccountPage() {
  const { user, setUser, darkMode, showToast, logout } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    landmark: user?.landmark || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2rem", color: text }}>Please sign in to access your account</p>
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const data = await apiRequest("/api/users/profile", "PUT", profileForm);
      setUser({ ...user, ...data });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      await apiRequest("/api/users/password", "PUT", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (form, field, value) => {
    if (form === "profile") setProfileForm(prev => ({ ...prev, [field]: value }));
    else setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (errors.submit) setErrors(prev => ({ ...prev, submit: "" }));
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: "👤" },
    { key: "security", label: "Security", icon: "🔒" },
    { key: "addresses", label: "Addresses", icon: "📍" },
    { key: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "2rem 2rem 4rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: "3rem" }}>
        {/* Sidebar */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${borderColor}` }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: C.sans, fontSize: "1.25rem", fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.1rem", fontWeight: 400, color: text }}>{user.name}</p>
                <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>{user.email}</p>
                <span style={{
                  fontFamily: C.sans,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  background: user.role === "artisan" ? "rgba(159,64,45,0.15)" : "rgba(90,122,74,0.15)",
                  color: user.role === "artisan" ? C.primary : "#5a7a4a",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  display: "inline-block",
                  marginTop: "0.35rem",
                }}>
                  {user.role === "artisan" ? "Artisan" : "Buyer"}
                </span>
              </div>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: activeTab === tab.key ? `rgba(159,64,45,0.1)` : "transparent",
                    border: "none",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontFamily: C.sans,
                    fontSize: "0.85rem",
                    color: activeTab === tab.key ? C.primary : muted,
                    fontWeight: activeTab === tab.key ? 500 : 400,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <Button onClick={logout} variant="ghost" fullWidth style={{ marginTop: "1.5rem" }}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {errors.submit && (
            <div style={{ background: "rgba(159,64,45,0.1)", border: `1px solid ${C.primary}`, borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.5rem", color: C.primary, fontFamily: C.sans, fontSize: "0.85rem" }}>
              {errors.submit}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(90,122,74,0.1)", border: `1px solid #5a7a4a`, borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.5rem", color: "#5a7a4a", fontFamily: C.sans, fontSize: "0.85rem" }}>
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Personal Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <Input
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => handleInputChange("profile", "name", e.target.value)}
                    error={errors.name}
                    required
                    autoComplete="name"
                    style={{ width: "100%", background: inputBg, border: errors.name ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                    error={errors.email}
                    required
                    autoComplete="email"
                    style={{ width: "100%", background: inputBg, border: errors.email ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                    error={errors.phone}
                    placeholder="9876543210"
                    autoComplete="tel"
                    style={{ width: "100%", background: inputBg, border: errors.phone ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                </div>
                <Button type="submit" size="lg" variant="primary" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Change Password</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "480px" }}>
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handleInputChange("security", "currentPassword", e.target.value)}
                    error={errors.currentPassword}
                    required
                    autoComplete="current-password"
                    style={{ width: "100%", background: inputBg, border: errors.currentPassword ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handleInputChange("security", "newPassword", e.target.value)}
                    error={errors.newPassword}
                    required
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                    style={{ width: "100%", background: inputBg, border: errors.newPassword ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handleInputChange("security", "confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                    required
                    autoComplete="new-password"
                    style={{ width: "100%", background: inputBg, border: errors.confirmPassword ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                </div>
                <Button type="submit" size="lg" variant="primary" loading={loading} style={{ maxWidth: "480px" }}>
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Saved Address</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <Input
                    label="Full Address"
                    value={profileForm.address}
                    onChange={(e) => handleInputChange("profile", "address", e.target.value)}
                    error={errors.address}
                    placeholder="House/Flat No., Building, Street, Area"
                    autoComplete="street-address"
                    style={{ width: "100%", background: inputBg, border: errors.address ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", gridColumn: "1 / -1" }}
                  />
                  <Input
                    label="City"
                    value={profileForm.city}
                    onChange={(e) => handleInputChange("profile", "city", e.target.value)}
                    error={errors.city}
                    autoComplete="address-level2"
                    style={{ width: "100%", background: inputBg, border: errors.city ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <select
                    value={profileForm.state}
                    onChange={(e) => handleInputChange("profile", "state", e.target.value)}
                    style={{ width: "100%", background: inputBg, border: errors.state ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", cursor: "pointer" }}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <Input
                    label="PIN Code"
                    value={profileForm.pincode}
                    onChange={(e) => handleInputChange("profile", "pincode", e.target.value)}
                    error={errors.pincode}
                    placeholder="110001"
                    autoComplete="postal-code"
                    style={{ width: "100%", background: inputBg, border: errors.pincode ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                  />
                  <Input
                    label="Landmark (Optional)"
                    value={profileForm.landmark}
                    onChange={(e) => handleInputChange("profile", "landmark", e.target.value)}
                    placeholder="Nearby landmark for easier delivery"
                    autoComplete="address-level1"
                    style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", gridColumn: "1 / -1" }}
                  />
                </div>
                <Button type="submit" size="lg" variant="primary" loading={loading}>
                  Save Address
                </Button>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Notifications</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { id: "emailOrders", label: "Order Updates", desc: "Receive email notifications for order status changes" },
                    { id: "emailPromotions", label: "Promotions", desc: "Get notified about sales and new arrivals" },
                    { id: "emailNewsletter", label: "Newsletter", desc: "Weekly curated crafts and artisan stories" },
                    { id: "pushOrders", label: "Push Notifications", desc: "Browser notifications for order updates" },
                  ].map(pref => (
                    <label key={pref.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: dm ? "#211c16" : C.surfaceLow, borderRadius: "0.75rem" }}>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: "0.85rem", fontWeight: 500, color: text }}>{pref.label}</p>
                        <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>{pref.desc}</p>
                      </div>
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked={pref.id !== "emailPromotions"} style={{ accentColor: C.primary, width: "18px", height: "18px" }} />
                        <span style={{ width: "44px", height: "24px", background: "rgba(159,64,45,0.2)", borderRadius: "9999px", display: "block", marginLeft: "0.5rem", position: "relative" }}>
                          <span style={{ position: "absolute", top: "2px", left: "2px", width: "20px", height: "20px", background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                        </span>
                      </label>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Data & Privacy</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <Button variant="outline" onClick={() => showToast("Data export feature coming soon")}>
                    Download My Data
                  </Button>
                  <Button variant="outline" onClick={() => showToast("Account deletion is permanent. Contact support to proceed.")} variant="danger">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}