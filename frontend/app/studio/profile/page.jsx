"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";

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

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

const specialties = [
  "Pottery & Ceramics",
  "Jewellery Making",
  "Textile Weaving",
  "Embroidery",
  "Painting & Art",
  "Wood Carving",
  "Candle Making",
  "Basket Weaving",
  "Leather Craft",
  "Metal Work",
  "Glass Blowing",
  "Paper Craft",
];

export default function StudioProfilePage() {
  const { user, setUser, darkMode, showToast } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    specialties: [],
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      website: "",
    },
  });

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
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/api/users/profile");
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
          specialties: data.specialties || [],
          socialLinks: data.socialLinks || { instagram: "", facebook: "", twitter: "", website: "" },
        });
        if (data.avatar) setAvatarPreview(data.avatar);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleChange = (field, value) => {
    if (field.startsWith("socialLinks.")) {
      const key = field.split(".")[1];
      setForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else if (field === "specialties") {
      setForm(prev => ({ ...prev, specialties: value }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleSpecialty = (specialty) => {
    const current = form.specialties;
    const updated = current.includes(specialty)
      ? current.filter(s => s !== specialty)
      : [...current, specialty];
    handleChange("specialties", updated);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "specialties") {
          value.forEach(v => formData.append("specialties", v));
        } else if (key === "socialLinks") {
          Object.entries(value).forEach(([k, v]) => formData.append(`socialLinks.${k}`, v));
        } else {
          formData.append(key, value);
        }
      });
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      setUser({ ...user, ...data });
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: C.sans, color: muted }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-4xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/studio" style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Studio
          </Link>
          <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
            Studio Profile
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginTop: "0.5rem" }}>
            Manage how your artisan profile appears to customers
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Avatar */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Profile Photo</h2>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.primary}`, background: C.surfaceDim }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, fontFamily: C.sans, fontSize: "2.5rem", fontWeight: 700, color: "white" }}>
                      {form.name?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                </div>
                <label style={{ position: "absolute", bottom: "0", right: "0", width: "36px", height: "36px", borderRadius: "50%", background: C.primary, color: "white", border: `3px solid ${bg}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                  ✎
                </label>
              </div>
              <div>
                <p style={{ fontFamily: C.sans, fontSize: "0.9rem", fontWeight: 500, color: text, marginBottom: "0.5rem" }}>Update your photo</p>
                <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: muted }}>JPG/PNG, max 2MB. Square images work best.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Basic Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Input
                label="Display Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                required
                autoComplete="name"
                style={{ width: "100%", background: inputBg, border: errors.name ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                required
                autoComplete="email"
                disabled
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: muted, outline: "none", opacity: 0.7 }}
              />
              <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: muted }}>Email cannot be changed. Contact support if needed.</p>
              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
                placeholder="9876543210"
                autoComplete="tel"
                style={{ width: "100%", background: inputBg, border: errors.phone ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Input
                label="Location (City, State)"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., Jaipur, Rajasthan"
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Your Story</h2>
            <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginBottom: "1rem" }}>
              Share your journey, craft philosophy, or what inspires your work. This appears on your public profile.
            </p>
            <Textarea
              label="Bio"
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="I've been practicing the art of... for over 20 years. Each piece I create..."
              rows={5}
              style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", resize: "vertical" }}
            />
          </div>

          {/* Specialties */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Craft Specialties</h2>
            <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginBottom: "1rem" }}>
              Select all that apply. These appear as tags on your profile.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {specialties.map(specialty => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  style={{
                    fontFamily: C.sans,
                    fontSize: "0.8rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    border: form.specialties.includes(specialty) ? "none" : `1px solid ${borderColor}`,
                    background: form.specialties.includes(specialty) ? `rgba(159,64,45,0.15)` : "transparent",
                    color: form.specialties.includes(specialty) ? C.primary : muted,
                    fontWeight: form.specialties.includes(specialty) ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Social Links</h2>
            <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginBottom: "1rem" }}>
              Add links to your social profiles or website. These appear on your public profile.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { key: "instagram", label: "Instagram", placeholder: "@yourhandle" },
                { key: "facebook", label: "Facebook", placeholder: "facebook.com/yourpage" },
                { key: "twitter", label: "Twitter/X", placeholder: "@yourhandle" },
                { key: "website", label: "Website", placeholder: "https://yourwebsite.com" },
              ].map(social => (
                <Input
                  key={social.key}
                  label={social.label}
                  value={form.socialLinks[social.key]}
                  onChange={(e) => handleChange(`socialLinks.${social.key}`, e.target.value)}
                  placeholder={social.placeholder}
                  style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                fontFamily: C.sans,
                fontSize: "0.9rem",
                fontWeight: 600,
                border: `1px solid ${borderColor}`,
                color: text,
                borderRadius: "9999px",
                padding: "1rem 2rem",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <Button type="submit" size="lg" variant="primary" loading={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}