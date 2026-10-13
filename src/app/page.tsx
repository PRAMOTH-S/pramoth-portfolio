import { Hero } from "@/sections/Hero";
import { TechMarquee } from "@/components/Marquee";
import { About, Experience, Internships } from "@/sections/Story";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Internships />
      <Contact />
    </>
  );
}
