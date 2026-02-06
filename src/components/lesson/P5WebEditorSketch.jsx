import { useP5 } from "./useP5";
import { useEffect } from "react";

/**
 * Component for p5 sketches written in the web editor style.
 * Just copy your setup/draw functions and paste them here!
 * 
 * @example
 * <P5WebEditorSketch width={400} height={300}>
 *   {(p) => {
 *     p.setup = function() {
 *       p.createCanvas(400, 300);
 *     }
 *     
 *     p.draw = function() {
 *       p.background(220);
 *       p.ellipse(p.mouseX, p.mouseY, 50);
 *     }
 *   }}
 * </P5WebEditorSketch>
 */
export default function P5WebEditorSketch({ children, width = 400, height = 300, onMount }) {
  const { containerRef } = useP5((p) => {
    // Call the sketch definition function
    children(p);
    
    // Return empty object since methods are already assigned directly to p
    return {};
  });

  // Call onMount after the container is set
  useEffect(() => {
    if (onMount && containerRef.current) {
      onMount(containerRef.current);
    }
  }, [onMount]);

  return <div ref={containerRef}></div>;
}