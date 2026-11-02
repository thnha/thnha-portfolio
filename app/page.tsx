import { Nav } from "@/components/Nav";
import { HowIBuild } from "@/components/build/HowIBuild";
import { Capabilities } from "@/components/capabilities/Capabilities";
import { Contact } from "@/components/contact/Contact";
import { Experience } from "@/components/experience/Experience";
import { HardwareLab } from "@/components/hardware-lab/HardwareLab";
import { Hero } from "@/components/hero/Hero";
import { Lab } from "@/components/lab/Lab";
import { RecruiterCard } from "@/components/recruiter/RecruiterCard";
import { SelectedWork } from "@/components/work/SelectedWork";
import { hardwareLabCopy } from "@/content/sections";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Nav overlay />
      <main id="content">
        <Hero />
        <RecruiterCard />
        <Capabilities />
        <HardwareLab copy={hardwareLabCopy} />
        <SelectedWork />
        <Lab />
        <Experience />
        <HowIBuild />
      </main>
      <Contact />
    </>
  );
}
