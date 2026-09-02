"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

const C = {
  serif: "'Newsreader', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  primary: "#9f402d",
  primaryLight: "#e2725b",
  surface: "#fff8f1",
  surfaceLow: "#faf2ea",
  surfaceDim: "#ede7df",
  onSurface: "#1e1b17",
  muted: "#6b6560",
};

const heroSlides = [
  {
    title: "Handcrafted with Heart",
    subtitle: "Every piece tells a story. Discover unique creations from artisans around the world.",
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1200&q=80",
  },
  {
    title: "Tradition Meets Today",
    subtitle: "Ancient techniques, contemporary designs. Craft that carries meaning.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80",
  },
  {
    title: "Direct from Maker to You",
    subtitle: "No middlemen. Fair prices for artisans. Authentic pieces for you.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
  },
];

const categories = [
  { name: "Pottery", image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80", href: "/products?category=Pottery" },
  { name: "Jewellery", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", href: "/products?category=Jewellery" },
  { name: "Textiles", image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80", href: "/products?category=Textiles" },
  { name: "Paintings", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", href: "/products?category=Paintings" },
  { name: "Woodwork", image: "https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=400&q=80", href: "/products?category=Woodwork" },
  { name: "Candles", image: "https://images.unsplash.com/photo-1602607144655-c63d4d47f86a?w=400&q=80", href: "/products?category=Candles" },
];

export default function HomePage() {
  const { user } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div style={{ background: C.surface, minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(30,27,23,0.6) 0%, rgba(30,27,23,0.3) 50%, rgba(30,27,23,0.1) 100%)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(30,27,23,0.4) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: "700px" }}
          >
            <p style={{
              fontFamily: C.sans,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,248,241,0.8)",
              marginBottom: "1rem",
            }}>
              Welcome to HandArt
            </p>
            <h1 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 300,
              color: "#fff8f1",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}>
              {slide.title}
            </h1>
            <p style={{
              fontFamily: C.sans,
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              color: "rgba(255,248,241,0.9)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}>
              {slide.subtitle}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/products"
                style={{
                  fontFamily: C.sans,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                  color: "white",
                  borderRadius: "9999px",
                  padding: "1rem 2.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                Explore Collection
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  style={{
                    fontFamily: C.sans,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    border: "2px solid rgba(255,248,241,0.8)",
                    color: "#fff8f1",
                    borderRadius: "9999px",
                    padding: "1rem 2.5rem",
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    transition: "background 0.2s",
                  }}
                >
                  Join as Artisan or Buyer
                </Link>
              )}
            </div>
          </motion.div>

          {/* Slide indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              position: "absolute",
              bottom: "3rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.75rem",
            }}
          >
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  border: "none",
                  background: i === currentSlide ? "#fff8f1" : "rgba(255,248,241,0.4)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: "6rem 2rem", background: C.surface }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{
              fontFamily: C.sans,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.primary,
              marginBottom: "0.75rem",
            }}>
              Shop by Category
            </p>
            <h2 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 300,
              color: C.onSurface,
              marginBottom: "1rem",
            }}>
              Explore Crafts
            </h2>
            <p style={{
              fontFamily: C.sans,
              fontSize: "1rem",
              color: C.muted,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Each category represents generations of skill and tradition.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ position: "relative", borderRadius: "1.5rem", overflow: "hidden", aspectRatio: "4/3" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <Link href={cat.href} style={{ display: "block", height: "100%" }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(30,27,23,0) 40%, rgba(30,27,23,0.7) 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "2rem",
                    }}
                  >
                    <div>
                      <p style={{
                        fontFamily: C.sans,
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,248,241,0.7)",
                        marginBottom: "0.5rem",
                      }}>
                        Category
                      </p>
                      <h3 style={{
                        fontFamily: C.serif,
                        fontStyle: "italic",
                        fontSize: "1.75rem",
                        fontWeight: 300,
                        color: "#fff8f1",
                      }}>
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link
              href="/products"
              style={{
                fontFamily: C.sans,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: C.primary,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "gap 0.2s",
              }}
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "6rem 2rem", background: C.surfaceLow }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{
              fontFamily: C.sans,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.primary,
              marginBottom: "0.75rem",
            }}>
              Why HandArt
            </p>
            <h2 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 300,
              color: C.onSurface,
            }}>
              Craft with Purpose
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              { icon: "🤝", title: "Direct from Artisans", desc: "Buy directly from makers. No middlemen. Fair prices for everyone." },
              { icon: "✨", title: "Authentic Handmade", desc: "Every piece is crafted by hand. No mass production. No shortcuts." },
              { icon: "🌍", title: "Global Heritage", desc: "Discover crafts from traditions spanning continents and centuries." },
              { icon: "🔒", title: "Secure & Simple", desc: "Safe payments, easy orders, tracked shipping. Peace of mind included." },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  border: "1px solid rgba(30,27,23,0.06)",
                  boxShadow: "0 4px 20px rgba(30,27,23,0.04)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(30,27,23,0.1)" }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{feat.icon}</div>
                <h3 style={{
                  fontFamily: C.serif,
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: C.onSurface,
                  marginBottom: "0.75rem",
                }}>
                  {feat.title}
                </h3>
                <p style={{
                  fontFamily: C.sans,
                  fontSize: "0.9rem",
                  color: C.muted,
                  lineHeight: 1.7,
                }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "6rem 2rem", background: C.onSurface }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{
            fontFamily: C.sans,
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.primary,
            marginBottom: "0.75rem",
          }}>
            Ready to Begin?
          </p>
          <h2 style={{
            fontFamily: C.serif,
            fontStyle: "italic",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300,
            color: "#fff8f1",
            marginBottom: "1.5rem",
            lineHeight: 1.2,
          }}>
            {user ? "Continue Your Journey" : "Start Your HandArt Story"}
          </h2>
          <p style={{
            fontFamily: C.sans,
            fontSize: "1rem",
            color: "rgba(255,248,241,0.7)",
            marginBottom: "2.5rem",
            lineHeight: 1.7,
          }}>
            {user
              ? "Explore new collections, manage your orders, or list your own creations."
              : "Join thousands of artisans and buyers in a marketplace built for handmade."}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={user ? "/products" : "/signup"}
              style={{
                fontFamily: C.sans,
                fontSize: "0.9rem",
                fontWeight: 600,
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                color: "white",
                borderRadius: "9999px",
                padding: "1rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              {user ? "Browse Collection" : "Create Account"}
            </Link>
            <Link
              href="/our-story"
              style={{
                fontFamily: C.sans,
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "2px solid rgba(255,248,241,0.3)",
                color: "#fff8f1",
                borderRadius: "9999px",
                padding: "1rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                background: "transparent",
              }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}