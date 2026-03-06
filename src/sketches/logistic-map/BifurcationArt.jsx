import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";
import { useRef } from "react";

export default function BifurcationArt({
    width = 1200,
    height = 700
}) {
    const isVisibleRef = useRef(false);
    const p5InstanceRef = useRef(null);

    return (
        <div style={{
            width: '100%',
            margin: '80px 0',
            background: 'transparent'
        }}>
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
                    const rMin = 1.9;
                    const rMax = 2.8;

                    const x0 = 0.1;
                    const burnIn = 200;      // reduced for speed
                    const plotPoints = 30;   // reduced for performance

                    // Full canvas
                    const xMin = 0.4;
                    const xMax = 1.3;

                    // --------------------------
                    // Styling
                    // --------------------------
                    const BG = "transparent";  // transparent background

                    // --------------------------
                    // Data storage - PRE-CALCULATED
                    // --------------------------
                    let allBifurcationPoints = [];
                    let isComputed = false;
                    let colorOffset = 0;  // Simple color rotation

                    p.setup = function () {
                        p.createCanvas(width, height);
                        p.colorMode(p.HSB, 360, 100, 100, 100);
                        p.pixelDensity(1);  // Reduce pixel density for better performance

                        // Pre-calculate all bifurcation points
                        console.log("Computing artistic bifurcation diagram...");
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
                        // Optimized resolution
                        const rStep = 0.003;  // Slightly larger steps for speed
                        const numSteps = Math.floor((rMax - rMin) / rStep);

                        for (let i = 0; i <= numSteps; i++) {
                            const r = rMin + i * rStep;
                            let x = x0;

                            // Burn in to reach attractor
                            for (let j = 0; j < burnIn; j++) {
                                x = x + r * (1 - x) * x;
                            }

                            // Collect equilibrium points
                            let sampledPoints = [];
                            for (let j = 0; j < plotPoints; j++) {
                                x = x + r * (1 - x) * x;
                                sampledPoints.push(x);
                            }

                            // Remove duplicates
                            let uniquePoints = removeDuplicates(sampledPoints, 0.002);

                            // Add to main array with pre-calculated positions
                            const px = mapRtoX(r);
                            for (let xVal of uniquePoints) {
                                allBifurcationPoints.push({
                                    r,
                                    x: xVal,
                                    px: px,
                                    py: mapXtoY(xVal),
                                    hueBase: ((r - rMin) / (rMax - rMin)) * 280  // pre-calculate
                                });
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

                    p.draw = function () {
                        // Transparent background to blend with page
                        p.clear();

                        if (!isComputed) return;

                        // Smooth color rotation over time (faster)
                        colorOffset += 4.0;

                        drawBifurcationArt();
                    };

                    function drawBifurcationArt() {
                        p.noStroke();

                        // Draw points with vibrant, rotating colors
                        for (let i = 0; i < allBifurcationPoints.length; i++) {
                            const pt = allBifurcationPoints[i];

                            // Rotate colors over time - simple and smooth
                            let hue = (pt.hueBase + colorOffset) % 360;

                            // Vibrant, poppy colors
                            const xNorm = (pt.x - xMin) / (xMax - xMin);
                            let sat = 75 + xNorm * 25;  // High saturation (75-100)
                            let bright = 80 + xNorm * 20;  // High brightness (80-100)
                            let alpha = 80;  // Higher alpha for visibility

                            // Crisp, visible points
                            p.fill(hue, sat, bright, alpha);
                            p.ellipse(pt.px, pt.py, 2.5, 2.5);
                        }
                    }

                    // --------------------------
                    // Mapping functions
                    // --------------------------
                    function mapRtoX(r) {
                        return p.map(r, rMin, rMax, 20, width - 20);
                    }

                    function mapXtoY(x) {
                        const t = (x - xMin) / (xMax - xMin);
                        return p.lerp(height - 20, 20, p.constrain(t, 0, 1));
                    }
                }}
            </P5WebEditorSketch>
        </div>
    );
}
