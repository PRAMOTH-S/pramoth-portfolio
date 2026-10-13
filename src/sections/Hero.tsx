import { ArrowDown, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { Portrait } from "@/components/Portrait";
import { GridParallax, Magnetic, ParticleField, RoleRotator } from "@/components/Effects";
import { HeroIntro } from "@/components/gsap/HeroIntro";

const ROLES = ["Robotics · ROS 2", "Embedded Systems", "Computer Vision & AI", "Product Design"] as const;

export function Hero() {
  return (
    <section id="home" className="noise relative overflow-hidden pt-24 md:pt-32">
      {/* layered background: cursor-responsive grid + particle constellation + drifting glow */}
      <GridParallax className="absolute -inset-2">
        <div aria-hidden className="bg-grid mask-fade absolute inset-0 animate-gridpan opacity-60 motion-reduce:animate-none" />
      </GridParallax>
      <ParticleField className="absolute inset-0 h-full w-full opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="absolute left-1/2 top-[-10%] h-[380px] w-[640px] -translate-x-1/2 animate-aurora rounded-full bg-accent/[0.08] blur-[120px] motion-reduce:animate-none" />
        <div className="absolute bottom-0 right-[10%] h-[280px] w-[280px] animate-aurora rounded-full bg-neon/[0.05] blur-[100px] [animation-delay:-6s] motion-reduce:animate-none" />
      </div>
      {/* cheap static glow for phones (no giant blur layers) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgb(52_210_123/0.08),transparent_70%)] md:hidden" />

      {/* GSAP cinematic entrance; the direct children keep the boot-intro stagger (globals.css) */}
      <HeroIntro className="container relative flex max-w-3xl flex-col items-center text-center">
        <div className="inline-block">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            <span data-hero="name" className="text-gradient animate-shimmer inline-block motion-reduce:animate-none">Pramoth S</span>
          </h1>
        </div>
        <div>
          <p data-hero="role" className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted md:text-sm">
            {site.role} — <RoleRotator words={ROLES} />
          </p>
        </div>
        <div>
          <p data-hero="tagline" className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">{site.tagline}</p>
          <p data-hero="meta" className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-dim">
            <MapPin size={12} aria-hidden /> {site.location} · B.E. ECE · Class of {site.graduationYear}
          </p>
        </div>
        <div>
          <div data-hero="cta" className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Magnetic>
              <a href="#projects" className="group btn-primary !px-3.5 !py-2 !text-xs md:!text-sm">
                View my work <ArrowDown size={14} className="transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.github.url} target="_blank" rel="noreferrer" className="btn-ghost !px-3.5 !py-2 !text-xs md:!text-sm">
                <Github size={14} /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn-ghost !px-3.5 !py-2 !text-xs md:!text-sm">
                <Linkedin size={14} /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${site.email}`} className="btn-ghost !px-3.5 !py-2 !text-xs md:!text-sm">
                <Mail size={14} /> Email
              </a>
            </Magnetic>
            <Magnetic>
              <a href="/resume" className="btn-ghost !px-3.5 !py-2 !text-xs md:!text-sm">
                <FileText size={14} /> Résumé
              </a>
            </Magnetic>
          </div>
        </div>

        <Portrait />
      </HeroIntro>
    </section>
  );
}
