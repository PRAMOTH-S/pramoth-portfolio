import { Section, SectionHeader } from "@/components/ui";
import { SkillConsole } from "@/components/SkillConsole";
import { skillGroups } from "@/data/skills";
import { skillInfo } from "@/data/skillInfo";
import { skillEvidence } from "@/lib/skillEvidence";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        index="03"
        label="Skills"
        title="Hardware, software and AI — one toolkit."
        intro="Pick a discipline, then a tool, to see what it is and where I used it."
      />
      <SkillConsole groups={skillGroups} info={skillInfo} evidence={skillEvidence()} />
    </Section>
  );
}
