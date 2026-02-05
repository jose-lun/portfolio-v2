import { useState, useRef, useEffect } from "react";
import { useP5 } from "../../components/lesson/useP5";

export default function IterationSketch({ width = 500, height = 400, initialR = 3.2 }) {
  const [r, setR] = useState(initialR);
  const rRef = useRef(r);
  const p5Ref = useRef(null);

  const { containerRef } = useP5((p) => {
    p5Ref.current = p;

    p.setup = () => {
      p.createCanvas(width, height);
      p.noLoop();
    };

    p.draw = () => {
      p.background(15, 18, 25);

      let x = 0.2;
      const iterations = 100;
      const margin = 40;

      p.stroke(80, 90, 110);
      p.strokeWeight(1);
      p.line(margin, p.height - margin, p.width - margin, p.height - margin);
      p.line(margin, margin, margin, p.height - margin);

      p.fill(180, 190, 210);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text("iteration (n)", p.width / 2, p.height - 10);
      p.push();
      p.translate(15, p.height / 2);
      p.rotate(-p.PI / 2);
      p.text("x_n", 0, 0);
      p.pop();

      p.textAlign(p.LEFT);
      p.textSize(14);
      p.text(`r = ${rRef.current.toFixed(2)}`, margin, margin - 15);

      p.stroke(100, 180, 255);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();

      for (let i = 0; i < iterations; i++) {
        x = rRef.current * x * (1 - x);
        const px = p.map(i, 0, iterations - 1, margin, p.width - margin);
        const py = p.map(x, 0, 1, p.height - margin, margin);
        p.vertex(px, py);
      }
      p.endShape();

      x = 0.2;
      p.fill(255, 100, 150);
      p.noStroke();
      for (let i = 0; i < iterations; i++) {
        x = rRef.current * x * (1 - x);
        const px = p.map(i, 0, iterations - 1, margin, p.width - margin);
        const py = p.map(x, 0, 1, p.height - margin, margin);
        if (i % 5 === 0) {
          p.circle(px, py, 4);
        }
      }
    };
  });

  useEffect(() => {
    rRef.current = r;
    if (p5Ref.current) {
      p5Ref.current.redraw();
    }
  }, [r]);

  return (
    <div>
      <div ref={containerRef}></div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>Adjust r:</label>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.01"
          value={r}
          onChange={(e) => setR(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 13, fontFamily: 'monospace' }}>
          {r.toFixed(2)}
        </span>
      </div>
    </div>
  );
}