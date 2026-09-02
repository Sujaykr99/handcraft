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
  surfaceDim: "#ede7df",
  surfaceHigh: "#e8e1da",
  onSurface: "#1e1b17",
  muted: "#6b6560",
};

export default function LoginPage() {
  const { setUser, showToast, darkMode } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const inputBg = dm ? "#211c16" : C.surfaceDim;

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apiRequest("/api/auth/login", "POST", { email, password });
      localStorage.setItem("token", data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      showToast(`Welcome back, ${data.name.split(" ")[0]}!`);
      router.push(data.role === "artisan" ? "/studio" : "/my-account");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: C.sans,
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.primary,
            marginBottom: "0.75rem",
          }}>
            Welcome Back
          </p>
          <h1 style={{
            fontFamily: C.serif,
            fontStyle: "italic",
            fontSize: "2.5rem",
            fontWeight: 400,
            color: text,
            marginBottom: "0.5rem",
          }}>
            Sign In
          </h1>
          <p style={{
            fontFamily: C.sans,
            fontSize: "0.82rem",
            color: muted,
          }}>
            to your HandArt account
          </p>
        </div>
        <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2.5rem", boxShadow: "0 8px 40px rgba(30,27,23,0.07)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
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
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
              placeholder="••••••••"
              error={errors.password}
              required
              autoComplete="current-password"
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
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
              loading={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
        <p style={{ textAlign: "center", fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginTop: "1.5rem" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: C.primary, fontWeight: 500, textDecoration: "none" }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}