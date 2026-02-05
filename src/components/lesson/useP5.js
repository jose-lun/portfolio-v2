import { useEffect, useRef } from "react";
import p5 from "p5";

/**
 * Hook for integrating p5.js with React
 * @param {Function} sketch - Function that defines the p5 sketch
 * @returns {Object} - containerRef to attach to a div
 */
export function useP5(sketch) {
  const containerRef = useRef(null);
  const p5Instance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    p5Instance.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [sketch]);

  return { containerRef, p5Instance };
}