"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LayoutGrid, GitCompareArrows, Cpu, Tag, Flame } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Models", icon: LayoutGrid },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/hardware", label: "Hardware", icon: Cpu },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/deals", label: "Deals", icon: Flame },
] as const;

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon-600 bg-carbon-700/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link href="/" className="flex h-8 w-8 items-center justify-center border border-carbon-500 bg-carbon-800">
            <div className="h-2.5 w-2.5 rounded-full bg-trackpoint shadow-[0_0_6px_rgba(218,30,40,0.5)]" />
          </Link>
        </motion.div>

        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold tracking-tight">
            Lenovo<span className="text-accent">Compare</span>
          </span>
          <span className="text-sm font-light text-carbon-300">CH</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-carbon-600/50 text-accent-light"
                  : "text-carbon-300 hover:bg-carbon-600/30 hover:text-carbon-100"
              }`}
            >
              <link.icon size={13} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center bg-trackpoint" aria-label="Swiss flag">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <rect x="4" y="1" width="4" height="10" fill="white" />
              <rect x="1" y="4" width="10" height="4" fill="white" />
            </svg>
          </div>

          <button
            className="text-carbon-300 hover:text-carbon-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-carbon-600 bg-carbon-700 px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${
                pathname === link.href ? "bg-carbon-600/50 text-accent-light" : "text-carbon-300 hover:text-carbon-100"
              }`}
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
