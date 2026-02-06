import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useRef } from "react";

export default function ExponentialInteractiveSketchNegative({ width = 500, height = 380 }) {
  const isVisibleRef = useRef(false);

  return (
    <P5WebEditorSketch
      width={width}
      height={height}
      onMount={(el) => {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              isVisibleRef.current = true;
              obs.disconnect();
            }
          },
          { threshold: 0.4, rootMargin: "0px 0px" }
        );
        obs.observe(el);
      }}
    >
      {(p) => {
        // --------------------------
        // Model + layout
        // --------------------------
        let P0 = 1000;          // fixed
        let r = 0.9;           // initial within [1,2]
        let rMin = 0.0;
        let rMax = 1.0;
        let maxN = 9;

        let plot = { x: 60, y: 60, w: 390, h: 260 }; // slightly lower to fit slider/label

        // Fixed axis scale (based on maximum possible growth at rMax)
        let yMin = 0;
        let yMax = 1024; // headroom

        const samples = 260;   // curve resolution

        // --------------------------
        // Styling
        // --------------------------
        const BG = "#0f1218";
        const curveColor = "#c66bff";

        // --------------------------
        // UI
        // --------------------------
        let rSlider;

        // --------------------------
        // Geometry state (current vs target for smooth deformation)
        // --------------------------
        let values = [];
        let pts = [];
        let tgtPts = [];
        let curve = [];
        let tgtCurve = [];

        p.setup = function () {
          p.createCanvas(width, height);
          p.textFont("system-ui");

          initGeometry();

          // Slider: centered horizontally, lower down
          const sliderW = 260;
          rSlider = p.createSlider(rMin, rMax, r, 0.01);
          rSlider.style("width", sliderW + "px");
          rSlider.position(p.width / 2 - sliderW / 2, 32);

          // Minimal dark-mode styling (limited by native slider styling differences)
          rSlider.style("appearance", "none");
          rSlider.style("height", "6px");
          rSlider.style("border-radius", "999px");
          rSlider.style("background", "rgba(255,255,255,0.18)");
          rSlider.style("outline", "none");
          rSlider.style("cursor", "pointer");
        };

        p.draw = function () {
          p.background(BG);

          drawGrid();
          drawAxes();
          drawRLabel();

          // Only react/update if visible (optional safeguard)
          if (isVisibleRef.current && rSlider) {
            const newR = rSlider.value();
            if (Math.abs(newR - r) > 1e-6) {
              r = newR;
              recomputeTargets(false);
            }
          }

          updateSmoothing();
          drawCurve();
          drawPoints();
        };

        // --------------------------
        // Geometry + math
        // --------------------------
        function initGeometry() {
          curve = new Array(samples + 1).fill(0).map(() => ({ x: 0, y: 0 }));
          tgtCurve = new Array(samples + 1).fill(0).map(() => ({ x: 0, y: 0 }));

          pts = [];
          tgtPts = [];
          for (let n = 0; n <= maxN; n++) {
            pts.push({ n, x: 0, y: 0 });
            tgtPts.push({ n, x: 0, y: 0 });
          }

          recomputeTargets(true);
        }

        function computeValues() {
          values = [];
          let P = P0;
          for (let n = 0; n <= maxN; n++) {
            values.push(P);
            P *= r;
          }
        }

        function recomputeTargets(snap = false) {
          computeValues();

          // target integer points
          for (let n = 0; n <= maxN; n++) {
            tgtPts[n].x = mapNtoX(n);
            tgtPts[n].y = mapPtoY(values[n]);
          }

          // target curve samples
          for (let i = 0; i <= samples; i++) {
            const t = i / samples; // 0..1
            const n = t * maxN;
            const P = P0 * Math.pow(r, n);
            tgtCurve[i].x = mapNtoX(n);
            tgtCurve[i].y = mapPtoY(P);
          }

          if (snap) {
            for (let n = 0; n <= maxN; n++) {
              pts[n].x = tgtPts[n].x;
              pts[n].y = tgtPts[n].y;
            }
            for (let i = 0; i <= samples; i++) {
              curve[i].x = tgtCurve[i].x;
              curve[i].y = tgtCurve[i].y;
            }
          }
        }

        function updateSmoothing() {
          const aPts = 0.16;
          const aCurve = 0.12;

          for (let n = 0; n <= maxN; n++) {
            pts[n].x = p.lerp(pts[n].x, tgtPts[n].x, aPts);
            pts[n].y = p.lerp(pts[n].y, tgtPts[n].y, aPts);
          }

          for (let i = 0; i <= samples; i++) {
            curve[i].x = p.lerp(curve[i].x, tgtCurve[i].x, aCurve);
            curve[i].y = p.lerp(curve[i].y, tgtCurve[i].y, aCurve);
          }
        }

        // --------------------------
        // Drawing helpers
        // --------------------------
        function drawGrid() {
          p.stroke(255, 18);
          p.strokeWeight(1);

          let spacing = 24;
          for (let x = 0; x <= p.width; x += spacing) p.line(x, 0, x, p.height);
          for (let y = 0; y <= p.height; y += spacing) p.line(0, y, p.width, y);

          p.stroke(255, 28);
          spacing = 120;
          for (let x = 0; x <= p.width; x += spacing) p.line(x, 0, x, p.height);
          for (let y = 0; y <= p.height; y += spacing) p.line(0, y, p.width, y);
        }

        function drawAxes() {
          // left + bottom axes
          p.stroke(255, 90);
          p.strokeWeight(1.5);

          const x0 = plot.x;
          const y0 = plot.y + plot.h;

          p.line(x0, plot.y, x0, y0);                // y-axis
          p.line(x0, y0, plot.x + plot.w, y0);        // x-axis

          // ticks + labels
          p.noStroke();
          p.fill(255, 175);
          p.textSize(12);

          // x ticks (months)
          p.textAlign(p.CENTER, p.TOP);
          for (let n = 0; n <= maxN; n++) {
            const x = mapNtoX(n);
            p.stroke(255, 70);
            p.strokeWeight(1);
            p.line(x, y0, x, y0 + 6);
            p.noStroke();
            p.text(n, x, y0 + 8);
          }

          // y ticks: fixed scale, evenly spaced
          const ticks = 4;
          p.textAlign(p.RIGHT, p.CENTER);
          for (let i = 0; i <= ticks; i++) {
            const v = (i / ticks) * yMax;
            const y = mapPtoY(v);
            p.stroke(255, 70);
            p.strokeWeight(1);
            p.line(x0 - 6, y, x0, y);
            p.noStroke();
            p.fill(255, 165);
            const label = v >= 1000 ? Math.round(v) : Math.round(v * 10) / 10;
            p.text(label, x0 - 10, y);
          }

          // axis labels
          p.fill(255, 210);
          p.textSize(14);

          p.textAlign(p.CENTER, p.TOP);
          p.text("Month (n)", plot.x + plot.w / 2, y0 + 34);

          p.push();
          p.translate(plot.x - 44, plot.y + plot.h / 2);
          p.rotate(-p.HALF_PI);
          p.textAlign(p.CENTER, p.TOP);
          p.text("Population (Pₙ)", 0, 0);
          p.pop();
        }

        function drawRLabel() {
          // centered label above slider
          p.noStroke();
          p.fill(255, 210);
          p.textSize(16);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`r = ${r.toFixed(2)}`, p.width / 2, 50);
        }

        function drawCurve() {
          p.noFill();
          p.stroke(curveColor);
          p.strokeWeight(2.5);

          p.beginShape();
          for (let v of curve) p.vertex(v.x, v.y);
          p.endShape();
        }

        function drawPoints() {
          for (let n = 0; n <= maxN; n++) {
            const po = pts[n];

            // glow + core
            p.noStroke();
            p.fill(255, 40);
            p.ellipse(po.x, po.y, 15, 15);

            p.fill(255);
            p.ellipse(po.x, po.y, 8, 8);

            // label above: P with subscript n
            drawPSubscriptLabel(po.x, po.y - 18, n);
          }
        }

        function drawPSubscriptLabel(x, y, n) {
          const mainSize = 14;
          const subSize = 10;

          p.textAlign(p.LEFT, p.BASELINE);
          p.fill(255, 230);
          p.noStroke();

          p.textSize(mainSize);
          const wP = p.textWidth("P");

          p.textSize(subSize);
          const wn = p.textWidth(String(n));

          const totalW = wP + wn;
          const left = x - totalW / 2;

          p.textSize(mainSize);
          p.text("P", left, y);

          p.textSize(subSize);
          p.text(String(n), left + wP, y + 4);
        }

        // --------------------------
        // Mapping
        // --------------------------
        function mapNtoX(n) {
          return p.map(n, 0, maxN, plot.x + 18, plot.x + plot.w - 10);
        }

        function mapPtoY(P) {
            let t = (P - yMin) / (yMax - yMin);
            // allow t > 1 so it can go above the plot
            // (optional: still clamp below so negatives don't go weird)
            t = Math.max(t, 0);
            return p.lerp(plot.y + plot.h - 10, plot.y + 10, t);
        }
      }}
    </P5WebEditorSketch>
  );
}
