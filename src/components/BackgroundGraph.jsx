import { useEffect, useRef } from "react";

export default function BackgroundGraph() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    }
    function onLeave() {
      mouseRef.current.active = false;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const isTouch =
      "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;

    const baseCount = isTouch ? 350 : 700;
    const nodeCount = reducedMotion ? Math.floor(baseCount / 2) : baseCount;
    const maxDist = isTouch ? 75 : 120;

    const nodes = Array.from({ length: nodeCount }, (_, id) => ({
        id,
        x: Math.random() * w * 0.75 + w * 0.125,
        y: Math.random() * h * 0.75 + h * 0.125,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
    }));

    function pairRand01(i, j) {
        // Deterministic "random" number in [0,1) based only on the pair (i,j)
        // Works by hashing into a 32-bit integer then normalizing.
        let x = (i * 374761393) ^ (j * 668265263);
        x = (x ^ (x >>> 13)) * 1274126177;
        x = x ^ (x >>> 16);
        return (x >>> 0) / 4294967296;
    }


    function drawFrame() {
      ctx.clearRect(0, 0, w, h);

      // subtle overlay so text stays readable
      ctx.fillStyle = "rgba(57, 54, 54, 0.2)";
      ctx.fillRect(0, 0, w, h);

      const mouse = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const r2 = dx * dx + dy * dy;
          const r = Math.sqrt(r2);
          const influence = 140;
          if (r > 0 && r < influence) {
            const push = (1 - r / influence) * 0.9;
            n.vx += (dx / r) * push * -0.001;
            n.vy += (dy / r) * push * -0.001;
          }
        }

        n.vx *= 1;
        n.vy *= 1;
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const connectProb = 0.7;

            // Stable randomness: the same pair is either "allowed" or not
            const r = pairRand01(a.id, b.id);
            if (r > connectProb) continue;

            const mouse = mouseRef.current;

            // If mouse isn't active (left the window), don't draw edges at all
            if (!mouse.active) continue;

            // Distance from mouse to the midpoint of the edge
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;

            const mdx = mx - mouse.x;
            const mdy = my - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            // How far the mouse influence reaches (tweak this)
            const mouseRadius = 350;

            // Map mouse distance -> brightness (1 when close, 0 when far)
            let mouseFactor = 1 - mDist / mouseRadius;
            if (mouseFactor <= 0) continue; // too far: don't draw edge

            // Ease it a bit so it “blooms” near the mouse
            mouseFactor = mouseFactor * mouseFactor;

            // Final alpha depends ONLY on mouse proximity (not on edge length)
            const alpha = 0.60 * mouseFactor;

            const color = "rgba(30, 134, 126, 1)";

            ctx.strokeStyle = `rgba(30, 134, 126, ${alpha})`;

            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            }
        }
      }

      // points
      for (const n of nodes) {
        ctx.fillStyle = "rgba(220, 230, 255, 0.15)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    if (!reducedMotion) {
      rafRef.current = requestAnimationFrame(drawFrame);
    } else {
      // draw one static frame
      drawFrame();
      cancelAnimationFrame(rafRef.current);
    }

    function onVis() {
      if (reducedMotion) return;
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else rafRef.current = requestAnimationFrame(drawFrame);
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}