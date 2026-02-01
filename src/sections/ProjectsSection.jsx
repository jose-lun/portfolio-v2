import Reveal from "../components/Reveal";

const PROJECTS = [
  {
    title: "Road Repair",
    tag: "Optimization",
    desc: "Scheduling repairs on a network while maintaining capacity constraints.",
    img: "https://picsum.photos/seed/roadrepair/900/700",
  },
  {
    title: "Racecars",
    tag: "Reinforcement Learning",
    desc: "Q-learning agent + simulator with interpretable decision traces.",
    img: "https://picsum.photos/seed/racecars/900/700",
  },
  {
    title: "Romeo and Juliet",
    tag: "Dynamical Systems",
    desc: "Qualitative analysis, phase portraits, and stability intuition.",
    img: "https://picsum.photos/seed/romeojuliet/900/700",
  },
  {
    title: "Taylor Series Explainer",
    tag: "Math Communication",
    desc: "Interactive explainer with visuals and examples.",
    img: "https://picsum.photos/seed/taylor/900/700",
  },
];


function ProjectCard({ title, tag, desc, img }) {
  return (
    <div className="proj-card">
      <div className="proj-top">
        <div className="proj-tag">{tag}</div>
        <div className="proj-title">{title}</div>
        <div className="proj-desc">{desc}</div>
      </div>

      <div className="proj-thumb">
        <img src={img} alt="" />
      </div>
    </div>
  );
}


export default function ProjectsSection() {
  return (
    <div className="section">
        <Reveal>
            <div style={{ marginBottom: 28, textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "clamp(28px, 3.5vw, 38px)" }}>
                    Projects
                </h2>
                <p
                    style={{
                    marginTop: 12,
                    opacity: 0.8,
                    lineHeight: 1.5,
                    maxWidth: 760,
                    marginLeft: "auto",
                    marginRight: "auto",
                    }}
                >
                    A few things I’ve built recently.
                </p>
                </div>


            <div className="proj-grid">
                {PROJECTS.map((p) => (
                <ProjectCard key={p.title} {...p} />
                ))}
            </div>
        </Reveal>
    </div>
  );
}