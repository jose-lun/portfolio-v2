import { useEffect } from "react";
import BackgroundGraph from "../components/BackgroundGraph";
import HomeSection from "../sections/HomeSection";
import ProjectsSection from "../sections/ProjectsSection";
import ContactSection from "../sections/ContactSection";
import Footer from "../components/Footer";

export default function HomePage() {
  useEffect(() => {
    function updateThemeByScroll() {
      const root = document.documentElement;

      const projects = document.getElementById("projects");
      const contact = document.getElementById("contact");
      if (!projects || !contact) return;

      const vpMid = window.innerHeight * 0.5;

      function isActive(sectionEl, startFrac = 0.25) {
        const r = sectionEl.getBoundingClientRect();
        const sectionTriggerY = r.top + r.height * startFrac;
        return sectionTriggerY < vpMid;
      }

      const contactActive = isActive(contact, 0.15);
      const projectsActive = isActive(projects, 0.25);

      if (contactActive) {
        root.style.setProperty("--graph-edge-target", "215, 90, 200");
        root.style.setProperty("--graph-point-target", "255, 190, 245");
      } else if (projectsActive) {
        root.style.setProperty("--graph-edge-target", "255, 170, 120");
        root.style.setProperty("--graph-point-target", "255, 220, 200");
      } else {
        root.style.setProperty("--graph-edge-target", "30, 134, 126");
        root.style.setProperty("--graph-point-target", "220, 230, 255");
      }
    }

    updateThemeByScroll();
    window.addEventListener("scroll", updateThemeByScroll, { passive: true });
    window.addEventListener("resize", updateThemeByScroll);

    return () => {
      window.removeEventListener("scroll", updateThemeByScroll);
      window.removeEventListener("resize", updateThemeByScroll);
    };
  }, []);

  return (
    <>
      <BackgroundGraph />
      <main className="content">
        <section id="home">
          <HomeSection />
        </section>

        <section id="projects" style={{ paddingTop: 0 }}>
          <ProjectsSection />
        </section>

        <section id="contact" style={{ paddingTop: 250, paddingBottom: 150 }}>
          <ContactSection />
        </section>

        <Footer />
      </main>
    </>
  );
}
