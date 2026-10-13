import Image from "next/image";
import { skillGroups } from "@/data/skills";
import { Reveal } from "@/components/Motion";
import { techIcon } from "@/lib/techIcons";

/** Spec-sheet grid: every tool, scannable in ten seconds. */
export function SkillSheet() {
  return (
    <Reveal className="mt-5">
      <dl className="grid overflow-hidden rounded-xl border border-line bg-line gap-px md:grid-cols-2 xl:grid-cols-3">
        {skillGroups.map((g, i) => (
          <div key={g.id} className="bg-surface p-5">
            <dt className="label flex items-center gap-2">
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px w-4 bg-line-strong" aria-hidden />
              {g.title}
            </dt>
            <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[12px] leading-relaxed text-ink">
              {g.items.map((s) => {
                const icon = techIcon(s);
                return (
                  <span key={s} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    {icon && <Image src={icon} alt="" width={12} height={12} className="opacity-80" />}
                    {s}
                  </span>
                );
              })}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
