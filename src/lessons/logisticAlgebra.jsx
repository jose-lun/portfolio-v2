import { InlineMath } from "react-katex";

const logisticAlgebra = [
  {
    equation: "P_{n+1} = P_n + r \\cdot (1 - \\frac{P_n}{K}) \\cdot P_n",
    explanation: "We start with our original population growth equation."
  },
  {
    equation: "P_{n+1} = P_n + r \\cdot (1 - \\frac{P_n}{K}) \\cdot P_n",
    explanation: (
      <>
        Since <InlineMath>{"x_n = \\frac{P_n}{K}"}</InlineMath>, that means <InlineMath>P_n = Kx_n</InlineMath>.
        <br />
        <br />
        So we can find every <InlineMath>P_n</InlineMath> and <InlineMath>{"P_{n + 1}"}</InlineMath> in the equation...
      </>
    ),
    highlights: [
      { pattern: "P_{n+1}", color: "#4797c9ff", index: 0 },
      { pattern: "P_n", color: "#4797c9ff", index: 0 },
      { pattern: "P_n", color: "#4797c9ff", index: 1 },
      { pattern: "P_n", color: "#4797c9ff", index: 2 },
    ]
  },
  {
    equation: "K x_{n+1} = K x_n + r \\cdot (1 - \\frac{K x_n}{K}) \\cdot K x_n",
    explanation: (
      <>
        ...and replace them with <InlineMath>{"K x_n"}</InlineMath> and <InlineMath>{"K x_{n + 1}"}</InlineMath>.
      </>
    ),
    highlights: [
      { pattern: "K", color: "#4797c9ff", index: 0 },
      { pattern: "x_{n+1}", color: "#4797c9ff", index: 0 },
      { pattern: "K", color: "#4797c9ff", index: 1 },
      { pattern: "x_n", color: "#4797c9ff", index: 0 },
      { pattern: "K", color: "#4797c9ff", index: 2 },
      { pattern: "x_n", color: "#4797c9ff", index: 1 },
      { pattern: "x_n", color: "#4797c9ff", index: 2 },
      { pattern: "K", color: "#4797c9ff", index: 4 },
    ]
  },
  {
    equation: "K x_{n+1} = K x_n + r \\cdot (1 - \\frac{K x_n}{K}) \\cdot K x_n",
    explanation: (
      <>
        Now notice we have a <InlineMath>K</InlineMath> in the numerator and denominator of the fraction.
      </>
    ),
    highlights: [
      { pattern: "K", color: "#df2323ff", index: 2 },
      { pattern: "K", color: "#df2323ff", index: 3 },
    ]
  },
  {
    equation: "K x_{n+1} = K x_n + r \\cdot (1 - x_n) \\cdot K x_n",
    explanation: "We can cancel those out."
  },
  {
    equation: "K x_{n+1} = K x_n + r \\cdot (1 - x_n) \\cdot K x_n",
    explanation: (
      <>
        We also have a <InlineMath>K</InlineMath> in every term, so we can divide both sides by <InlineMath>K</InlineMath>.
      </>
    ),
    highlights: [
      { pattern: "K", color: "#df2323ff", index: 0 },
      { pattern: "K", color: "#df2323ff", index: 1 },
      { pattern: "K", color: "#df2323ff", index: 2 },
    ]
  },
  {
    equation: "x_{n+1} = x_n + r (1-x_n) x_n",
    explanation: (
      <>
        Leaving us with simpler equation in terms of <InlineMath>x_n</InlineMath>!
      </>
    )
  }
];

export default logisticAlgebra;