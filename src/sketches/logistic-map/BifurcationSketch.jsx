import { useP5 } from "../../components/lesson/useP5";

export default function BifurcationSketch({ width = 500, height = 400 }) {
  const { containerRef } = useP5((p) => {
    p.setup = () => {
      p.createCanvas(width, height);
      p.pixelDensity(1);
    };

    p.draw = () => {
      p.background(15, 18, 25);

      const rMin = 2.4;
      const rMax = 4.0;
      const iterations = 300;
      const plotPoints = 200;

      p.strokeWeight(0.8);
      p.stroke(100, 180, 255, 180);

      for (let px = 0; px < p.width; px++) {
        const r = p.map(px, 0, p.width, rMin, rMax);
        let x = 0.5;

        for (let i = 0; i < iterations; i++) {
          x = r * x * (1 - x);
        }

        for (let i = 0; i < plotPoints; i++) {
          x = r * x * (1 - x);
          const py = p.map(x, 0, 1, p.height, 0);
          p.point(px, py);
        }
      }

      p.fill(180, 190, 210, 200);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text("r", p.width / 2, p.height - 20);
      p.push();
      p.translate(15, p.height / 2);
      p.rotate(-p.PI / 2);
      p.text("x", 0, 0);
      p.pop();

      p.noLoop();
    };
  });

  return <div ref={containerRef}></div>;
}