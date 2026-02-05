import { InlineMath, BlockMath } from "react-katex";

// Usage:
// <Math inline>e^{i\pi} + 1 = 0</Math>
// <Math>\frac{dx}{dt} = rx(1-x)</Math>
export default function Math({ children, inline = false }) {
  const latex = String(children ?? "");
  return inline ? <InlineMath math={latex} /> : <BlockMath math={latex} />;
}
