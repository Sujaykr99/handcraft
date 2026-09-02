"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import OurStorySection from "@/components/OurStorySection";
import CraftArchiveJourney from "@/components/CraftArchiveJourney";

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

export default function OurStoryPage() {
  const { user, darkMode } = useApp();

  const dm = darkMode;
  const bg = dm ? "#1a1410" : C.surface;
  const cardBg = dm ? "#2a2218" : "#ffffff";
  const text = dm ? "#fff8f1" : C.onSurface;
  const muted = dm ? "#b5a898" : C.muted;
  const borderColor = dm ? "rgba(255,248,241,0.08)" : "rgba(30,27,23,0.08)";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1200&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(30,27,23,0.7) 0%, rgba(30,27,23,0.4) 50%, rgba(30,27,23,0.15) 100%)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(30,27,23,0.5) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}
          >
            <p style={{
              fontFamily: C.sans,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,248,241,0.8)",
              marginBottom: "1rem",
            }}>
              Our Journey
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
              Craft That Carries Time
            </h1>
            <p style={{
              fontFamily: C.sans,
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              color: "rgba(255,248,241,0.9)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}>
              Every piece in our collection holds a story — of hands that shaped it, traditions that guided it, and communities that kept it alive.
            </p>
            <Link
              href="#archive"
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
              Explore the Archive
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission / Values Section */}
      <section style={{ padding: "6rem 2rem", background: bg }}>
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
              Our Purpose
            </p>
            <h2 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 300,
              color: text,
              marginBottom: "1rem",
            }}>
              Why We Exist
            </h2>
            <p style={{
              fontFamily: C.sans,
              fontSize: "1rem",
              color: muted,
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              HandArt was born from a simple belief: the hands that make should be the hands that earn. We connect artisans directly with people who value craft — no middlemen, no mass production, no compromise on authenticity.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              {
                icon: "🤝",
                title: "Direct from Maker",
                desc: "Artisans set their prices. Buyers pay fair value. No intermediary markups.",
              },
              {
                icon: "✨",
                title: "Authentic Handmade",
                desc: "Every item is crafted by hand using traditional techniques passed down generations.",
              },
              {
                icon: "🌍",
                title: "Cultural Preservation",
                desc: "Each purchase helps keep endangered crafts alive and supports artisan livelihoods.",
              },
              {
                icon: "🔒",
                title: "Transparent Trade",
                desc: "Know who made your piece, where it came from, and the story behind it.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: cardBg,
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  border: `1px solid ${borderColor}`,
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
                  color: text,
                  marginBottom: "0.75rem",
                }}>
                  {feat.title}
                </h3>
                <p style={{
                  fontFamily: C.sans,
                  fontSize: "0.9rem",
                  color: muted,
                  lineHeight: 1.7,
                }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OurStorySection - 3D Orbit Carousel */}
      <OurStorySection />

      {/* Craft Archive Journey - Interactive Postcard Archive */}
      <section id="archive">
        <CraftArchiveJourney />
      </section>

      {/* Team / Founder Section */}
      <section style={{ padding: "6rem 2rem", background: bg }}>
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
              The People
            </p>
            <h2 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 300,
              color: text,
              marginBottom: "1rem",
            }}>
              Behind HandArt
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            {[
              {
                name: "Priya Sharma",
                role: "Founder & Curator",
                bio: "Former textile designer who spent a decade documenting craft traditions across India before starting HandArt.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
              },
              {
                name: "Arjun Mehta",
                role: "Artisan Relations",
                bio: "Works directly with artisan communities across 12 states, ensuring fair practices and sustainable partnerships.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
              },
              {
                name: "Meera Iyer",
                role: "Community & Storytelling",
                bio: "Captures the stories behind every craft, building bridges between makers and the people who cherish their work.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ position: "relative", marginBottom: "1.5rem", display: "inline-block" }}>
                  <div style={{ width: "140px", height: "140px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.primary}` }}>
                    <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.35rem", fontWeight: 400, color: text, marginBottom: "0.25rem" }}>
                  {member.name}
                </h3>
                <p style={{ fontFamily: C.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, marginBottom: "1rem", fontWeight: 500 }}>
                  {member.role}
                </p>
                <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: muted, lineHeight: 1.7 }}>
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section style={{ padding: "5rem 2rem", background: C.onSurface }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {[
              { value: "500+", label: "Artisans Supported" },
              { value: "50+", label: "Craft Traditions" },
              { value: "25K+", label: "Orders Delivered" },
              { value: "12", label: "Indian States" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p style={{ fontFamily: C.sans, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: C.primary, lineHeight: 1, marginBottom: "0.5rem" }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: C.sans, fontSize: "0.9rem", color: "rgba(255,248,241,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem", background: bg }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{
            fontFamily: C.serif,
            fontStyle: "italic",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300,
            color: text,
            marginBottom: "1.5rem",
            lineHeight: 1.2,
          }}>
            Ready to Discover?
          </p>
          <p style={{
            fontFamily: C.sans,
            fontSize: "1rem",
            color: muted,
            marginBottom: "2.5rem",
            lineHeight: 1.7,
          }}>
            Browse our curated collection of handmade treasures, each with a story waiting to be part of yours.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
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
              }}
            >
              Explore Collection
            </Link>
            <Link
              href="/signup"
              style={{
                fontFamily: C.sans,
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "2px solid rgba(30,27,23,0.2)",
                color: text,
                borderRadius: "9999px",
                padding: "1rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                background: "transparent",
              }}
            >
              Join as Artisan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}