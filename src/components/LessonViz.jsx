const VIZ = {
  intro: {
    title: "The Logistic Map",
    hint: "We’ll start with a simple iteration rule and a slider for r.",
  },
  iterate: {
    title: "Iterating xₙ → xₙ₊₁",
    hint: "Watch how repeated application of the rule changes behavior.",
  },
  cobweb: {
    title: "Cobweb Diagram",
    hint: "Geometric view of iteration: bounce between y=f(x) and y=x.",
  },
  period2: {
    title: "Period Doubling",
    hint: "Stable → oscillation → more oscillations as r increases.",
  },
  chaos: {
    title: "Chaos",
    hint: "Sensitive dependence on initial conditions.",
  },
  bifurcation: {
    title: "Bifurcation Diagram",
    hint: "Long-run behavior vs r — the “map” of chaos.",
  },
};

export default function LessonViz({ state = "intro" }) {
  if (state === "__hidden__") return null;
  const item = VIZ[state] || VIZ.intro;

  return (
    <div className="lesson-viz">
      <div className="lesson-viz-header">
        <div className="lesson-viz-kicker">Visualization</div>
        <div className="lesson-viz-title">{item.title}</div>
        <div className="lesson-viz-hint">{item.hint}</div>
      </div>

      <div className="lesson-viz-stage">
        <div className="lesson-viz-state">{state}</div>
      </div>
    </div>
  );
}
