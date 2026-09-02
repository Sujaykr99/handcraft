"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

const C = {
  serif: "'Newsreader', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  primary: "#9f402d",
  surface: "#fff8f1",
  onSurface: "#1e1b17",
};

export default function Navbar() {
  const { cartCount, user, setUser, wishlist, darkMode, toggleDarkMode, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const isBuyer = user?.role === "buyer";
  const isArtisan = user?.role === "artisan";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const dm = darkMode;
  const bg = scrolled
    ? dm
      ? "rgba(26,20,16,0.92)"
      : "rgba(255,248,241,0.92)"
    : "transparent";
  const border = scrolled ? "1px solid rgba(30,27,23,0.07)" : "none";
  const linkColor = dm ? "rgba(255,248,241,0.75)" : "#3a3530";
  const logoColor = dm ? C.surface : C.onSurface;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1.1rem 4rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.35s ease",
        background: bg,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: border,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: C.serif,
          fontSize: "1rem",
          fontStyle: "italic",
          color: logoColor,
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}
      >
        The HandArt
      </Link>

      <div style={{ display: "flex", gap: "2.5rem" }}>
        {!isArtisan ? (
          <>
            <Link
              href="/products"
              style={{
                fontFamily: C.sans,
                fontSize: "0.78rem",
                color: linkColor,
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s",
              }}
            >
              Collections
            </Link>
            <Link
              href="/our-story"
              style={{
                fontFamily: C.sans,
                fontSize: "0.78rem",
                color: linkColor,
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s",
              }}
            >
              Our Story
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/studio"
              style={{
                fontFamily: C.sans,
                fontSize: "0.78rem",
                color: linkColor,
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s",
              }}
            >
              My Studio
            </Link>
            <Link
              href="/products"
              style={{
                fontFamily: C.sans,
                fontSize: "0.78rem",
                color: linkColor,
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s",
              }}
            >
              View Store
            </Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button
          onClick={toggleDarkMode}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            color: dm ? C.surface : C.onSurface,
            padding: 0,
            lineHeight: 1,
          }}
        >
          {dm ? "☀" : "◐"}
        </button>

        {isBuyer ? (
          <>
            <Link
              href="/wishlist"
              style={{
                position: "relative",
                display: "flex",
                color: dm ? C.surface : C.onSurface,
              }}
            >
              <svg
                width="17"
                height="17"
                fill={wishlist.length > 0 ? C.primary : "none"}
                stroke={wishlist.length > 0 ? C.primary : dm ? C.surface : C.onSurface}
                strokeWidth="1.4"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-7px",
                    background: C.primary,
                    color: "white",
                    borderRadius: "50%",
                    width: "13px",
                    height: "13px",
                    fontSize: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: C.sans,
                    fontWeight: 700,
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              style={{
                position: "relative",
                display: "flex",
                color: dm ? C.surface : C.onSurface,
              }}
            >
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-7px",
                    background: C.primary,
                    color: "white",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                    fontSize: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: C.sans,
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          <button
            onClick={toggleDarkMode}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.95rem",
              color: dm ? C.surface : C.onSurface,
              padding: 0,
              lineHeight: 1,
            }}
          >
            {dm ? "☀" : "◐"}
          </button>
        )}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isArtisan ? (
              <>
                <Link
                  href="/studio"
                  style={{
                    fontFamily: C.sans,
                    fontSize: "0.75rem",
                    color: dm ? "rgba(255,248,241,0.6)" : "#6b6560",
                  }}
                >
                  Studio
                </Link>
                <Link
                  href="/studio/profile"
                  style={{
                    fontFamily: C.sans,
                    fontSize: "0.75rem",
                    color: dm ? "rgba(255,248,241,0.6)" : "#6b6560",
                  }}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/my-account"
                style={{
                  fontFamily: C.sans,
                  fontSize: "0.75rem",
                  color: dm ? "rgba(255,248,241,0.6)" : "#6b6560",
                }}
              >
                My Account
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                fontFamily: C.sans,
                fontSize: "0.75rem",
                color: dm ? "rgba(255,248,241,0.6)" : "#6b6560",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {user.name?.split(" ")[0]}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem", fontFamily: C.sans, fontSize: "0.75rem" }}>
            <Link href="/login" style={{ color: dm ? C.surface : C.onSurface }}>
              Login
            </Link>
            <Link href="/signup" style={{ color: dm ? C.surface : C.onSurface }}>
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}