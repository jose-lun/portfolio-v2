import { useEffect } from "react";
import BackgroundGraph from "./components/BackgroundGraph";
import HomeSection from "./sections/HomeSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";


export default function App() {
  useEffect(() => {
    function updateThemeByScroll() {
      const projects = document.getElementById("projects");
      if (!projects) return;

      const rect = projects.getBoundingClientRect();

      // "active" when the Projects section is near the middle of the viewport
      const viewportMid = window.innerHeight * 0.5;
      const projectsMid = rect.top + rect.height * 0.25; // tweak: 0.25 means earlier activation

      const isProjectsActive = projectsMid < viewportMid;

      if (isProjectsActive) {
        document.documentElement.style.setProperty("--graph-edge-target", "255, 170, 120");
        document.documentElement.style.setProperty("--graph-point-target", "255, 220, 200");
      } else {
        document.documentElement.style.setProperty("--graph-edge-target", "30, 134, 126");
        document.documentElement.style.setProperty("--graph-point-target", "220, 230, 255");
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
        <section id="contact" style={{ paddingTop: 160 }}>
          <ContactSection />
        </section>
      </main>
    </>
  );
}
