import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";

export default function SimpleIterationSketch({ width = 500, height = 400 }) {
  return (
    <P5WebEditorSketch width={width} height={height}>
      {(p) => {
        // Just paste your web editor code here!
        let r = 3.5;
        let x = 0.2;
        let points = [];
        
        p.setup = function() {
          p.createCanvas(width, height);
          p.background(15, 18, 25);
        };
        
        p.draw = function() {
          p.background(15, 18, 25);
          
          // Plot points
          p.stroke(100, 180, 255);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();
          for (let i = 0; i < points.length; i++) {
            let px = p.map(i, 0, 100, 40, p.width - 40);
            let py = p.map(points[i], 0, 1, p.height - 40, 40);
            p.vertex(px, py);
          }
          p.endShape();
          
          // Update logistic map
          if (points.length < 100) {
            x = r * x * (1 - x);
            points.push(x);
          } else {
            p.noLoop();
          }
        };
        
        p.mousePressed = function() {
          // Reset
          x = p.random(0.1, 0.9);
          r = p.map(p.mouseX, 0, p.width, 2, 4);
          points = [];
          p.loop();
        };
      }}
    </P5WebEditorSketch>
  );
}