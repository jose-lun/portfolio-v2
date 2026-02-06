import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useRef } from "react";

export default function LogisticMapInteractiveSketch({ width = 500, height = 380 }) {
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
        let P0 = 2.0; // fixed initial population
        let r = 1;  // initial r
        let K = 750;  // initial carrying capacity
        let maxN = 15;

        // Leave room for sliders on top
        let plot = { x: 60, y: 75, w: 390, h: 240 };

        // Fixed y-axis scale
        let yMin = 0;
        let yMax = 1200;

        const samples = 260;

        // --------------------------
        // Styling
        // --------------------------
        const BG = "#0f1218";
        const curveColor = "#c66bff";

        // --------------------------
        // UI
        // --------------------------
        let rSlider;
        let kSlider;

        // slider layout (so labels can sit to the right)
        const sliderW = 240;
        let sliderX = 0;

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

          sliderX = p.width / 2 - sliderW / 2;

          rSlider = p.createSlider(0.0, 3, r, 0.01);
          rSlider.style("width", sliderW + "px");
          rSlider.position(sliderX, 40);
          styleSlider(rSlider);

          kSlider = p.createSlider(100, 1000, K, 1);
          kSlider.style("width", sliderW + "px");
          kSlider.position(sliderX, 70);
          styleSlider(kSlider);
        };

        function styleSlider(sl) {
          sl.style("appearance", "none");
          sl.style("height", "6px");
          sl.style("border-radius", "999px");
          sl.style("background", "rgba(255,255,255,0.18)");
          sl.style("outline", "none");
          sl.style("cursor", "pointer");
        }

        p.draw = function () {
          p.background(BG);

          drawGrid();
          drawAxes();

          // carrying capacity reference line (red dotted)
          drawCarryingCapacityLine();

          if (isVisibleRef.current) {
            const newR = rSlider ? rSlider.value() : r;
            const newK = kSlider ? kSlider.value() : K;

            if (Math.abs(newR - r) > 1e-6 || Math.abs(newK - K) > 1e-6) {
              r = newR;
              K = newK;
              recomputeTargets(false);
            }
          }

          updateSmoothing();
          drawCurve();
          drawPoints();
          drawSliderLabelsRight();
        };

        // --------------------------
        // Logistic map (P units):
        // P_{n+1} = r P_n (1 - P_n/K)
        // --------------------------
        function computeValues() {
          values = [];
          let P = P0;
          for (let n = 0; n <= maxN; n++) {
            values.push(P);
            P = r * P * (1 - P / K) + P;
          }
        }

        // --------------------------
        // Geometry
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

        function recomputeTargets(snap = false) {
          computeValues();

          // target integer points
          for (let n = 0; n <= maxN; n++) {
            tgtPts[n].x = mapNtoX(n);
            tgtPts[n].y = mapPtoY(values[n]);
          }

          // Build a visually smooth curve by linearly interpolating between discrete points
          const dense = [];
          const segSteps = Math.max(6, Math.floor(samples / maxN));

          for (let n = 0; n < maxN; n++) {
            const Pn = values[n];
            const Pn1 = values[n + 1];
            for (let j = 0; j < segSteps; j++) {
              const t = j / segSteps;
              dense.push({ n: n + t, P: p.lerp(Pn, Pn1, t) });
            }
          }
          dense.push({ n: maxN, P: values[maxN] });

          // Resample to fixed curve length
          for (let i = 0; i <= samples; i++) {
            const u = i / samples;
            const targetN = u * maxN;

            let idx = 0;
            while (idx < dense.length - 1 && dense[idx + 1].n < targetN) idx++;

            const a = dense[idx];
            const b = dense[Math.min(idx + 1, dense.length - 1)];
            const span = Math.max(1e-9, b.n - a.n);
            const t = (targetN - a.n) / span;

            const Pinterp = p.lerp(a.P, b.P, p.constrain(t, 0, 1));

            tgtCurve[i].x = mapNtoX(targetN);
            tgtCurve[i].y = mapPtoY(Pinterp);
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
          const aPts = 0.18;
          const aCurve = 0.14;

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
        // Drawing
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
          p.stroke(255, 90);
          p.strokeWeight(1.5);

          const x0 = plot.x;
          const y0 = plot.y + plot.h;

          const yTop = mapPtoY(yMax); // where the top of the scale actually is
          p.line(x0, yTop, x0, y0);

          p.line(x0, y0, plot.x + plot.w, y0); // x-axis

          // ticks + labels
          p.noStroke();
          p.fill(255, 175);
          p.textSize(12);

          // x ticks
          p.textAlign(p.CENTER, p.TOP);
          for (let n = 0; n <= maxN; n++) {
            const x = mapNtoX(n);
            p.stroke(255, 70);
            p.strokeWeight(1);
            p.line(x, y0, x, y0 + 6);
            p.noStroke();
            p.text(n, x, y0 + 8);
          }

          // y ticks (fixed scale 0..1500)
          const ticks = 5;
          p.textAlign(p.RIGHT, p.CENTER);
          for (let i = 0; i <= ticks; i++) {
            const v = (i / ticks) * yMax;
            const y = mapPtoY(v);
            p.stroke(255, 70);
            p.strokeWeight(1);
            p.line(x0 - 6, y, x0, y);
            p.noStroke();
            p.fill(255, 165);
            p.text(Math.round(v), x0 - 10, y);
          }

          // axis labels
          p.fill(255, 210);
          p.textSize(14);

          p.textAlign(p.CENTER, p.TOP);
          p.text("Month (n)", plot.x + plot.w / 2, y0 + 34);

          p.push();
          p.translate(plot.x - 50, plot.y + plot.h / 2);
          p.rotate(-p.HALF_PI);
          p.textAlign(p.CENTER, p.TOP);
          p.text("Population (Pₙ)", 0, 0);
          p.pop();
        }

        function drawCarryingCapacityLine() {
          const y = mapPtoY(K);
          const xL = plot.x;
          const xR = plot.x + plot.w;

          // red dotted line
          p.stroke(255, 70, 70, 210);
          p.strokeWeight(1.5);

          const dash = 6;
          const gap = 6;
          for (let x = xL; x < xR; x += dash + gap) {
            p.line(x, y, Math.min(x + dash, xR), y);
          }

          // small label "K" near left
          p.noStroke();
          p.fill(255, 120, 120, 220);
          p.textSize(12);
          p.textAlign(p.LEFT, p.BOTTOM);
          p.text("K", xL + 4, y - 4);
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

            p.noStroke();
            p.fill(255, 40);
            p.ellipse(po.x, po.y, 15, 15);

            p.fill(255);
            p.ellipse(po.x, po.y, 8, 8);

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

        function drawSliderLabelsRight() {
          // labels immediately to the right of sliders (aligned with slider rows)
          const labelX = sliderX + sliderW + 14;

          p.noStroke();
          p.fill(255, 210);
          p.textSize(15);
          p.textAlign(p.LEFT, p.CENTER);

          // Slider center y's (based on slider y + ~3px)
          p.text(`r = ${r.toFixed(2)}`, labelX, 26);
          p.text(`K = ${Math.round(K)}`, labelX, 52);
        }

        // --------------------------
        // Mapping
        // --------------------------
        function mapNtoX(n) {
          return p.map(n, 0, maxN, plot.x + 18, plot.x + plot.w - 10);
        }

        function mapPtoY(P) {
          // Allow overflow above plot if P > yMax (no top clamp)
          let t = (P - yMin) / (yMax - yMin);
          t = Math.max(t, 0); // keep bottom sane

          // Map to near the top of the canvas so overflow reaches the top
          const topEdge = 80;
          return p.lerp(plot.y + plot.h - 10, topEdge, t);
        }
      }}
    </P5WebEditorSketch>
  );
}
