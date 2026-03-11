import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import bifurcationImg from "../assets/bifurcation.png";
import taylorImg from "../assets/taylor.png";
import SigmaProjectShowcase from "../components/SigmaProjectShowcase";

const INTERACTIVE_LESSONS = [
  {
    title: "The Logistic Growth Model",
    tag: "Interactive Lesson",
    desc: "How a population model leads to bifurcations, period-doubling, and chaos.",
    img: bifurcationImg,
    type: "lesson",
    href: "/lessons/logistic-map",
    tech: "React, KaTeX, p5.js",
  },
  {
    title: "Taylor Series: Intuition and Applications",
    tag: "Interactive Lesson",
    desc: "How to approximate any function with polynomials, and why it works.",
    img: taylorImg,
    type: "lesson",
    href: "/lessons/taylor-series",
    tech: "React, KaTeX, Mafs, MathLive",
  },
];

const TECHNICAL_WRITING = [
  {
    title: "Road Repair Scheduling",
    tag: "Discrete Optimization",
    desc: "JHU 605.618: Discrete Optimization",
    href: "/papers/road-maintenance.pdf",
    type: "writing",
  },
  {
    title: "Q-Learning for Navigation",
    tag: "Reinforcement Learning",
    desc: "JHU 605.649: Machine Learning",
    href: "/papers/rl-racecar.pdf",
    type: "writing",
  },
  {
    title: "Condensed K-NN Classifier",
    tag: "Machine Learning",
    desc: "JHU 605.649: Machine Learning",
    href: "/papers/knn-classifier.pdf",
    type: "writing",
  },
  {
    title: "Decision Tree Pruning",
    tag: "Machine Learning",
    desc: "JHU 605.649: Machine Learning",
    href: "/papers/decision-tree-pruning.pdf",
    type: "writing",
  },
  {
    title: "ML for Financial Forecasting",
    tag: "Machine Learning",
    desc: "JHU 625.740: Data Mining",
    href: "/papers/ml-financial-forecasting.pdf",
    type: "writing",
  },
  {
    title: "The Fitzhugh-Nagumo Model",
    tag: "Dynamical Systems",
    desc: "JHU 615:765: Chaos Theory",
    href: "/papers/fitzhugh-nagumo.pdf",
    type: "writing",
  },
  {
    title: "Alzheimer's Detection",
    tag: "Deep Learning",
    desc: "UCB CS 182: Deep Learning",
    href: "https://medium.com/@ndonthi/predicting-your-alzheimers-before-you-re-an-old-timer-53d444d29022",
    type: "writing",
  },
];

function ProjectCard({ title, tag, desc, img, href, type, tech }) {
  const isWriting = type === "writing";
  const isInternal = href && href.startsWith("/") && !isWriting;

  const Card = (
    <div className="proj-card">
      <div className="proj-top">
        <div className="proj-tag">{tag}</div>
        <div className="proj-title">{title}</div>
        <div className="proj-desc">{desc}</div>
      </div>

      {img ? (
        <div className="proj-thumb">
          <img src={img} alt={title} />
        </div>
      ) : null}

      {tech ? (
        <div className="proj-tech">
          <span className="proj-tech-label">Tech Stack:</span> {tech}
        </div>
      ) : null}
    </div>
  );

  if (!href) return Card;

  if (isInternal) {
    return (
      <Link className="proj-card-link" to={href}>
        {Card}
      </Link>
    );
  }

  return (
    <a
      className={`proj-card-link ${isWriting ? "writing-card" : ""}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {Card}
    </a>
  );
}

function Group({ title, subtitle, items, centered }) {
  const isWriting = title === "Technical Writing";

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

      <div
        className={`proj-grid ${isWriting ? "proj-grid-writing" : ""}`}
        style={{ marginTop: 18 }}
      >
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

        <div style={{ marginTop: 56 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 30,
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            Apps
          </h3>

          <p
            style={{
              marginTop: 10,
              marginBottom: 30,
              opacity: 0.8,
              lineHeight: 1.5,
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            Full-stack projects with custom workflows, data modeling, and user-facing interfaces.
          </p>

          <SigmaProjectShowcase />
        </div>

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