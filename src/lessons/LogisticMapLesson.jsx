import LessonPage from "../components/lesson/LessonPage";
import LessonStep from "../components/lesson/LessonStep";
import VizBox from "../components/lesson/VizBox";
import Math from "../components/lesson/Math";
import StickyScrollSection from "../components/lesson/StickyScrollSection";
import ExponentialGrowthSketch from "../sketches/logistic-map/ExponentialGrowthSketch";
import ExponentialRabbitSketch from "../sketches/logistic-map/ExponentialRabbitSketch";
import ExponentialInteractiveSketch from "../sketches/logistic-map/ExponentialInteractiveSketch";
import ExponentialInteractiveSketchNegative from "../sketches/logistic-map/ExponentialIteractiveSketchNegative";
import LogisticSketch from "../sketches/logistic-map/LogisticSketch";
import LogisticSketchNormalized from "../sketches/logistic-map/LogisticSketchNormalized";
import LogisticSketchOrbit2 from "../sketches/logistic-map/LogisticSketchOrbit2";
import AlgebraicStepper from "../components/lesson/AlgebraicStepper";
import logisticAlgebra from "./logisticAlgebra";
import FullWidthVizBox from "../components/lesson/FullWidthVizBox";

export default function LogisticMapLesson() {
  return (
    <LessonPage
      title="The Logistic Map"
      subtitle="How a simple model of population growth leads to chaos."
    >
      <LessonStep mode="centered">
        <h2>Part 1: Rabbits on an island</h2>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Imagine a small island with plenty of grass and no predators. A group of rabbits arrives and starts to reproduce.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          Suppose that each month, each pair of rabbits produces a new pair.
        </p>
      </LessonStep>

      <StickyScrollSection
        stickyContent={
          <VizBox>
            <ExponentialRabbitSketch />
          </VizBox>
        }
      >
        <LessonStep mode="left">
          <p> In this way, the population doubles every month. </p>
        </LessonStep>

        <LessonStep mode="left">
          <p> Try it for yourself! Click the "Next Generation" button to see the population grow. </p>
        </LessonStep>

        <LessonStep mode="left">
          <p> As you can see, the population grows without bound, and the rate of growth is always increasing. </p>
        </LessonStep>

        <LessonStep mode="left">
          <p> This is called <em>exponential growth</em>. </p>
        </LessonStep>
      </StickyScrollSection>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          At this point, it's useful to introduce some math.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p> Suppose we label the months as <Math inline={true}>0, 1, 2, ...</Math> where month 0 is the starting point.</p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Then we can denote the population after <Math inline={true}>n</Math> months as <Math inline={true}>P_n</Math>.
        </p>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          For example, if we start with 2 rabbits, then <Math inline={true}>P_0 = 2</Math>. After one month, the population doubles to 4, so <Math inline={true}>P_1 = 4</Math>.
          Then <Math inline={true}>P_2 = 8</Math>, <Math inline={true}>P_3 = 16</Math>, and so on.
        </p>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          In general, we can express the population growth as a rule:
        </p>
        <Math>{"P_{n+1} = 2P_n"}</Math>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          This rule tells us that to find the next population <Math inline={true}>{"P_{n+1}"}</Math>, we multiply the current population <Math inline={true}>{"P_n"}</Math> by 2.
        </p>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          This kind of repeated rule is called an <em>iterated map</em>.
        </p>
      </LessonStep>

      <StickyScrollSection
        stickyContent={
          <VizBox>
            <ExponentialGrowthSketch />
          </VizBox>
        }
      >
        <LessonStep mode="left">
          <p> One way to visualize an iterated map is to see how each iteration appears on a graph over time. </p>
        </LessonStep>

        <LessonStep mode="left">
          <p> Each point represents the population at a given month. </p>
        </LessonStep>

        <LessonStep mode="left">
          <p> As we repeatedly apply the rule <Math inline={true}>{"P_{n+1} = 2P_n"}</Math>, the points rise faster and faster. </p>
        </LessonStep>
      </StickyScrollSection>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          But what if the population doesn't double each month? What if it triples? Or only increases by 50%?
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          Our iterated map should change depending on how quickly rabbits reproduce.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          Instead of always multiplying by 2, we could multiply by a number <Math inline={true}>r</Math>, which represents a <em>growth factor</em>:
        </p>
        <Math>{"P_{n+1} = rP_n"}</Math>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p> Now the population growth depends on a <em>parameter</em> <Math inline={true}>r</Math>.</p>
      </LessonStep>


      <LessonStep mode="split">
        <div>
          <p> Drag the slider to change the growth factor <Math inline={true}>r</Math> and see how it affects the population growth.
          </p>
        </div>
        <VizBox>
          <ExponentialInteractiveSketch />
        </VizBox>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          You'll notice the plot above only shows <Math inline={true}>r</Math> values greater than 1.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          What do you think happens when <Math inline={true}>r</Math> is less than 1?
        </p>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <p>
            If we begin with a population of 1000 rabbits, the population now decreases over time.
          </p>
          <p> This is called <em>exponential decay</em>.
          </p>
        </div>
        <VizBox>
          <ExponentialInteractiveSketchNegative />
        </VizBox>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Clearly, our current model is unrealistic. In real life, populations tend to stabilize around a certain size.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          But the <Math inline={true}>{"P_{n+1} = rP_n"}</Math> rule only leads to two possible outcomes: unbounded growth or extinction.
        </p>
      </LessonStep>


      <LessonStep mode="left" style={{ marginBottom: '20px' }}>
        <p>
          To create a more realistic model, we first need to introduce a new concept.
        </p>
      </LessonStep>

      <LessonStep mode="centered">
        <h2>Part 2: Carrying Capacity</h2>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          On a real island, resources are limited. There's a maximum population the island can support in the long term.
        </p>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          We call this number the <em>carrying capacity</em> and we denote it as <Math inline={true}>K</Math>.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          As the population approaches this carrying capacity, resources become scarcer and growth should slow down.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          One way to measure how "full" the island is, is to calculate what fraction of the carrying capacity is currently filled.
        </p>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          On month <Math inline={true}>n</Math>, this is:
        </p>
        <Math>{"\\frac{\\text{current population}}{\\text{carrying capacity}} = \\frac{P_n}{K}"}</Math>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-30px' }}>
        <p>
          So the fraction of resources <em>left</em> is:
        </p>
        <Math>{"1 - \\frac{P_n}{K}"}</Math>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Let's take a moment to consider what this term means. Suppose the carrying capacity <Math inline={true}>K</Math> is 1000 rabbits.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          If the current population is 100 rabbits, then
        </p>
        <Math>{"1 - \\frac{P_n}{K}\\ = 1- \\frac{100}{1000} = 1-0.1 = 0.9"}</Math>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          Meaning 90% of the resources are still available.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          So how can we use this term to build a better rule for population growth?
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          The key is to consider how many <em>extra rabbits</em> should be born each month.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          The number of births should depend on the population, the growth factor, <em>and</em> the fraction of resources left.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          One simple way to incorporate all of these factors is to multiply them together:
        </p>
        <Math>{"\\text{number of births = }r  \\cdot P_n \\cdot \\left(1 - \\frac{P_n}{K}\\right)"}</Math>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          As an example, suppose:
        </p>
        <ul>
          <li>
            The population <Math inline={true}>P_n</Math> is 100
          </li>
          <li>
            Each rabbit produces 0.5 new rabbits per month, so <Math inline={true}>r = 0.5</Math>
          </li>
          <li>
            90% of the resources are still available, so <Math inline={true}>{"\\left(1 - \\frac{P_n}{K}\\right) = 0.9"}</Math>
          </li>
        </ul>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Then the number of births this month would be:
        </p>
        <Math>{"\\text{number of births = }0.5 \\cdot 100 \\cdot 0.9 = 45"}</Math>
      </LessonStep>
      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          This seems reasonable, right?
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          Using this formula for the number of births, we can calculate the next population as:
        </p>
        <Math>{"\\text{next population} = \\text{current population} + \\text{number of births}"}</Math>
        <Math>{"P_{n+1} = P_n + r \\cdot \\left(1 - \\frac{P_n}{K}\\right) \\cdot P_n"}</Math>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          This new rule is called the <em>discrete logistic growth model</em>. You can read it as:
        </p>
      </LessonStep>

      <LessonStep mode="centered" style={{ marginBottom: '0px' }}>
        <p>
          <em>
            To get next month's population, find the number of births by multiplying the current population by the growth factor and the fraction of resources left. Then add these births to the current population.
          </em>
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Now we have a model of population growth that incorporates both a growth factor <em>and</em> a carrying capacity.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          So how does it look?
        </p>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <p>
            Try it out for yourself!
          </p>
          <p>
            Drag the sliders to change the growth rate <Math inline={true}>r</Math> and carrying capacity <Math inline={true}>K</Math>.
          </p>
          <p>
            Notice that when <Math inline={true}>r</Math> is small, the population stabilizes around the carrying capacity.
          </p>
        </div>
        <VizBox>
          <LogisticSketch />
        </VizBox>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          But something strange starts to happen as <Math inline={true}>r</Math> gets larger than 2.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-10px' }}>
        <p>
          Instead of stabilizing around the carrying capacity, the population starts to oscillate wildly.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Why does a small change in the growth factor cause such a drastic change in behavior?
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '20px' }}>
        <p>
          And why would a simple model of rabbit populations become so unpredictable?
        </p>
      </LessonStep>

      <LessonStep mode="centered">
        <h2>Part 3: Chaos</h2>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          To better understand what's happening, it helps to simplify the equation a bit.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Our first step is to measure the population as a fraction of the carrying capacity rather than an absolute number.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-30px' }}>
        <p>
          We define a new variable <Math inline={true}>x_n</Math> to represent the population at month <Math inline={true}>n</Math> divided by the carrying capacity:
        </p>
        <p>
          <Math>{"x_n = \\frac{P_n}{K}"}</Math>
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          Our new equation will use <Math inline={true}>x_n</Math> instead of <Math inline={true}>P_n</Math>. This is beneficial because <Math inline={true}>x_n</Math> is always between 0 and 1.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          Step through the algebra with me to see how the equation changes when we switch from <Math inline={true}>P_n</Math> to <Math inline={true}>x_n</Math>!
        </p>
      </LessonStep>

      <LessonStep mode="centered">
        <AlgebraicStepper steps={logisticAlgebra} />
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '0px' }}>
        <p>
          Note: this is <em>exactly equivalent</em> to our original equation, just expressed as a fraction of the carrying capacity.
        </p>
      </LessonStep>

      <LessonStep mode="split">
        <div>
          <p>
            A side effect of this simplification is that the carrying capacity <Math inline={true}>K</Math> no longer appears in the equation, but the behavior is the same.
          </p>
          <p>
            The population stabilizes around 1, which corresponds to the full carrying capacity.
          </p>
        </div>
        <VizBox>
          <LogisticSketchNormalized />
        </VizBox>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          With the simplification out of the way, it's time to tackle the strange behavior we observed when <Math inline={true}>r</Math> is large.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-50px' }}>
        <p>
          We'll start by looking at <Math inline={true}>r</Math> values between 1.75 and 2.3.
        </p>
      </LessonStep>

      <LessonStep mode="left" style={{ marginBottom: '-20px' }}>
        <p>
          In the graph below, we show 50 generations. This allows us to see the long-term behavior more clearly.
        </p>
      </LessonStep>

      <StickyScrollSection
        stickyContent={
          <VizBox>
            <LogisticSketchOrbit2 />
          </VizBox>
        }
      >
        <LessonStep mode="left" rootMargin="-10% 0px -60% 0px">
          <p> When <Math inline={true}>r</Math> is below 2, we have the usual equilibrium at 1. </p>
        </LessonStep>

        <LessonStep mode="left" rootMargin="-10% 0px -50% 0px">
          <p> But as soon as <Math inline={true}>r</Math> crosses 2, the population starts to oscillate between two values. </p>
        </LessonStep>

        <LessonStep mode="left" rootMargin="-10% 0px -40% 0px">
          <p> The population has entered a <em>period-2 orbit</em>. </p>
        </LessonStep>
      </StickyScrollSection>


      <LessonStep mode="left" style={{ marginBottom: '500px' }}>
        <p>
        </p>
      </LessonStep>

    </LessonPage>
  );
}