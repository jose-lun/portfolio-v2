import { useState } from "react";
import LessonLayout from "../components/LessonLayout";
import LessonStep from "../components/LessonStep";
import LessonViz from "../components/LessonViz";

export default function LogisticMapLesson() {
  const [vizState, setVizState] = useState("__hidden__");

  return (
    <div className="lesson-debug">
      <LessonLayout
        title="Chaos & the Logistic Map"
        subtitle="How simple iteration creates order, oscillation, and chaos."
        visual={<LessonViz state={vizState} />}
        collapseViz={vizState === "__hidden__"}
      >
        <LessonStep wide center onEnter={() => setVizState("__hidden__")}>
          <p>Big centered narrative section with no visualization.</p>
        </LessonStep>

        <LessonStep onEnter={() => setVizState("intro")}>
          <p>Intro text...</p>
        </LessonStep>

        <LessonStep onEnter={() => setVizState("iterate")}>
          <p>Iteration text...</p>
        </LessonStep>

        <LessonStep onEnter={() => setVizState("cobweb")}>
          <p>Cobweb text...</p>
        </LessonStep>
      </LessonLayout>
    </div>
  );
}
