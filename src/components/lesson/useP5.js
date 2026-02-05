import { useEffect, useRef } from "react";
import p5 from "p5";

/**
 * Hook for integrating p5.js with React
 * @param {Function} sketchDef - Function that returns { setup, draw, ...otherMethods }
 * @param {Array} deps - Dependencies to recreate sketch (default: never recreate)
 * @returns {Object} - containerRef and p5Instance
 */
export function useP5(sketchDef, deps = []) {
  const containerRef = useRef(null);
  const p5Instance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p) => {
      const methods = sketchDef(p);
      
      // Assign all methods to p5 instance
      Object.keys(methods).forEach(key => {
        p[key] = methods[key];
      });
    };

    p5Instance.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, deps);

  return { containerRef, p5Instance };
}

/**
 * Hook for static p5 sketches (draw once, no animation)
 */
export function useP5Static(drawFn, width, height) {
  const { containerRef } = useP5((p) => ({
    setup: () => {
      p.createCanvas(width, height);
      p.pixelDensity(1);
    },
    draw: () => {
      drawFn(p);
      p.noLoop();
    }
  }));

  return { containerRef };
}

/**
 * Hook for interactive p5 sketches with reactive state
 */
export function useP5Interactive(drawFn, stateRef, width, height) {
  const p5Ref = useRef(null);
  const { containerRef } = useP5((p) => {
    p5Ref.current = p;
    return {
      setup: () => {
        p.createCanvas(width, height);
        p.noLoop();
      },
      draw: () => drawFn(p, stateRef)
    };
  });

  return { containerRef, p5Instance: p5Ref };
}