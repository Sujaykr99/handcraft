"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const crafts = [
  {
    id: "pattachitra",
    name: "PATTACHITRA",
    region: "Odisha, India",
    archiveNo: "ARCHIVE No. 01",
    src: "/crafts/Anokhi in India_.jpg",
    alt: "Pattachitra painting from Odisha",
    story: "An ancient painting tradition from Odisha, known for detailed compositions, mythological themes, and intricate decorative borders.",
    rotation: -4,
    position: { top: "12%", left: "8%" },
  },
  {
    id: "kantha",
    name: "KANTHA",
    region: "Bengal, India",
    archiveNo: "ARCHIVE No. 02",
    src: "/crafts/Kantha of Bengal (1).jpg",
    alt: "Kantha embroidery from Bengal",
    story: "A traditional embroidery art from Bengal, where layers of old cloth are stitched together with running stitches to create expressive patterns and stories.",
    rotation: 3,
    position: { top: "38%", left: "52%" },
  },
  {
    id: "kalamkari",
    name: "KALAMKARI",
    region: "Andhra Pradesh, India",
    archiveNo: "ARCHIVE No. 03",
    src: "/crafts/Products.jpg",
    alt: "Kalamkari textile art from Andhra Pradesh",
    story: "An Indian textile art traditionally associated with Andhra Pradesh, created through detailed drawing and natural dyeing techniques on fabric.",
    rotation: -2,
    position: { top: "64%", left: "12%" },
  },
  {
    id: "dhokra",
    name: "DHOKRA",
    region: "Central India",
    archiveNo: "ARCHIVE No. 04",
    src: "/crafts/Hand-Painted Tribal Art Bottle Decor.jpg",
    alt: "Dhokra metal craft from Central India",
    story: "An ancient metal craft tradition known for its distinctive lost-wax casting technique and beautifully handcrafted figures and objects.",
    rotation: 4,
    position: { top: "15%", left: "65%" },
  },
];

const paperTextureStyle = {
  background: `
    radial-gradient(ellipse at 20% 30%, rgba(180,140,90,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(160,120,70,0.06) 0%, transparent 50%),
    linear-gradient(135deg, #f5ead8 0%, #ede4d0 25%, #e5dcc8 50%, #ddd4bc 75%, #d5ccb8 100%)
  `,
  backgroundSize: "200% 200%",
};

const stampStyle = {
  position: "absolute",
  top: "14px",
  right: "14px",
  width: "56px",
  height: "56px",
  border: "2px solid #8b6914",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px",
  background: "rgba(255,250,240,0.6)",
  opacity: 0.75,
};

function Postcard({ craft, index, isExpanded, expandedId, onClick, onHover, onHoverEnd }) {
  const isActive = expandedId === craft.id;
  const zIndex = isActive ? 1000 : 10 - index;

  return (
    <motion.div
      key={craft.id}
      style={{
        zIndex,
        transformOrigin: "center center",
      }}
      initial={{ opacity: 0, y: 40, rotate: craft.rotation }}
      animate={{
        opacity: isActive ? 0 : 1,
        y: isActive ? -100 : 0,
        scale: isActive ? 1.1 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.12 }}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
    >
      <motion.div
        className="relative"
        style={{
          width: "280px",
          aspectRatio: "3/4",
          transform: `rotate(${craft.rotation}deg)`,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotate: isActive ? 0 : craft.rotation,
          y: isActive ? 0 : 0,
          scale: isActive ? 1.02 : 1,
          boxShadow: isActive
            ? "0 40px 80px rgba(44,29,18,0.35), 0 0 0 1px rgba(210,180,140,0.3)"
            : "0 20px 50px rgba(44,29,18,0.25), 0 0 0 1px rgba(180,150,110,0.2)",
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.4,
        }}
        whileHover={{
          rotate: 0,
          y: -8,
          scale: 1.03,
          boxShadow: "0 32px 64px rgba(44,29,18,0.3), 0 0 0 1px rgba(210,180,140,0.4)",
          zIndex: 999,
        }}
        whileTap={{ scale: 0.98 }}
        style={{ cursor: "pointer" }}
      >
        <div
          className="absolute inset-0 rounded-[4px] overflow-hidden"
          style={{
            background: paperTextureStyle.background,
            backgroundSize: "200% 200%",
            boxShadow: "inset 0 1px 0 rgba(255,255,250,0.3), inset 0 -1px 0 rgba(100,70,40,0.1)",
            border: "1px solid rgba(160,130,90,0.3)",
            clipPath: "polygon(2% 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0 98%, 0 2%)",
          }}
        >
          <div className="absolute inset-0" style={{ background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\") center/200px 200px" }} />

          <div className="absolute top-0 left-0 right-0" style={{ height: "65%" }}>
            <Image
              src={craft.src}
              alt={craft.alt}
              fill
              sizes="(max-width: 640px) 280px, 280px"
              className="object-cover object-center"
              style={{
                transform: "scale(1.02)",
                filter: "contrast(1.02) saturate(0.95)",
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0" style={{ height: "35%", padding: "16px 18px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ borderTop: "1px solid rgba(140,110,70,0.3)", paddingTop: "12px" }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "#5d4222",
                lineHeight: 1.2,
                textTransform: "uppercase",
                marginBottom: "4px",
              }}>
                {craft.name}
              </p>
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: "0.7rem",
                fontStyle: "italic",
                color: "#7a5c3a",
                lineHeight: 1.3,
                marginBottom: "8px",
              }}>
                {craft.region}
              </p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "#9c7a4a",
                textTransform: "uppercase",
              }}>
                {craft.archiveNo}
              </p>
            </div>
          </div>

          <div style={stampStyle}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#8b6914",
              lineHeight: 1.1,
              textAlign: "center",
              textTransform: "uppercase",
            }}>
              HANDART<br />ARCHIVE
            </span>
          </div>

          <div className="absolute bottom-3 left-3" style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "0.55rem",
            fontStyle: "italic",
            color: "rgba(130,100,60,0.5)",
            transform: "rotate(-3deg)",
            pointerEvents: "none",
          }}>
            collected
          </div>
          <div className="absolute bottom-2 right-3" style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "0.55rem",
            fontStyle: "italic",
            color: "rgba(130,100,60,0.5)",
            transform: "rotate(2deg)",
            pointerEvents: "none",
          }}>
            preserved
          </div>
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{
          background: "radial-gradient(circle at 30% 30%, rgba(180,140,90,0.5), rgba(100,70,40,0.2))",
          filter: "blur(1px)",
          opacity: 0.4,
          transform: "scaleX(1.5)",
        }} />
      </motion.div>
    </motion.div>
  );
}

function ExpandedStory({ craft, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        key={craft.id}
        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -30, rotateX: 10 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(30,24,18,0.75)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
          style={{
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <div className="relative" style={{
            background: paperTextureStyle.background,
            backgroundSize: "200% 200%",
            borderRadius: "6px",
            border: "1px solid rgba(160,130,90,0.35)",
            boxShadow: "0 60px 120px rgba(20,15,10,0.5), 0 0 0 1px rgba(210,180,140,0.2), inset 0 1px 0 rgba(255,255,250,0.2)",
            clipPath: "polygon(1.5% 0, 98.5% 0, 100% 1.5%, 100% 98.5%, 98.5% 100%, 1.5% 100%, 0 98.5%, 0 1.5%)",
            padding: "32px 36px 40px",
            position: "relative",
          }}>
            <div className="absolute top-4 right-4" style={stampStyle}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#8b6914",
                lineHeight: 1.1,
                textAlign: "center",
                textTransform: "uppercase",
              }}>
                HANDART<br />ARCHIVE
              </span>
            </div>

            <div className="absolute top-6 left-6" style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "0.6rem",
              fontStyle: "italic",
              color: "rgba(120,90,55,0.6)",
              transform: "rotate(-2deg)",
            }}>
              archive entry
            </div>

            <div className="mb-8">
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "#8b6914",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                {craft.name}
              </p>
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: "0.85rem",
                fontStyle: "italic",
                color: "#6d5238",
                lineHeight: 1.4,
              }}>
                {craft.region}
              </p>
            </div>

            <div className="mb-8 overflow-hidden" style={{
              borderRadius: "4px",
              border: "1px solid rgba(160,130,90,0.25)",
              boxShadow: "inset 0 2px 8px rgba(40,25,15,0.15)",
            }}>
              <Image
                src={craft.src}
                alt={craft.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                style={{
                  filter: "contrast(1.02) saturate(0.95)",
                }}
              />
            </div>

            <div className="mb-6" style={{ borderTop: "1px solid rgba(160,130,90,0.2)", paddingTop: "20px" }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#7a5c3a",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}>
                The Story
              </p>
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: "#4a3826",
                fontWeight: 300,
              }}>
                {craft.story}
              </p>
            </div>

            <div className="flex justify-center pt-4" style={{ borderTop: "1px solid rgba(160,130,90,0.15)" }}>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(140,110,70,0.4)",
                  color: "#6d5238",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "12px 36px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Close Entry
              </motion.button>
            </div>

            <div className="absolute bottom-4 right-6" style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "0.55rem",
              fontStyle: "italic",
              color: "rgba(130,100,60,0.45)",
              transform: "rotate(1deg)",
            }}>
              {craft.archiveNo}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CraftArchiveJourney() {
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    if (!expandedId) {
      setExpandedId(id);
    }
  };

  const handleClose = () => {
    setExpandedId(null);
  };

  const handleHover = (id) => {
    if (!expandedId) setHoveredId(id);
  };

  const handleHoverEnd = () => {
    if (!expandedId) setHoveredId(null);
  };

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32" style={{ background: "#f5ead8" }}>
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at top, rgba(255,255,248,0.95) 0%, rgba(245,234,216,0.98) 45%, rgba(232,213,182,1) 100%),
          linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 20%, rgba(114,79,35,0.04) 100%)
        `,
      }} />

      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(110,80,45,0.08) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }} />

      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 15% 20%, rgba(205,159,88,0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 85% 80%, rgba(180,130,70,0.08) 0%, transparent 35%),
          radial-gradient(ellipse at 50% 50%, rgba(255,243,214,0.15) 0%, transparent 60%)
        `,
      }} />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-14 max-w-3xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.5em",
            color: "#8b6914",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            CRAFTS THAT CARRY TIME
          </p>
          <div className="flex items-center justify-center gap-4 my-6">
            <div style={{
              width: "60px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(160,130,90,0.5), transparent)",
            }} />
            <span style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "1.1rem",
              color: "#a67c4a",
            }}>
              ✦
            </span>
            <div style={{
              width: "60px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(160,130,90,0.5), transparent)",
            }} />
          </div>
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "1.05rem",
            fontStyle: "italic",
            color: "#6d5844",
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            Traditions passed from hand to hand, generation to generation.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          style={{ minHeight: "720px", position: "relative" }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.3 },
            },
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
            background: `
              radial-gradient(ellipse at center, rgba(180,140,90,0.06) 0%, transparent 70%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")
            `,
            backgroundSize: "cover, 400px 400px",
          }}>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="absolute inset-0"
              style={{
                border: "1px solid rgba(160,130,90,0.12)",
                borderRadius: "8px",
                boxShadow: "inset 0 1px 0 rgba(255,255,250,0.15), 0 20px 60px rgba(44,29,18,0.1)",
              }}
            />
          </div>

          <div className="relative" style={{ height: "720px", position: "relative" }}>
            {crafts.map((craft, index) => (
              <Postcard
                key={craft.id}
                craft={craft}
                index={index}
                isExpanded={expandedId === craft.id}
                expandedId={expandedId}
                onClick={() => handleClick(craft.id)}
                onHover={() => handleHover(craft.id)}
                onHoverEnd={handleHoverEnd}
              />
            ))}

            <AnimatePresence>
              {expandedId && (
                <ExpandedStory
                  craft={crafts.find(c => c.id === expandedId)}
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          className="mt-16 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "#7a6248",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Each postcard a memory. Each craft a lineage. The archive breathes.
        </motion.p>
      </div>
    </section>
  );
}