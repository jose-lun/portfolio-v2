import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useState, useEffect, useRef } from "react";

export default function ExponentialGrowthSketch({ width = 500, height = 380 }) {
  const isVisibleRef = useRef(false);
  return (
    <P5WebEditorSketch
        width={width}
        height={height}
        onMount={(el) => {
            // Set up visibility observer
            const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        isVisibleRef.current = true;
                    }, 2000);
                    obs.disconnect();
                }
            },
            { threshold: 0.5, rootMargin: "0px 0px" }
            );
            obs.observe(el);
        }}
        >
        {(p) => {
            let r = 2.0;
            let P0 = 2;

            let maxN = 9;
            let values = [];
            let points = [];

            let plot = { x: 60, y: 50, w: 390, h: 270 };

            let progress = 0;
            let speed = 0.005;       // animation speed
            let refreshButton;

            // styling
            const BG = "#0f1218";
            const curveColor = "#c66bff";

            p.setup = function() {
                p.createCanvas(500, 380);
                p.textFont("system-ui");
                computeValues();
                initPoints();
                refreshButton = p.createButton("↻");
                refreshButton.mousePressed(resetAnimation);

                refreshButton.position(12, p.height - 42);
                refreshButton.style("width", "34px");
                refreshButton.style("height", "34px");
                refreshButton.style("border-radius", "999px");
                refreshButton.style("border", "none");
                refreshButton.style("background", "rgba(255,255,255,0.10)");
                refreshButton.style("color", "rgba(255,255,255,0.90)");
                refreshButton.style("font-family", "Segoe UI");
                refreshButton.style("font-size", "18px");
                refreshButton.style("line-height", "34px");
                refreshButton.style("text-align", "center");
                refreshButton.style("cursor", "pointer");
                refreshButton.style("backdrop-filter", "blur(6px)");
                refreshButton.style("transition", "background 0.2s ease, transform 0.08s ease");

                refreshButton.mouseOver(() => refreshButton.style("background", "rgba(255,255,255,0.16)"));
                refreshButton.mouseOut(() => refreshButton.style("background", "rgba(255,255,255,0.10)"));

                // press animation (doesn't override resetAnimation because it uses native DOM events)
                refreshButton.elt.addEventListener("mousedown", () => refreshButton.style("transform", "scale(0.95)"));
                refreshButton.elt.addEventListener("mouseup", () => refreshButton.style("transform", "scale(1)"));
                refreshButton.elt.addEventListener("mouseleave", () => refreshButton.style("transform", "scale(1)"));
            }

            p.draw = function() {
                p.background(BG);

                drawGrid();
                drawAxes(); // left + bottom only, with labels

                // Only animate if visible!
                if (isVisibleRef.current) {
                    progress = p.min(1, progress + speed);
                }

                drawCurve(progress);
                spawnPointsIfReached(progress);
                drawPoints();
            }

            function computeValues() {
                values = [];
                let P = P0;
                for (let n = 0; n <= maxN; n++) {
                    values.push(P);
                    P = r * P;
                }
            }

            function initPoints() {
                points = [];
                for (let n = 0; n <= maxN; n++) {
                    points.push({
                        n,
                        P: values[n],
                        x: mapNtoX(n),
                        y: mapPtoY(values[n]),
                        spawned: false,
                        spawnFrame: 0
                    });
                }
            }

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
                // axes lines (left + bottom only)
                p.stroke(255, 90);
                p.strokeWeight(1.5);

                let x0 = plot.x;
                let y0 = plot.y + plot.h;

                // y-axis
                p.line(x0, plot.y, x0, y0);
                // x-axis
                p.line(x0, y0, plot.x + plot.w, y0);

                // ticks + labels
                p.noStroke();
                p.fill(255, 175);
                p.textSize(12);

                // x ticks (months)
                p.textAlign(p.CENTER, p.TOP);
                for (let n = 0; n <= maxN; n++) {
                    let x = mapNtoX(n);
                    // tick mark
                    p.stroke(255, 70);
                    p.strokeWeight(1);
                    p.line(x, y0, x, y0 + 6);
                    p.noStroke();
                    p.text(n, x, y0 + 8);
                }

                // y ticks (a few population values)
                let yTicks = [values[0], values[5], values[7], values[maxN]];
                yTicks = [...new Set(yTicks)].sort((a, b) => a - b);

                p.textAlign(p.RIGHT, p.CENTER);
                for (let v of yTicks) {
                    let y = mapPtoY(v);
                    p.stroke(255, 70);
                    p.strokeWeight(1);
                    p.line(x0 - 6, y, x0, y);
                    p.noStroke();
                    p.fill(255, 165);
                    p.text(v, x0 - 10, y);
                }

                // axis labels
                p.fill(255, 210);
                p.textSize(14);

                // x-axis label
                p.textAlign(p.CENTER, p.TOP);
                p.text("Month (n)", plot.x + plot.w / 2, y0 + 34);
                // y-axis label
                p.push();
                p.translate(plot.x - 44, plot.y + plot.h / 2);
                p.rotate(-p.HALF_PI);
                p.textAlign(p.CENTER, p.TOP);
                p.text("Population (Pₙ)", 0, 0);
                p.pop();
            }

            function drawCurve(prog) {
                // Draw curve left->right up to n = prog*maxN (solid color, no gradient)
                let totalSamples = 260;
                let endSamples = p.max(2, p.floor(totalSamples * prog));

                p.noFill();
                p.stroke(curveColor);
                p.strokeWeight(2.5);

                p.beginShape();
                for (let i = 0; i <= endSamples; i++) {
                    let t = i / totalSamples;
                    let n = t * maxN;
                    let P = P0 * p.pow(r, n);
                    p.vertex(mapNtoX(n), mapPtoY(P));
                }
                p.endShape();
            }

            function spawnPointsIfReached(prog) {
                // pop in when curve reaches month n
                for (let po of points) {
                    if (!po.spawned && prog >= po.n / maxN) {
                    po.spawned = true;
                    po.spawnFrame = p.frameCount;
                    }
                }
            }

            function drawPoints() {
                for (let po of points) {
                    if (!po.spawned) continue;
                    drawPointBubble(po);
                }
            }

            function drawPointBubble(po) {
                let age = p.frameCount - po.spawnFrame;

                // bubble scale: quick overshoot then settle
                let s;
                if (age < 8) s = easeOutBack(age / 8);
                else if (age < 18) s = p.lerp(1.10, 1.00, (age - 8) / 10);
                else s = 1.00;

                // subtle ring ripple
                if (age < 16) {
                    let t = age / 16;
                    let rr = p.lerp(8, 22, t);
                    let a = p.lerp(50, 0, t);
                    p.noFill();
                    p.stroke(255, a);
                    p.strokeWeight(1.5);
                    p.ellipse(po.x, po.y, rr * 1.5, rr * 1.5);
                }

                // point glow + core
                p.noStroke();
                p.fill(255, 40);
                p.ellipse(po.x, po.y, 15 * s, 15 * s);

                p.fill(255);
                p.ellipse(po.x, po.y, 8 * s, 8 * s);
                // label above point: P with subscript n (centered)
                drawPSubscriptLabel(po.x-3, po.y - 18, po.n);
            }

            function drawPSubscriptLabel(x, y, n) {
                let mainSize = 14;
                let subSize = 10;

                p.textAlign(p.LEFT, p.BASELINE);
                p.fill(255, 230);
                p.noStroke();

                p.textSize(mainSize);
                let wP = p.textWidth("P");

                p.textSize(subSize);
                let wn = p.textWidth(String(n));

                let totalW = wP + wn;
                let left = x - totalW / 2;

                p.textSize(mainSize);
                p.text("P", left, y);

                p.textSize(subSize);
                p.text(String(n), left + wP, y + 4);
            }

            function mapNtoX(n) {
                return p.map(n, 0, maxN, plot.x + 18, plot.x + plot.w - 10);
            }

            function mapPtoY(P) {
                // LINEAR y-scale so exponential appears curved (not a straight line)
                let minP = values[0];
                let maxP = values[values.length - 1];

                let t = (P - minP) / (maxP - minP); // 0..1
                t = p.constrain(t, 0, 1);

                return p.lerp(plot.y + plot.h - 10, plot.y + 10, t);
            }

            function easeOutBack(t) {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * p.pow(t - 1, 3) + c1 * p.pow(t - 1, 2);
            }

            function resetAnimation() {
                progress = 0;
                initPoints();
            }

            p.windowResized = function() {
                refreshButton.position(12, p.height - 42);
            }

        }}
    </P5WebEditorSketch>
  );
}