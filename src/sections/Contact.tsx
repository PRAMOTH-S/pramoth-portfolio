import { ArrowUpRight, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { CopyEmail } from "@/components/CopyEmail";
import { site } from "@/data/site";
import { Section } from "@/components/ui";
import { HeaderIntro } from "@/components/gsap/HeaderIntro";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "LinkedIn", value: "in/pramoth-s", href: site.linkedin, icon: Linkedin },
  { label: "GitHub", value: `@${site.github.username}`, href: site.github.url, icon: Github },
  { label: "Résumé", value: "Print-ready, one page", href: "/resume", icon: FileText },
];

export function Contact() {
  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <HeaderIntro as="div">
          <p data-sh="label" className="label mb-4 flex items-center gap-3">
            <span className="text-accent">06</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Contact
          </p>
          <h2 data-sh="title" className="text-balance font-display text-2xl font-semibold tracking-tight text-ink md:text-4xl">
            Have a robotics, AI, embedded, or product-development project in mind?
            <span className="text-accent"> Let&apos;s build it.</span>
          </h2>
          <p data-sh="intro" className="mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Email is the fastest way to reach me. Based in {site.location}, working in IST.
          </p>
          <div data-sh="intro" className="mt-5">
            <CopyEmail email={site.email} />
          </div>
        </HeaderIntro>
        <ul className="divide-y divide-line border-y border-line">
          {links.map(({ label, value, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-accent"
              >
                <span className="flex items-center gap-4">
                  <Icon size={18} className="text-dim group-hover:text-accent" aria-hidden />
                  <span>
                    <span className="label block">{label}</span>
                    <span className="mt-0.5 block break-all text-ink group-hover:text-accent">{value}</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl font-bold tracking-tight text-ink">PRAMOTH S</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{site.role}</p>
          <p className="mt-2 text-xs text-muted">{site.company} · {site.companyLocation}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={12} aria-hidden /> {site.location}
          </p>
        </div>
        <div className="md:text-right">
          <ul className="flex gap-5 text-sm md:justify-end">
            <li><a className="link-underline inline-block py-1 text-muted" href={site.github.url} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="link-underline inline-block py-1 text-muted" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="link-underline inline-block py-1 text-muted" href={`mailto:${site.email}`}>Email</a></li>
            <li><a className="link-underline inline-block py-1 text-muted" href="/resume">Résumé</a></li>
          </ul>
          <p className="mt-4 font-mono text-xs text-dim">© {new Date().getFullYear()} Pramoth S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
