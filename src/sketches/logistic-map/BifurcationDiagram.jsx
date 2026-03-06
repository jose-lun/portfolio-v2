import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useRef } from "react";

export default function BifurcationDiagram({
    width = 900,
    height = 450,
    r_min = 1.9,
    r_max = 2.8,
    step_size = 0.0015
}) {
    const isVisibleRef = useRef(false);
    const p5InstanceRef = useRef(null);

    return (
        <P5WebEditorSketch
            width={width}
            height={height}
            onMount={(el) => {
                const obs = new IntersectionObserver(
                    ([entry]) => {
                        const wasVisible = isVisibleRef.current;
                        isVisibleRef.current = entry.isIntersecting;

                        // Start/stop the draw loop based on visibility
                        if (p5InstanceRef.current) {
                            if (entry.isIntersecting && !wasVisible) {
                                p5InstanceRef.current.loop();
                            } else if (!entry.isIntersecting && wasVisible) {
                                p5InstanceRef.current.noLoop();
                            }
                        }
                    },
                    { threshold: 0.1, rootMargin: "100px" }
                );
                obs.observe(el);
            }}
        >
            {(p) => {
                p5InstanceRef.current = p;

                // --------------------------
                // Model parameters
                // --------------------------
                const rMin = r_min;
                const rMax = r_max;
                const stepSize = step_size;

                const x0 = 0.1;
                const burnIn = 200;      // iterations to skip transient
                const plotPoints = 20;  // equilibrium points to plot per r value

                // --------------------------
                // Layout
                // --------------------------
                const plot = {
                    x: 80,
                    y: 60,
                    w: width - 140,
                    h: height - 140
                };

                const yMin = 0.4;
                const yMax = 1.25;

                // --------------------------
                // Styling
                // --------------------------
                const BG = "#0f1218";
                const pointColor = "#c66bff";
                const sliderLineColor = "#ff6b9d";

                // --------------------------
                // UI
                // --------------------------
                let rSlider;

                // --------------------------
                // Data storage - PRE-CALCULATED
                // --------------------------
                // Store all bifurcation points: { r, x }
                let allBifurcationPoints = [];
                let isComputed = false;

                p.setup = function () {
                    p.createCanvas(width, height);
                    p.textFont("system-ui");

                    // Ensure parent has relative positioning for absolute child
                    const parent = p.canvas.parentElement;
                    parent.style.position = "relative";

                    // Create slider with canvas-relative positioning
                    const sliderW = plot.w + 5;
                    rSlider = p.createSlider(rMin, rMax, rMin, stepSize);
                    rSlider.style("width", sliderW + "px");
                    rSlider.style("position", "absolute");
                    rSlider.style("left", (plot.x - 5) + "px");
                    rSlider.style("top", (plot.y + plot.h) + "px");
                    styleSlider(rSlider);

                    // Parent the slider to the canvas parent
                    rSlider.parent(parent);

                    // Pre-calculate all bifurcation points
                    console.log("Computing bifurcation diagram...");
                    const startTime = performance.now();
                    computeAllBifurcationPoints();
                    const endTime = performance.now();
                    console.log(`Computed in ${(endTime - startTime).toFixed(0)}ms`);
                    isComputed = true;

                    // Start paused if not visible
                    if (!isVisibleRef.current) {
                        p.noLoop();
                    }
                };

                function computeAllBifurcationPoints() {
                    // Compute for all r values at once
                    const rStep = stepSize;  // Resolution of r values
                    const numSteps = Math.floor((rMax - rMin) / rStep);

                    for (let i = 0; i <= numSteps; i++) {
                        const r = rMin + i * rStep;
                        let x = x0;

                        // Burn in to reach attractor
                        for (let j = 0; j < burnIn; j++) {
                            x = x + r * (1 - x) * x;
                        }

                        // Collect equilibrium points and remove duplicates
                        let sampledPoints = [];
                        for (let j = 0; j < plotPoints; j++) {
                            x = x + r * (1 - x) * x;
                            sampledPoints.push(x);
                        }

                        // Remove duplicate points (for stable equilibria)
                        let uniquePoints = removeDuplicates(sampledPoints, 0.001);

                        // Add to main array
                        for (let xVal of uniquePoints) {
                            allBifurcationPoints.push({ r, x: xVal });
                        }
                    }
                }

                function removeDuplicates(arr, tolerance) {
                    if (arr.length === 0) return [];

                    let unique = [arr[0]];
                    for (let i = 1; i < arr.length; i++) {
                        let isDuplicate = false;
                        for (let u of unique) {
                            if (Math.abs(arr[i] - u) < tolerance) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate) {
                            unique.push(arr[i]);
                        }
                    }
                    return unique;
                }

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

                    if (isComputed && rSlider) {
                        const currentR = rSlider.value();
                        drawBifurcationPoints(currentR);
                        drawSliderLine(currentR);
                    }
                };

                function drawBifurcationPoints(maxR) {
                    p.noStroke();
                    p.fill(pointColor);

                    // Draw points up to maxR - points are sorted by r
                    // We can break early once we exceed maxR
                    for (let pt of allBifurcationPoints) {
                        if (pt.r > maxR) break;  // Early exit - huge speedup!

                        const px = mapRtoX(pt.r);
                        const py = mapYtoScreen(pt.x);
                        p.ellipse(px, py, 1.5, 1.5);
                    }
                }

                function drawSliderLine(r) {
                    const x = mapRtoX(r);

                    // Vertical line at current r value
                    p.stroke(sliderLineColor);
                    p.strokeWeight(2);
                    const yTop = plot.y;
                    const yBottom = plot.y + plot.h;
                    p.line(x, yTop, x, yBottom);
                }

                function drawGrid() {
                    p.stroke(255, 18);
                    p.strokeWeight(1);

                    let spacing = 24;
                    for (let x = 0; x <= p.width; x += spacing) {
                        p.line(x, 0, x, p.height);
                    }
                    for (let y = 0; y <= p.height; y += spacing) {
                        p.line(0, y, p.width, y);
                    }

                    p.stroke(255, 28);
                    spacing = 120;
                    for (let x = 0; x <= p.width; x += spacing) {
                        p.line(x, 0, x, p.height);
                    }
                    for (let y = 0; y <= p.height; y += spacing) {
                        p.line(0, y, p.width, y);
                    }
                }

                function drawAxes() {
                    p.stroke(255, 90);
                    p.strokeWeight(1.5);

                    const x0 = plot.x;
                    const y0 = plot.y + plot.h;

                    // Draw axes
                    p.line(x0, plot.y, x0, y0);
                    p.line(x0, y0, plot.x + plot.w, y0);

                    // X-axis ticks and labels (r values)
                    p.noStroke();
                    p.fill(255, 175);
                    p.textSize(12);
                    p.textAlign(p.CENTER, p.TOP);

                    const xTicks = [0.5, 1.0, 1.5, 2.0, 2.5];
                    for (let r of xTicks) {
                        if (r >= rMin && r <= rMax) {
                            const x = mapRtoX(r);
                            p.stroke(255, 70);
                            p.strokeWeight(1);
                            p.line(x, y0, x, y0 + 6);
                            p.noStroke();
                            p.text(r.toFixed(1), x, y0 + 8);
                        }
                    }

                    // Y-axis ticks and labels
                    const yTicks = [0.5, 0.75, 1.0, 1.25];
                    p.textAlign(p.RIGHT, p.CENTER);
                    for (let val of yTicks) {
                        const y = mapYtoScreen(val);
                        p.stroke(255, 70);
                        p.strokeWeight(1);
                        p.line(x0 - 6, y, x0, y);
                        p.noStroke();
                        p.fill(255, 165);
                        p.text(val.toFixed(2), x0 - 10, y);
                    }

                    // Axis labels
                    p.fill(255, 210);
                    p.textSize(16);

                    p.textAlign(p.CENTER, p.TOP);
                    p.text("r", plot.x + plot.w / 2, y0 + 30);

                    p.push();
                    p.translate(plot.x - 55, plot.y + plot.h / 2);
                    p.rotate(-p.HALF_PI);
                    p.textAlign(p.CENTER, p.TOP);
                    p.text("Equilibrium Population", 0, 0);
                    p.pop();
                }

                // --------------------------
                // Mapping functions
                // --------------------------
                function mapRtoX(r) {
                    return p.map(r, rMin, rMax, plot.x, plot.x + plot.w);
                }

                function mapYtoScreen(y) {
                    const t = (y - yMin) / (yMax - yMin);
                    return p.lerp(plot.y + plot.h, plot.y, p.constrain(t, 0, 1));
                }
            }}
        </P5WebEditorSketch>
    );
}
