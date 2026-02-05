import LessonPage from "../components/lesson/LessonPage";
import LessonStep from "../components/lesson/LessonStep";
import VizBox from "../components/lesson/VizBox";
import Math from "../components/lesson/Math";
import IterationSketch from "../sketches/logistic-map/IterationSketch";
import BifurcationSketch from "../sketches/logistic-map/BifurcationSketch";

export default function LogisticMapLesson() {
  return (
    <LessonPage
      title="Chaos & the Logistic Map"
      subtitle="How simple iteration creates order, oscillation, and chaos."
    >
      <LessonStep mode="centered">
        <p>
          We'll study a deceptively simple rule:
          {" "}
          <Math inline>{"x_{n+1} = r x_n (1 - x_n)"}</Math>.
        </p>
        <p>
          By changing <Math inline>{"r"}</Math>, we'll see stable behavior, oscillations,
          and chaos.
        </p>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <h2>Iteration</h2>
          <p>
            Start with an initial value <Math inline>{"x_0"}</Math>. Apply the rule
            repeatedly to get <Math inline>{"x_1, x_2, \\dots"}</Math>.
          </p>
        </div>

        <VizBox title="Iteration Plot">
          <IterationSketch width={480} height={320} r={3.2} />
        </VizBox>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <h2>The Bifurcation Diagram</h2>
          <p>
            This diagram shows all possible long-term behaviors across different 
            values of <Math inline>{"r"}</Math>.
          </p>
          <p>
            Notice the period-doubling cascade leading to chaos around <Math inline>{"r \\approx 3.57"}</Math>.
          </p>
        </div>

        <VizBox title="Bifurcation Diagram">
          <BifurcationSketch width={480} height={320} />
        </VizBox>
      </LessonStep>

      <LessonStep mode="centered">
        <p>
          Next we'll visualize the iteration geometrically using a cobweb diagram.
        </p>
      </LessonStep>
    </LessonPage>
  );
}