import { Section, SectionHeader } from "@/components/ui";
import { SystemFlow } from "@/components/SystemFlow";

export function System() {
  return (
    <Section id="system" className="cv-auto bg-surface/40">
      <SectionHeader
        index="05"
        label="Signature system"
        title="From code to robot."
        intro="Scroll to assemble the system — perception, ROS 2, navigation and hardware converging into an autonomous machine."
      />
      <SystemFlow />
    </Section>
  );
}
