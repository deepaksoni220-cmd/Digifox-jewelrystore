import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <>
      <header className="pointer-events-auto fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <div className={`font-display text-xl italic tracking-tight md:text-3xl transition-colors duration-500 ${isLight ? "text-amber-900" : "text-white"}`}>
          Aurelle Diamond Jewelry
        </div>

        <div className="flex items-center gap-5">
          {/* Desktop nav */}
          <nav className={`hidden gap-7 text-[11px] uppercase tracking-[0.18em] md:flex transition-colors duration-500 ${isLight ? "text-amber-800/70" : "text-white/80"}`}>
            <Link to="/" className={`transition-colors ${isLight ? "hover:text-amber-900" : "hover:text-white"}`}>Home</Link>
            <Link to="/shop" className={`transition-colors ${isLight ? "hover:text-amber-900" : "hover:text-white"}`}>Shop</Link>
            <Link to="/about" className={`transition-colors ${isLight ? "hover:text-amber-900" : "hover:text-white"}`}>About</Link>
            <Link to="/contact" className={`transition-colors ${isLight ? "hover:text-amber-900" : "hover:text-white"}`}>Contact</Link>
          </nav>

          {/* Theme toggle — premium icon button */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`pointer-events-auto relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 group ${
              isLight
                ? "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_16px_4px_rgba(200,140,0,0.45)] border border-amber-300/60"
                : "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 shadow-[0_0_14px_3px_rgba(180,180,255,0.18)] border border-white/15"
            }`}
          >
            {/* Outer glow ring */}
            <span className={`absolute inset-[-3px] rounded-full transition-all duration-500 ${
              isLight
                ? "ring-2 ring-amber-400/40"
                : "ring-1 ring-white/10"
            }`} />

            {/* Sun icon */}
            <svg
              className={`absolute transition-all duration-500 ${
                isLight ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90"
              }`}
              width="18" height="18" viewBox="0 0 24 24" fill="none"
            >
              <circle cx="12" cy="12" r="4.5" fill="#7c3f00" />
              <g stroke="#7c3f00" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" />
                <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" />
              </g>
            </svg>

            {/* Moon icon */}
            <svg
              className={`absolute transition-all duration-500 ${
                isLight ? "opacity-0 scale-50 -rotate-90" : "opacity-100 scale-100 rotate-0"
              }`}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="rgba(255,255,255,0.9)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            className={`pointer-events-auto flex flex-col gap-[5px] md:hidden transition-colors duration-500`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-6 transition-all duration-300 ${isLight ? "bg-gray-900" : "bg-white"} ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 transition-all duration-300 ${isLight ? "bg-gray-900" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 transition-all duration-300 ${isLight ? "bg-gray-900" : "bg-white"} ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in nav */}
      <div
        className={`pointer-events-auto fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 backdrop-blur-md transition-all duration-500 md:hidden ${
          isLight ? "bg-white/95" : "bg-black/95"
        } ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={`font-display text-4xl italic tracking-tight transition-colors ${isLight ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"}`}
        >
          Home
        </Link>
        <Link
          to="/shop"
          onClick={() => setMenuOpen(false)}
          className={`font-display text-4xl italic tracking-tight transition-colors ${isLight ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"}`}
        >
          Shop
        </Link>
        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
          className={`font-display text-4xl italic tracking-tight transition-colors ${isLight ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"}`}
        >
          About
        </Link>
        <Link
          to="/contact"
          onClick={() => setMenuOpen(false)}
          className={`font-display text-4xl italic tracking-tight transition-colors ${isLight ? "text-gray-800 hover:text-gray-900" : "text-white/90 hover:text-white"}`}
        >
          Contact
        </Link>
        <PreOrderButton />
      </div>
    </>
  );
}

export function PreOrderButton({ dark = false }: { dark?: boolean }) {
  return (
    <button
      className={`pointer-events-auto inline-flex items-center justify-center border px-7 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors ${
        dark
          ? "border-black bg-black text-white hover:bg-white hover:text-black"
          : "border-white/70 text-white hover:bg-white hover:text-black"
      }`}
    >
      Pre-order Now
    </button>
  );
}
