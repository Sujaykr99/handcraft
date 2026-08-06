"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

const crafts = [
  {
    name: "Kantha Embroidery",
    description:
      "Layered stitches that preserve memory through thread and time.",
    src: "/crafts/Kantha of Bengal (1).jpg",
  },
  {
    name: "Pattachitra",
    description:
      "Narrative painting traditions drawn with precision and devotion.",
    src: "/crafts/Anokhi in India_.jpg",
  },
  {
    name: "Kalamkari",
    description: "Hand-drawn motifs alive with pigment, line, and rhythm.",
    src: "/crafts/Products.jpg",
  },
  {
    name: "Dhokra",
    description: "Ancient lost-wax casting with a raw, sculptural presence.",
    src: "/crafts/Hand-Painted Tribal Art Bottle Decor.jpg",
  },
  {
    name: "Madhubani",
    description:
      "Bold imagery and symbolic patterns from a living folk tradition.",
    src: "/crafts/Swan Boat Showpiece.jpg",
  },
  {
    name: "Warli",
    description: "Minimal forms and ceremonial geometry rooted in daily life.",
    src: "/crafts/Sola Mixed Lotus.jpg",
  },
  {
    name: "Wood Carving",
    description: "Carved surfaces that turn timber into heirloom detail.",
    src: "/crafts/Products.jpg",
  },
  {
    name: "Terracotta",
    description: "Earth-fired form shaped by hand, heat, and ancestral skill.",
    src: "/crafts/Hand-Painted Tribal Art Bottle Decor.jpg",
  },
] as const;

const floatingDust = [
  { left: "8%", top: "18%", size: "h-1.5 w-1.5", duration: 8.5, delay: 0.2 },
  { left: "15%", top: "74%", size: "h-1 w-1", duration: 11.5, delay: 1.2 },
  { left: "26%", top: "30%", size: "h-2 w-2", duration: 9.2, delay: 0.6 },
  { left: "41%", top: "12%", size: "h-1 w-1", duration: 10.8, delay: 2.1 },
  { left: "58%", top: "22%", size: "h-1.5 w-1.5", duration: 7.8, delay: 1.1 },
  { left: "70%", top: "68%", size: "h-2 w-2", duration: 12, delay: 1.7 },
  { left: "83%", top: "34%", size: "h-1 w-1", duration: 9.6, delay: 0.4 },
  { left: "92%", top: "78%", size: "h-1.5 w-1.5", duration: 10.4, delay: 2.4 },
] as const;

const fullRotationSeconds = 25;
const degreesPerSecond = 360 / fullRotationSeconds;

function getOrbitPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const depth = (Math.sin(angle) + 1) / 2;

  return {
    x: Math.cos(angle) * 360,
    y: Math.sin(angle) * 160,
    z: Math.sin(angle) * 110,
    tilt: Math.cos(angle) * -10,
    scale: 0.84 + depth * 0.22,
    opacity: 0.42 + depth * 0.55,
    zIndex: Math.round(depth * 1000),
  };
}

export default function OurStorySection() {
  const rotation = useMotionValue(0);
  const rotationRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useAnimationFrame((_, delta) => {
    if (pausedRef.current) {
      return;
    }

    rotationRef.current =
      (rotationRef.current + (delta / 1000) * degreesPerSecond) % 360;
    rotation.set(rotationRef.current);
  });

  return (
    <section className="relative overflow-hidden bg-[#f5ead8] px-6 py-20 text-[#2c1d12] sm:px-10 lg:px-16 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,248,0.95)_0%,rgba(245,234,216,0.96)_40%,rgba(232,213,182,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_24%,rgba(114,79,35,0.06)_100%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_1px_1px,rgba(110,80,45,0.09)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(205,159,88,0.18)_0%,rgba(205,159,88,0.08)_22%,transparent_52%),radial-gradient(circle_at_50%_50%,rgba(255,243,214,0.35)_0%,transparent_28%)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingDust.map((particle, index) => (
          <motion.span
            key={`${particle.left}-${particle.top}-${index}`}
            className={`absolute rounded-full bg-[#c79a58] blur-[1px] ${particle.size}`}
            style={{ left: particle.left, top: particle.top }}
            animate={{
              y: [0, -16, 0],
              x: [0, 8, 0],
              opacity: [0.12, 0.32, 0.14],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center">
        <div className="mb-10 max-w-3xl text-center sm:mb-12">
          <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.55em] text-[#8b612f]">
            Heritage Story
          </p>
          <h1
            className="text-5xl font-light tracking-[-0.05em] text-[#24170f] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Our Story
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6d5a48] sm:text-base lg:text-[1.05rem]">
            We preserve Indian artisanship by bringing handmade heritage into a
            contemporary light, so every thread, carving, and painted surface
            continues to be valued as living culture.
          </p>
        </div>

        <div className="relative w-full max-w-[1200px]">
          <div className="pointer-events-none absolute inset-x-6 top-14 h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(164,117,57,0.22)_0%,rgba(164,117,57,0.12)_30%,rgba(164,117,57,0.03)_58%,transparent_78%)] blur-3xl sm:inset-x-16" />
          <div className="pointer-events-none absolute inset-x-16 top-28 h-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,237,196,0.48)_0%,rgba(255,237,196,0.12)_28%,transparent_72%)] blur-2xl" />
          <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[74%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,34,18,0.24)_0%,rgba(52,34,18,0.08)_38%,transparent_72%)] blur-2xl" />

          <div className="mx-auto w-full max-w-[1200px] scale-[0.76] sm:scale-[0.88] lg:scale-100">
            <motion.div
              className="relative h-[640px] w-full [transform-style:preserve-3d] sm:h-[720px] lg:h-[780px]"
              style={{ rotateX: 18, rotateY: rotation }}
            >
              {crafts.map((craft, index) => {
                const orbit = getOrbitPosition(index, crafts.length);
                const isActive = activeIndex === index;

                return (
                  <div
                    key={craft.name}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      zIndex: orbit.zIndex,
                      opacity: orbit.opacity,
                      transform: `translate3d(-50%, -50%, 0) translate3d(${orbit.x}px, ${orbit.y}px, ${orbit.z}px) rotateZ(${orbit.tilt}deg) scale(${orbit.scale})`,
                    }}
                  >
                    <motion.button
                      type="button"
                      aria-label={craft.name}
                      className="group block"
                      onHoverStart={() => {
                        pausedRef.current = true;
                        setActiveIndex(index);
                      }}
                      onHoverEnd={() => {
                        pausedRef.current = false;
                        setActiveIndex((current) =>
                          current === index ? null : current,
                        );
                      }}
                      onFocus={() => {
                        pausedRef.current = true;
                        setActiveIndex(index);
                      }}
                      onBlur={() => {
                        pausedRef.current = false;
                        setActiveIndex((current) =>
                          current === index ? null : current,
                        );
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="relative h-[188px] w-[188px] overflow-hidden rounded-full border border-[#f2e4cb] bg-[#fff6e8] p-[6px] shadow-[0_18px_46px_rgba(90,63,29,0.18)] sm:h-[212px] sm:w-[212px] lg:h-[230px] lg:w-[230px]"
                        animate={{
                          scale: isActive ? 1.13 : 1,
                          y: isActive ? -12 : 0,
                          rotateY: isActive ? 0 : orbit.tilt * -0.18,
                          boxShadow: isActive
                            ? "0 28px 70px rgba(197,150,79,0.32), 0 0 0 1px rgba(255,234,181,0.55)"
                            : "0 18px 46px rgba(90,63,29,0.18)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 230,
                          damping: 21,
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className="absolute inset-[8px] rounded-full border border-[#d8b56f] opacity-75" />
                        <motion.div
                          className="absolute inset-[10px] overflow-hidden rounded-full"
                          animate={{ scale: isActive ? 1.08 : 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 24,
                          }}
                        >
                          <Image
                            src={craft.src}
                            alt={craft.name}
                            fill
                            sizes="(max-width: 640px) 188px, (max-width: 1024px) 212px, 230px"
                            className="object-cover object-center"
                            priority={index < 3}
                          />
                        </motion.div>

                        <div className="absolute inset-[10px] rounded-full bg-[linear-gradient(180deg,rgba(255,252,246,0.02)_0%,rgba(45,28,14,0.08)_55%,rgba(32,20,10,0.42)_100%)]" />
                        <div className="absolute inset-[10px] rounded-full ring-1 ring-[#efd8a6]/70" />

                        <motion.div
                          className="absolute inset-x-[14px] bottom-[14px] rounded-[1.35rem] border border-white/30 bg-[rgba(255,249,240,0.88)] px-4 py-3 text-center shadow-[0_12px_30px_rgba(88,58,24,0.12)] backdrop-blur-md"
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 12,
                          }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                          <p
                            className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#8d5e2c]"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {craft.name}
                          </p>
                          <p className="mt-2 text-[0.74rem] leading-5 text-[#6a5646]">
                            {craft.description}
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
