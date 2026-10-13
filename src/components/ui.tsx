import type { ReactNode } from "react";
import Image from "next/image";
import { SectionDepth } from "@/components/SmoothScroll";
import { HeaderIntro } from "@/components/gsap/HeaderIntro";
import { SectionEnter } from "@/components/gsap/SectionEnter";
import { techIcon } from "@/lib/techIcons";

/** Chip with the technology's logo when one is available. */
export function TechChip({ label }: { label: string }) {
  const icon = techIcon(label);
  return (
    <span className="chip gap-1.5">
      {icon && <Image src={icon} alt="" width={13} height={13} className="opacity-90" />}
      {label}
    </span>
  );
}

/**
 * Renders text and highlights any [PLACEHOLDER] so missing facts are obvious
 * while you fill in the content files.
 */
export function Fill({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$/.test(p) ? (
          <mark key={i} className="rounded bg-warn/10 px-1 font-mono text-[0.85em] text-warn">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <HeaderIntro className="mb-8 max-w-3xl md:mb-10">
      <p data-sh="label" className="label mb-3 flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden />
        {label}
      </p>
      <h2 data-sh="title" className="text-balance font-display text-xl font-semibold tracking-tight text-ink md:text-3xl">
        {title}
      </h2>
      <span
        data-sh="rule"
        aria-hidden
        className="mt-4 block h-[2px] w-24 rounded-full bg-gradient-to-r from-accent via-neon to-accent/0 shadow-[0_0_12px_rgb(52_210_123/0.45)]"
      />
      {intro && <p data-sh="intro" className="mt-4 text-sm leading-relaxed text-muted md:text-base">{intro}</p>}
    </HeaderIntro>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`cv-auto relative isolate border-t border-line py-12 md:py-16 ${className}`}>
      {/* accent line drawn along the top edge + content settle as the section enters (GSAP) */}
      <SectionEnter />
      {/* decorative depth layer (client): drifts slower than the content; clipped to the section */}
      <SectionDepth />
      <div className="container">{children}</div>
    </section>
  );
}
