"use client";

import { motion } from "framer-motion";

export function Card({
  children,
  className = "",
  hover = false,
  padding = "p-6",
  border = true,
  shadow = "shadow-sm",
}) {
  const baseStyles = `rounded-2xl bg-white ${padding} ${border ? "border border-surface-dim" : ""} ${shadow} transition-all duration-300`;

  const Component = motion.div;

  return (
    <Component
      className={`${baseStyles} ${hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""} ${className}`}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = "", title, subtitle, action }) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div>
        {title && (
          <h3 className="text-2xl font-serif italic font-light text-on-surface">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-dim ${className}`}>
      {children}
    </div>
  );
}