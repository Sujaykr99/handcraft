"use client";

import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary/90 hover:to-primary-light/90 focus-visible:ring-primary",
    secondary:
      "bg-surface-high text-on-surface border border-surface-dim hover:bg-surface-dim focus-visible:ring-surface-dim",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/5 focus-visible:ring-primary",
    ghost:
      "bg-transparent text-on-surface hover:bg-surface-dim focus-visible:ring-surface-dim",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-600/90 hover:to-red-700/90 focus-visible:ring-red-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2",
    xl: "px-10 py-5 text-xl gap-2.5",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}