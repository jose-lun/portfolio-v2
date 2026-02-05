import LessonPage from "../components/lesson/LessonPage";
import LessonStep from "../components/lesson/LessonStep";
import VizBox from "../components/lesson/VizBox";
import Math from "../components/lesson/Math";
import DoublePendulumSketch from "../sketches/logistic-map/DoublePendulumSketch";
import ExponentialRabbitSketch from "../sketches/logistic-map/ExponentialRabbitSketch";

export default function LogisticMapLesson() {
  return (
    <LessonPage
      title="The Logistic Map"
      subtitle="How a simple model of population growth leads to chaos."
    >
      <LessonStep mode="centered">
        <h2>Part 1: Rabbits on an island</h2>
      </LessonStep>
      <LessonStep mode="left">
        <p>
          Imagine a small island with plenty of grass and no predators. A group of rabbits arrives and starts to reproduce.
        </p>
        <p>
          Suppose that each month, each pair of rabbits produces a new pair.
        </p>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <p>
            In this way the population doubles every month.
          </p>
          <p>
            Try it for yourself! Click the "Next Generation" button to see the population grow.
          </p>
          <p>
            As you can see, the population grows without bound, and the rate of growth is always increasing.
          </p>
          <p>
            This is called <em>exponential growth</em>.
          </p>
        </div>

        <VizBox>
          <ExponentialRabbitSketch/>
        </VizBox>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <h2>The Double Pendulum</h2>
          <p>
            This diagram shows all possible long-term behaviors across different 
            values of <Math inline>{"r"}</Math>.
          </p>
          <p>
            Notice the period-doubling cascade leading to chaos around <Math inline>{"r \\approx 3.57"}</Math>.
          </p>
        </div>

        <VizBox title="Double Pendulum">
          <DoublePendulumSketch/>
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