import Reveal from "../components/Reveal";

const INTERACTIVE_LESSONS = [
  {
    title: "Chaos & the Logistic Map",
    tag: "Interactive Lesson",
    desc: "Cobweb plots, bifurcation diagrams, and intuition for period-doubling.",
    img: "https://picsum.photos/seed/chaos/900/700",
    type: "lesson",
  },
  {
    title: "RL Racecar",
    tag: "Interactive Lesson",
    desc: "See Q-learning learn to drive with interpretable value/policy visuals.",
    img: "https://picsum.photos/seed/rl/900/700",
    type: "lesson",
  },
  {
    title: "Taylor Series (Rebuild Here)",
    tag: "Interactive Lesson",
    desc: "Build a function from local polynomials and visualize approximation error.",
    img: "https://picsum.photos/seed/taylor2/900/700",
    type: "lesson",
  },
];

const OTHER_PROJECTS = [
  {
    title: "Sigma Habit Tracker",
    tag: "Full-Stack App",
    desc: "Group-based habit scoring, leaderboards, rubric builder, history charts.",
    img: "https://picsum.photos/seed/sigma/900/700",
    type: "app",
  },
];

const TECHNICAL_WRITING = [
  // Put your PDFs in /public/papers/ and link like "/papers/<file>.pdf"
  {
    title: "The Road Repair Scheduling Problem",
    tag: "Discrete Optimization",
    desc: "Problem framing, constraints, and optimization approach.",
    href: "/papers/road-maintenance.pdf",
    type: "writing",
  },
  {
    title: "Q-Learning for Navigating Grids",
    tag: "Reinforcement Learning",
    desc: "Environment design, Q-learning details, results, and analysis.",
    href: "/papers/rl-racecar.pdf",
    type: "writing",
  },
  {
    title: "Condensed K-NN Classifier",
    tag: "Machine Learning",
    desc: "K-NN overview, condensation algorithm, and performance evaluation.",
    href: "/papers/knn-classifier.pdf",
    type: "writing",
  },
  {
    title: "The Effect of Pruning on Decision Trees",
    tag: "Machine Learning",
    desc: "Pruning techniques, bias-variance tradeoff, and empirical results.",
    href: "/papers/decision-tree-pruning.pdf",
    type: "writing",
  },
  {
    title: "ML Models for Financial Forecasting",
    tag: "Machine Learning",
    desc: "Model selection, feature engineering, and evaluation metrics.",
    href: "/papers/ml-financial-forecasting.pdf",
    type: "writing",
  },
  {
    title: "The Fitzhugh-Nagumo Model",
    tag: "Dynamical Systems",
    desc: "Model derivation, phase plane analysis, and simulation results.",
    href: "/papers/fitzhugh-nagumo.pdf",
    type: "writing",
  },
  {
    title: "CNNs for Alzheimer's Detection",
    tag: "Deep Learning",
    desc: "Model architecture, training process, and accuracy assessment.",
    href: "/papers/alzheimers-detection.pdf",
    type: "writing",
  },
];

function ProjectCard({ title, tag, desc, img, href, type }) {
  const isWriting = type === "writing";

  const Card = (
    <div className="proj-card">
      <div className="proj-top">
        <div className="proj-tag">{tag}</div>
        <div className="proj-title">{title}</div>
        <div className="proj-desc">{desc}</div>
      </div>

      {img ? (
        <div className="proj-thumb">
          <img src={img} alt="" />
        </div>
      ) : null}
    </div>
  );

  return href ? (
    <a
      className={`proj-card-link ${isWriting ? "writing-card" : ""}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {Card}
    </a>
  ) : (
    Card
  );

}


function Group({ title, subtitle, items, centered }) {
  return (
    <div style={{ marginTop: 40 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 30,
          letterSpacing: "-0.01em",
          textAlign: centered ? "center" : "left",
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p
          style={{
            marginTop: 10,
            marginBottom: 30,
            opacity: 0.8,
            lineHeight: 1.5,
            maxWidth: 760,
            marginLeft: centered ? "auto" : 0,
            marginRight: centered ? "auto" : 0,
            textAlign: centered ? "center" : "left",
          }}
        >
          {subtitle}
        </p>
      )}

      <div className="proj-grid" style={{ marginTop: 18 }}>
        {items.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </div>
  );
}


export default function ProjectsSection() {
  return (
    <div className="section">
      <Reveal>
        <Group
          title="Interactive Lessons"
          subtitle="Guided, visual explanations with embedded simulations."
          items={INTERACTIVE_LESSONS}
          centered
        />

        <Group
          title="Other Projects"
          subtitle="Apps and engineering work beyond lessons."
          items={OTHER_PROJECTS}
          centered
        />

        <Group
          title="Technical Writing"
          subtitle="Selected reports and writeups."
          items={TECHNICAL_WRITING}
          centered
        />
      </Reveal>
    </div>
  );
}
