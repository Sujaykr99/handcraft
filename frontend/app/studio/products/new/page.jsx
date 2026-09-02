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

const categories = [
  { value: "Pottery", label: "Pottery & Ceramics" },
  { value: "Jewellery", label: "Jewellery" },
  { value: "Textiles", label: "Textiles & Fabrics" },
  { value: "Paintings", label: "Paintings & Art" },
  { value: "Woodwork", label: "Woodwork" },
  { value: "Candles", label: "Candles & Home Fragrance" },
  { value: "Baskets", label: "Baskets & Weaving" },
  { value: "Leather", label: "Leather Goods" },
];

export default function NewProductPage() {
  const { user, darkMode, showToast } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    materials: "",
    dimensions: "",
    tags: "",
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
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Product title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.price) newErrors.price = "Price is required";
    else if (Number(form.price) <= 0) newErrors.price = "Price must be greater than 0";
    if (!form.stock) newErrors.stock = "Stock quantity is required";
    else if (Number(form.stock) < 0) newErrors.stock = "Stock cannot be negative";
    if (images.length === 0) newErrors.images = "At least one product image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleImageUpload = (files) => {
    const newFiles = Array.from(files).slice(0, 5 - images.length);
    const validFiles = newFiles.filter(f => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);

    if (validFiles.length !== newFiles.length) {
      showToast("Only image files under 5MB are allowed", "error");
    }

    setImages(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex >= index && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // For now, we'll send the first image as base64
      // In production, you'd upload to cloudinary/s3 first
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      images.forEach((img, i) => {
        formData.append("images", img);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create product");

      showToast("Product created successfully!");
      router.push("/studio/products");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingTop: "80px" }}>
      <div className="max-w-4xl mx-auto" style={{ padding: "2rem 2rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/studio/products" style={{ fontFamily: C.sans, fontSize: "0.82rem", color: C.primary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <h1 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 400, color: text }}>
            Add New Product
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: muted, marginTop: "0.5rem" }}>
            Fill in the details below to list your handmade creation
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Images Section */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Product Images</h2>
            <p style={{ fontFamily: C.sans, fontSize: "0.82rem", color: muted, marginBottom: "1.5rem" }}>
              Upload up to 5 images. The first image will be used as the main thumbnail. Drag & drop or click to upload.
            </p>

            {/* Image Previews */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: "relative", aspectRatio: "1", borderRadius: "0.75rem", overflow: "hidden", border: index === mainImageIndex ? `2px solid ${C.primary}` : `1px solid ${borderColor}` }}>
                  <img src={preview} alt={`Product image ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMainImageIndex(index)}
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        left: "0.5rem",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: index === mainImageIndex ? C.primary : "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {index === mainImageIndex ? "✓" : "★"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(159,64,45,0.9)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Upload Zone */}
              {images.length < 5 && (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragging(false); }}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("image-upload")?.click()}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "0.75rem",
                    border: `2px dashed ${dragging ? C.primary : borderColor}`,
                    background: dragging ? `rgba(159,64,45,0.05)` : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="32" height="32" fill="none" stroke={dragging ? C.primary : muted} strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: "0.5rem" }}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: dragging ? C.primary : muted, textAlign: "center" }}>
                    {dragging ? "Drop images here" : `Add image ${images.length + 1}`}
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handleImageUpload(e.target.files)}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>

            {errors.images && (
              <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: C.primary }}>{errors.images}</p>
            )}
          </div>

          {/* Basic Info */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Basic Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Input
                label="Product Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={errors.title}
                placeholder="e.g., Hand-thrown Terracotta Vase"
                required
                style={{ width: "100%", background: inputBg, border: errors.title ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={errors.description}
                placeholder="Describe your product, its craftsmanship, materials, and what makes it special..."
                required
                rows={5}
                style={{ width: "100%", background: inputBg, border: errors.description ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", resize: "vertical" }}
              />
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                error={errors.category}
                required
                options={categories}
                placeholder="Select a category"
                style={{ width: "100%", background: inputBg, border: errors.category ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Pricing & Inventory</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <Input
                label="Price (₹)"
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                error={errors.price}
                placeholder="e.g., 2500"
                required
                min="1"
                step="1"
                style={{ width: "100%", background: inputBg, border: errors.price ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Input
                label="Stock Quantity"
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                error={errors.stock}
                placeholder="e.g., 10"
                required
                min="0"
                step="1"
                style={{ width: "100%", background: inputBg, border: errors.stock ? "2px solid #9f402d" : "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ background: cardBg, borderRadius: "1.25rem", padding: "2rem", border: `1px solid ${borderColor}` }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: text, marginBottom: "1.5rem" }}>Additional Details (Optional)</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Input
                label="Materials"
                value={form.materials}
                onChange={(e) => handleChange("materials", e.target.value)}
                placeholder="e.g., Terracotta clay, natural pigments"
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Input
                label="Dimensions"
                value={form.dimensions}
                onChange={(e) => handleChange("dimensions", e.target.value)}
                placeholder="e.g., 12cm × 12cm × 20cm (H×W×D)"
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
              <Input
                label="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="e.g., handmade, terracotta, home decor, gift"
                style={{ width: "100%", background: inputBg, border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.1rem", fontFamily: C.sans, fontSize: "0.875rem", color: text, outline: "none" }}
              />
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
            <Button type="submit" size="lg" variant="primary" loading={loading}>
              {loading ? "Creating Product..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}