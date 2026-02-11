import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useRef } from "react";

export default function LogisticSketchOrbit2({ width = 500, height = 450 }) {
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
                let x_0 = 0.1;  // normalized initial value
                let r = 1.75;  // initial r (range 1.5 to 2.5)
                let maxN = 50;

                // Larger plot area for wide sketch
                let plot = { x: 80, y: 80, w: width - 160, h: height - 150 };

                // Fixed y-axis scale
                let yMin = 0;
                let yMax = 1.25;

                const samples = 250;

                // --------------------------
                // Styling
                // --------------------------
                const BG = "#0f1218";
                const curveColor = "#c66bff";

                // --------------------------
                // UI
                // --------------------------
                let rSlider;

                // slider layout
                const sliderW = 160;
                let sliderX = 0;

                // --------------------------
                // Geometry state
                // --------------------------
                let values = [];
                let pts = [];
                let tgtPts = [];
                let curve = [];
                let tgtCurve = [];

                // For period-2 detection
                let equilibria = [];

                p.setup = function () {
                    p.createCanvas(width, height);
                    p.textFont("system-ui");

                    initGeometry();

                    sliderX = p.width / 2 - sliderW / 2;

                    rSlider = p.createSlider(1.75, 2.3, r, 0.01);
                    rSlider.style("width", sliderW + "px");
                    rSlider.position(sliderX, 35);
                    styleSlider(rSlider);
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
                    drawEquilibriumLines();

                    if (isVisibleRef.current) {
                        const newR = rSlider ? rSlider.value() : r;

                        if (Math.abs(newR - r) > 1e-6) {
                            r = newR;
                            recomputeTargets(false);
                        }
                    }

                    updateSmoothing();
                    drawCurve();
                    drawPoints();
                    drawSliderLabel();
                };

                function drawEquilibriumLines() {
                    // Detect period-2 orbit by looking at last few values
                    // For period-2, the orbit alternates between two values
                    detectEquilibria();

                    // Always draw the red line at x = 1 (original equilibrium)
                    const y1 = mapPtoY(1);
                    const xL = plot.x;
                    const xR = plot.x + plot.w;
                    const dash = 6;
                    const gap = 6;

                    if (equilibria.length === 1) {
                        // Red dotted line at 1
                        p.stroke(255, 70, 70, 210);
                        p.strokeWeight(1.5);

                        for (let x = xL; x < xR; x += dash + gap) {
                            p.line(x, y1, Math.min(x + dash, xR), y1);
                        }
                    }

                    // If we have period-2 equilibria, draw them in blue
                    if (equilibria.length >= 2) {
                        for (let eq of equilibria) {
                            const y = mapPtoY(eq);

                            // Blue dotted line
                            p.stroke(70, 150, 255, 210);
                            p.strokeWeight(1.5);

                            for (let x = xL; x < xR; x += dash + gap) {
                                p.line(x, y, Math.min(x + dash, xR), y);
                            }
                        }
                    }
                }

                function detectEquilibria() {
                    // Run the map for many iterations to reach steady state
                    let x = x_0;
                    const burnIn = 200; // iterations to skip transient behavior
                    const samples = 100; // samples to analyze

                    // Burn in
                    for (let i = 0; i < burnIn; i++) {
                        x = r * x * (1 - x) + x;
                    }

                    // Collect samples
                    let sampledValues = [];
                    for (let i = 0; i < samples; i++) {
                        x = r * x * (1 - x) + x;
                        sampledValues.push(x);
                    }

                    // Find unique values (within tolerance)
                    const tolerance = 0.001;
                    equilibria = [];

                    for (let val of sampledValues) {
                        let isNew = true;
                        for (let eq of equilibria) {
                            if (Math.abs(val - eq) < tolerance) {
                                isNew = false;
                                break;
                            }
                        }
                        if (isNew) {
                            equilibria.push(val);
                        }
                    }

                    // Sort equilibria
                    equilibria.sort((a, b) => a - b);

                    // Only show if we have period-2 (or higher)
                    if (equilibria.length < 1) {
                        equilibria = [];
                    }
                }

                // --------------------------
                // "Logistic map": x_{n+1} = r x_n (1 - x_n)+x_n
                // --------------------------
                function computeValues() {
                    values = [];
                    let x = x_0;
                    for (let n = 0; n <= maxN; n++) {
                        values.push(x);
                        x = r * x * (1 - x) + x;
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

                    // Build a visually smooth curve
                    const dense = [];
                    const segSteps = Math.max(6, Math.floor(samples / maxN));

                    for (let n = 0; n < maxN; n++) {
                        const xn = values[n];
                        const xn1 = values[n + 1];
                        for (let j = 0; j < segSteps; j++) {
                            const t = j / segSteps;
                            dense.push({ n: n + t, x: p.lerp(xn, xn1, t) });
                        }
                    }
                    dense.push({ n: maxN, x: values[maxN] });

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

                        const xInterp = p.lerp(a.x, b.x, p.constrain(t, 0, 1));

                        tgtCurve[i].x = mapNtoX(targetN);
                        tgtCurve[i].y = mapPtoY(xInterp);
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

                    const yTop = mapPtoY(yMax);
                    p.line(x0, yTop, x0, y0);
                    p.line(x0, y0, plot.x + plot.w, y0);

                    // ticks + labels
                    p.noStroke();
                    p.fill(255, 175);
                    p.textSize(12);

                    // x ticks - show every 5th for 50 points
                    p.textAlign(p.CENTER, p.TOP);
                    for (let n = 0; n <= maxN; n += 5) {
                        const x = mapNtoX(n);
                        p.stroke(255, 70);
                        p.strokeWeight(1);
                        p.line(x, y0, x, y0 + 6);
                        p.noStroke();
                        p.text(n, x, y0 + 8);
                    }

                    // y ticks
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
                        p.text(v.toFixed(2), x0 - 10, y);
                    }

                    // axis labels
                    p.fill(255, 210);
                    p.textSize(16);

                    p.textAlign(p.CENTER, p.TOP);
                    p.text("Month (n)", plot.x + plot.w / 2, y0 + 30);

                    p.push();
                    p.translate(plot.x - 50, plot.y + plot.h / 2);
                    p.rotate(-p.HALF_PI);
                    p.textAlign(p.CENTER, p.TOP);
                    p.text("xₙ", 0, 0);
                    p.pop();
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
                        // Smaller points, no halo
                        p.noStroke();
                        p.fill(255);
                        p.ellipse(po.x, po.y, 5, 5);
                    }
                }

                function drawSliderLabel() {
                    const labelX = sliderX + sliderW + 20;

                    p.noStroke();
                    p.fill(255, 210);
                    p.textSize(17);
                    p.textAlign(p.LEFT, p.CENTER);

                    p.text(`r = ${r.toFixed(2)}`, labelX, 21);
                }

                // --------------------------
                // Mapping
                // --------------------------
                function mapNtoX(n) {
                    return p.map(n, 0, maxN, plot.x + 18, plot.x + plot.w - 10);
                }

                function mapPtoY(P) {
                    let t = (P - yMin) / (yMax - yMin);
                    t = Math.max(t, 0);

                    const topEdge = 100;
                    return p.lerp(plot.y + plot.h - 10, topEdge, t);
                }
            }}
        </P5WebEditorSketch>
    );
}