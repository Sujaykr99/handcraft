"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

const crafts = [
  { name: "Kantha", src: "/crafts/kantha.jpg" },
  { name: "Pattachitra", src: "/crafts/pattachitra.jpg" },
  { name: "Kalamkari", src: "/crafts/kalamkari.jpg" },
  { name: "Dhokra", src: "/crafts/dhokra.jpg" },
  { name: "Madhubani", src: "/crafts/madhubani.jpg" },
  { name: "Tribal Bottle", src: "/crafts/tribal-bottle.jpg" },
  { name: "Lotus Embroidery", src: "/crafts/lotus-embroidery.jpg" },
] as const;

const dustParticles = [
  { className: "left-[8%] top-[18%] h-1.5 w-1.5", duration: 7.5, delay: 0.2 },
  { className: "left-[16%] top-[70%] h-1 w-1", duration: 9.5, delay: 1.1 },
  { className: "left-[28%] top-[30%] h-2 w-2", duration: 8.8, delay: 0.6 },
  { className: "left-[43%] top-[14%] h-1 w-1", duration: 10.2, delay: 1.8 },
  { className: "left-[60%] top-[24%] h-1.5 w-1.5", duration: 7.9, delay: 0.9 },
  { className: "left-[74%] top-[65%] h-2 w-2", duration: 9.8, delay: 1.5 },
  { className: "left-[84%] top-[34%] h-1 w-1", duration: 8.4, delay: 0.3 },
  { className: "left-[90%] top-[80%] h-1.5 w-1.5", duration: 11, delay: 2.1 },
] as const;

const rotateSpeed = 360 / 25;

function getPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const frontDepth = (Math.sin(angle) + 1) / 2;

  return {
    x: Math.cos(angle) * 340,
    y: Math.sin(angle) * 168,
    z: Math.sin(angle) * 120,
    tilt: Math.cos(angle) * -12,
    scale: 0.84 + frontDepth * 0.2,
    opacity: 0.48 + frontDepth * 0.5,
    zIndex: Math.round(frontDepth * 1000),
  };
}

export default function CraftOvalGallery() {
  const rotation = useMotionValue(0);
  const rotationRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useAnimationFrame((_, delta) => {
    if (pausedRef.current) {
      return;
    }

    rotationRef.current =
      (rotationRef.current + (delta / 1000) * rotateSpeed) % 360;
    rotation.set(rotationRef.current);
  });

  return (
    <section className="relative overflow-hidden bg-[#f8efe2] px-6 py-20 text-[#2a1d14] sm:px-10 lg:px-16 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92)_0%,_rgba(248,239,226,0.96)_44%,_rgba(239,220,194,0.98)_100%)]" />
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_1px_1px,rgba(107,73,32,0.08)_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(161,117,63,0.09)_0%,transparent_28%,transparent_72%,rgba(161,117,63,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.42)_0%,transparent_18%),radial-gradient(circle_at_82%_8%,rgba(196,149,86,0.2)_0%,transparent_16%),radial-gradient(circle_at_50%_100%,rgba(140,92,44,0.16)_0%,transparent_22%)] opacity-70" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dustParticles.map((particle, index) => (
          <motion.span
            key={`${particle.className}-${index}`}
            className={`absolute rounded-full bg-[#d4b27c] blur-[1px] ${particle.className}`}
            animate={{
              y: [0, -18, 0],
              x: [0, 10, 0],
              opacity: [0.12, 0.34, 0.14],
              scale: [1, 1.2, 1],
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
        <div className="mb-12 max-w-3xl text-center sm:mb-14">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-[#8e5f2d]">
            Handicraft Theme
          </p>
          <h2
            className="text-4xl font-light tracking-[-0.04em] text-[#251811] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            A rotating museum of Indian craft heritage
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6f5a4a] sm:text-base">
            Hover any artifact to pause the gallery, reveal the craft name, and
            let the tactile details of each handmade piece come into focus.
          </p>
        </div>

        <div className="relative w-full max-w-[1120px]">
          <div className="pointer-events-none absolute inset-x-10 top-14 h-[72%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(178,124,58,0.22)_0%,rgba(178,124,58,0.11)_26%,rgba(178,124,58,0.03)_55%,transparent_75%)] blur-3xl sm:inset-x-16" />
          <div className="pointer-events-none absolute bottom-10 left-1/2 h-24 w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(65,44,22,0.28)_0%,rgba(65,44,22,0.08)_35%,transparent_72%)] blur-2xl" />

          <div className="mx-auto w-full max-w-[1120px] scale-[0.76] sm:scale-[0.88] lg:scale-100">
            <motion.div
              className="relative h-[560px] w-full [transform-style:preserve-3d] sm:h-[640px] lg:h-[720px]"
              style={{ rotateX: 16, rotateY: rotation }}
            >
              {crafts.map((craft, index) => {
                const position = getPosition(index, crafts.length);
                const isActive = activeIndex === index;

                return (
                  <div
                    key={craft.name}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      zIndex: position.zIndex,
                      opacity: position.opacity,
                      transform: `translate3d(-50%, -50%, 0) translate3d(${position.x}px, ${position.y}px, ${position.z}px) rotateZ(${position.tilt}deg) scale(${position.scale})`,
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
                        className="relative h-[220px] w-[160px] overflow-hidden rounded-[2rem] border border-white/65 bg-white/40 shadow-[0_18px_55px_rgba(107,73,32,0.16)] backdrop-blur-sm sm:h-[250px] sm:w-[182px] lg:h-[270px] lg:w-[204px]"
                        animate={{
                          scale: isActive ? 1.14 : 1,
                          y: isActive ? -14 : 0,
                          rotateY: isActive ? 0 : position.tilt * -0.18,
                          boxShadow: isActive
                            ? "0 28px 70px rgba(196,149,86,0.34), 0 0 0 1px rgba(255,238,190,0.55)"
                            : "0 18px 55px rgba(107,73,32,0.16)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 22,
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          animate={{ scale: isActive ? 1.12 : 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 24,
                          }}
                        >
                          <Image
                            src={craft.src}
                            alt={craft.name}
                            fill
                            sizes="(max-width: 640px) 160px, (max-width: 1024px) 182px, 204px"
                            className="object-cover object-center"
                            priority={index < 2}
                          />
                        </motion.div>

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,247,0.05)_0%,rgba(58,36,18,0.04)_52%,rgba(35,22,12,0.45)_100%)]" />

                        <motion.div
                          className="absolute inset-x-3 bottom-3 rounded-[1.35rem] border border-white/35 bg-[rgba(255,249,240,0.84)] px-3 py-2 text-center shadow-[0_10px_28px_rgba(90,57,22,0.12)] backdrop-blur-md"
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 10,
                          }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                          <p
                            className="text-[0.78rem] font-medium tracking-[0.32em] text-[#8e5f2d]"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {craft.name}
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

        <div className="mt-10 max-w-2xl text-center text-sm leading-7 text-[#745f4d] sm:mt-12 sm:text-base">
          An ellipse of embroidered, painted, and cast traditions arranged like
          a gallery installation, with each surface catching the light as the
          ring turns.
        </div>
      </div>
    </section>
  );
}
