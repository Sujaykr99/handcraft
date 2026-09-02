"use client";

import { useState } from "react";
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

const roles = [
  {
    value: "buyer",
    emoji: "🛍️",
    title: "I am a Buyer",
    subtitle: "Shop handmade crafts",
    perks: [
      "Browse thousands of handmade items",
      "Buy directly from artisans",
      "Save items to wishlist",
      "Track your orders",
    ],
    bg: "#faf2ea",
    border: "#e8d5c4",
  },
  {
    value: "artisan",
    emoji: "🏺",
    title: "I am an Artisan",
    subtitle: "Sell your handmade crafts",
    perks: [
      "List your handmade products",
      "Receive payments directly",
      "Manage your orders",
      "Build your artisan profile",
    ],
    bg: "rgba(159,64,45,0.05)",
    border: "rgba(159,64,45,0.25)",
  },
];

export default function SignupPage() {
  const { setUser, showToast, darkMode } = useApp();
  const router = useRouter();
  const [step, setStep] = useState("role");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const inputBg = dm ? "#211c16" : C.surfaceDim;
  const dimBg = dm ? "#211c16" : C.surfaceLow;

  const validateStep1 = () => {
    if (!form.role) {
      setErrors({ role: "Please select a role" });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
    setStep("details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const data = await apiRequest("/api/auth/signup", "POST", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      localStorage.setItem("token", data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      showToast(`Welcome to HandArt, ${data.name.split(" ")[0]}!`);
      router.push(data.role === "artisan" ? "/studio" : "/my-account");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "2rem 0 0" }}>
        {["Choose Role", "Your Details"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: C.sans, fontSize: "0.75rem", fontWeight: 700,
              background: (step === "role" && i === 0) || (step === "details" && i <= 1)
                ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`
                : C.surfaceHigh,
              color: (step === "role" && i === 0) || (step === "details" && i <= 1) ? "white" : muted,
              transition: "all 0.3s"
            }}>
              {step === "details" && i === 0 ? "✓" : i + 1}
            </div>
            <span style={{ fontFamily: C.sans, fontSize: "0.78rem", color: i === (step === "role" ? 0 : 1) ? text : muted }}>
              {label}
            </span>
            {i === 0 && <div style={{ width: "40px", height: "1px", background: step === "details" ? C.primary : C.surfaceHigh, transition: "background 0.3s" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Role selection */}
      {step === "role" && (
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: C.sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: "0.75rem" }}>
              Join HandArt
            </p>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2.75rem", fontWeight: 400, color: text, marginBottom: "0.5rem" }}>
              Who are you?
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: "0.88rem", color: muted }}>
              Choose your role to get started
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {roles.map(role => (
              <div key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                style={{
                  background: dm ? "#2a2218" : role.bg,
                  border: `2px solid ${dm ? "rgba(159,64,45,0.2)" : role.border}`,
                  borderRadius: "1.25rem", padding: "2.5rem 2rem",
                  cursor: "pointer", transition: "all 0.25s",
                  position: "relative", overflow: "hidden"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(30,27,23,0.12)";
                  e.currentTarget.style.borderColor = C.primary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = dm ? "rgba(159,64,45,0.2)" : role.border;
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1.25rem" }}>{role.emoji}</div>
                <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "0.3rem" }}>
                  {role.title}
                </h2>
                <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: C.primary, fontWeight: 500, marginBottom: "1.5rem" }}>
                  {role.subtitle}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {role.perks.map(perk => (
                    <div key={perk} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                      <span style={{ color: C.primary, fontSize: "0.75rem", marginTop: "2px", flexShrink: 0 }}>✦</span>
                      <span style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, lineHeight: 1.5 }}>{perk}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", fontFamily: C.sans, fontSize: "0.78rem", color: C.primary, fontWeight: 500 }}>
                  Select →
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginTop: "2rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: C.primary, fontWeight: 500, textDecoration: "none" }}>Sign in →</Link>
          </p>
        </div>
      )}

      {/* STEP 2 — Details form */}
      {step === "details" && (
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "3rem 2rem 4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: dimBg, borderRadius: "9999px", padding: "0.5rem 1.25rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>
                {form.role === "artisan" ? "🏺" : "🛍️"}
              </span>
              <span style={{ fontFamily: C.sans, fontSize: "0.82rem", color: text, fontWeight: 500 }}>
                {form.role === "artisan" ? "Artisan Account" : "Buyer Account"}
              </span>
              <button onClick={() => setStep("role")} style={{ fontFamily: C.sans, fontSize: "0.72rem", color: C.primary, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Change
              </button>
            </div>
            <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "2.25rem", fontWeight: 400, color: text, marginBottom: "0.4rem" }}>
              Your Details
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted }}>
              {form.role === "artisan"
                ? "Set up your artisan studio account"
                : "Create your buyer account to start shopping"}
            </p>
          </div>

          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2.5rem", boxShadow: "0 8px 40px rgba(30,27,23,0.07)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Input
                label={form.role === "artisan" ? "Artisan Name" : "Full Name"}
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors(prev => ({ ...prev, name: "" })); }}
                placeholder={form.role === "artisan" ? "Your craft name or studio name" : "Your full name"}
                error={errors.name}
                required
                autoComplete="name"
                style={{
                  width: "100%",
                  background: inputBg,
                  border: errors.name ? "2px solid #9f402d" : "none",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1.1rem",
                  fontFamily: C.sans,
                  fontSize: "0.875rem",
                  color: text,
                  outline: "none",
                }}
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors(prev => ({ ...prev, email: "" })); }}
                placeholder="you@example.com"
                error={errors.email}
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  background: inputBg,
                  border: errors.email ? "2px solid #9f402d" : "none",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1.1rem",
                  fontFamily: C.sans,
                  fontSize: "0.875rem",
                  color: text,
                  outline: "none",
                }}
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors(prev => ({ ...prev, password: "" })); }}
                placeholder="Min 6 characters"
                error={errors.password}
                required
                autoComplete="new-password"
                style={{
                  width: "100%",
                  background: inputBg,
                  border: errors.password ? "2px solid #9f402d" : "none",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1.1rem",
                  fontFamily: C.sans,
                  fontSize: "0.875rem",
                  color: text,
                  outline: "none",
                }}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors(prev => ({ ...prev, confirmPassword: "" })); }}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                style={{
                  width: "100%",
                  background: inputBg,
                  border: errors.confirmPassword ? "2px solid #9f402d" : "none",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1.1rem",
                  fontFamily: C.sans,
                  fontSize: "0.875rem",
                  color: text,
                  outline: "none",
                }}
              />

              {form.role === "artisan" && (
                <div style={{ background: "rgba(159,64,45,0.06)", borderRadius: "0.875rem", padding: "1rem 1.25rem", display: "flex", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>ℹ️</span>
                  <p style={{ fontFamily: C.sans, fontSize: "0.78rem", color: muted, lineHeight: 1.65 }}>
                    After signing up, you can immediately start listing your handmade products from your Artisan Studio dashboard.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                size="lg"
                loading={loading}
              >
                {loading
                  ? "Creating account..."
                  : form.role === "artisan"
                    ? "Open My Artisan Studio →"
                    : "Start Shopping →"}
              </Button>
            </form>
          </div>

          <p style={{ textAlign: "center", fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: C.primary, fontWeight: 500, textDecoration: "none" }}>Sign in →</Link>
          </p>
        </div>
      )}
    </div>
  );
}