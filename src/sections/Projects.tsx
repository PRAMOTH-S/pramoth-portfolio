import type { CSSProperties } from "react";
import Image from "next/image";
import { Github } from "lucide-react";
import { categories, projects, toCardData } from "@/data/projects";
import { Section, SectionHeader, TechChip } from "@/components/ui";
import { Reveal } from "@/components/Motion";
import { ProjectsExplorer } from "@/components/Projects";
import { CardLiving } from "@/components/CardLiving";
import { CARD_CHIP_LIT, CARD_IMAGE_DEPTH } from "@/components/CardStyles";

// Used by the case-study page (/projects/[slug]).
export const NAV_PIPELINE = [
  "LiDAR / Encoders", "ROS 2 topics", "TF", "SLAM / Localization", "Map", "Nav2 planner", "Controller", "/cmd_vel", "ESP32", "Motors",
] as const;

export const CLEAN_PIPELINE = [
  "Map", "Free-space analysis", "Inflation constraints", "Coverage decomposition", "Boustrophedon pattern", "Waypoints", "Nav2", "Robot motion", "Coverage complete",
] as const;

export function Projects() {
  const flagship = projects.find((p) => p.flagship);
  const rest = projects.filter((p) => !p.flagship).map(toCardData);

  return (
    <Section id="projects">
      <SectionHeader index="04" label="Projects" title="Things I have built." />

      {flagship && (
        <Reveal>
          <CardLiving
            as="article"
            id={`project-${flagship.slug}`}
            className="panel scroll-mt-24 overflow-hidden transition-[border-color,box-shadow] duration-300 target:border-accent/60 data-[lit=true]:border-accent/40 data-[lit=true]:shadow-[0_0_28px_rgb(52_210_123/0.07)]"
            aria-labelledby="flagship-title"
            max={3}
            zoom={1.04}
            shift={5}
            lift={2}
          >
            <div className="grid lg:grid-cols-[1fr_1.2fr]">
              {flagship.image && (
                <div className="relative aspect-video overflow-hidden border-b border-line lg:aspect-auto lg:border-b-0 lg:border-r">
                  <Image
                    src={flagship.image}
                    alt="Industrial autonomous floor-cleaning robot on a dark floor, status light on"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className={`object-cover ${CARD_IMAGE_DEPTH}`}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent lg:bg-gradient-to-r" />
                </div>
              )}
              <div className="p-5 md:p-7">
                <p className="label mb-3 text-accent">Flagship · {flagship.category}</p>
                <h3 id="flagship-title" className="text-balance font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {flagship.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-muted">{flagship.summary}</p>
                <ul className="mt-4 grid gap-1.5 text-sm text-muted sm:grid-cols-2" aria-label="Key capabilities">
                  {flagship.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {flagship.tech.slice(0, 8).map((t, i) => (
                    <li key={t} className={CARD_CHIP_LIT} style={{ "--i": i } as CSSProperties}><TechChip label={t} /></li>
                  ))}
                </ul>
                {flagship.repo && (
                  <div className="mt-5">
                    <a
                      href={flagship.repo}
                      target="_blank"
                      rel="noreferrer"
                      title="The repository is private — access on request"
                      className="btn-ghost !px-3.5 !py-2 !text-xs md:!text-sm"
                    >
                      <Github size={14} /> Source code <span className="text-dim">· private</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardLiving>
        </Reveal>
      )}

      <div className="mt-10">
        <h3 className="label mb-5">More projects</h3>
        <ProjectsExplorer projects={rest} categories={categories} />
      </div>
    </Section>
  );
}
