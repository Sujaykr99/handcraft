"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";

const C = {
  primary: "#5a7a4a",
  primaryLight: "#7a9a6a",
  error: "#9f402d",
  info: "#7a6a5a",
};

export default function Toaster() {
  const { toasts, darkMode } = useApp();

  const getStyles = (type) => {
    const dm = darkMode;
    const base = {
      padding: "0.9rem 1.25rem",
      borderRadius: "10px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "0.82rem",
      fontWeight: 500,
      color: "#fff8f1",
      minWidth: "220px",
      boxShadow: "0 8px 32px rgba(30,27,23,0.18)",
    };

    if (type === "success") return { ...base, background: dm ? "#5a7a4a" : C.primary };
    if (type === "error") return { ...base, background: dm ? "#9f402d" : C.error };
    return { ...base, background: dm ? "#7a6a5a" : C.info };
  };

  const getIcon = (type) => {
    if (type === "success") return "✓ ";
    if (type === "error") return "✕ ";
    return "ℹ ";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={getStyles(t.type)}
          >
            {getIcon(t.type)}{t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}