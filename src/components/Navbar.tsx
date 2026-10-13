"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, site } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    if (!onHome) return;
    const els = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) document.querySelector<HTMLAnchorElement>("#mobile-menu a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/80 shadow-[0_8px_30px_rgb(0_0_0/0.35)] backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <nav
        className={`container flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}
        aria-label="Primary"
      >
        <a href="/#home" className="flex items-center gap-2.5 font-mono text-sm tracking-wider text-ink">
          <span className="grid h-7 w-7 place-items-center rounded border border-accent/50 text-[11px] text-accent">PS</span>
          <span className="hidden sm:inline">{site.name.toUpperCase()}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <li key={n.id} className="relative">
              <a
                href={`/#${n.id}`}
                aria-current={onHome && active === n.id ? "true" : undefined}
                className={`relative block rounded px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-line-strong after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  onHome && active === n.id ? "text-accent after:hidden" : "text-muted hover:text-ink"
                }`}
              >
                {n.label}
              </a>
              {onHome && active === n.id && (
                <motion.span
                  layoutId="nav-active"
                  aria-hidden
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-x-3 -bottom-px h-px bg-accent shadow-[0_0_8px_rgb(52_210_123/0.6)]"
                />
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-line text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
          >
            <ul className="container flex flex-col py-6">
              {navItems.map((n, i) => (
                <li key={n.id} className="border-b border-line">
                  <a
                    href={`/#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-2xl text-ink"
                  >
                    {n.label}
                    <span className="font-mono text-xs text-dim">{String(i).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
