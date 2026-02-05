import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";

export default function DoublePendulumSketch({ width = 450, height = 300 }) {
  return (
    <P5WebEditorSketch width={width} height={height}>
      {(p) => {
        class DoublePendulum {
            constructor({m1=15, m2=10, r1=75, r2=75, a1=PI/2, a2=PI/2, v1=0, v2=0, g=0.5, dampening=0.999, c=color(10,10,70)}={}) {
                this.m1 = m1  // mass of bob 1
                this.m2 = m2  // mass of bob 2
                this.r1 = r1  // length of arm 1
                this.r2 = r2  // length of arm 2
                this.a1 = a1  // angle of arm 1
                this.a2 = a2  // angle of arm 2
                this.v1 = v1  // angular velocity of arm 1
                this.v2 = v2  // angular velocity of arm 2
                this.acc1 = 0 // angular acceleration of arm 1
                this.acc2 = 0 // angular acceleration of arm 2
                this.g = g    // gravitational constant (real ~= 9.8/60/60 in 60fps)
                this.dampening = dampening // angular velocity dampening factor
                this.calculatePositions()  // calculate initial bob positions
                // this.c = color(redc, greenc, bluec);
                this.c = c;
                this.path = [];
            }
            
            addToPath(v) {
                this.path.unshift(v);
                if (this.path.length > 50) {
                this.path.pop();
                }
            }
            
            draw() {
                p.push()
                p.strokeWeight(0.8);
                p.line(0, 0, this.x1, this.y1)
                p.line(this.x1, this.y1, this.x2, this.y2)
                
                p.noStroke()
                p.fill(0, 10, 30, 100);
                p.circle(this.x1, this.y1, this.m1/2)
                p.circle(this.x2, this.y2, this.m2/2)
                p.pop()
            }
            
            drawTriangle() {
                p.triangle(0, 0, this.x1, this.y1, this.x2, this.y2)
            }
            
            next() {
                this.calculateAccelerations()
                this.calculateVelocities()
                this.calculatePositions()
            }
            
            nextPosition() {
                this.calculatePositions()
            }
            
            calculatePositions() {
                this.x3 = this.x2
                this.y3 = this.y2
                this.a1 += this.v1
                this.a2 += this.v2
                this.x1 = this.r1 * p.sin(this.a1)
                this.y1 = this.r1 * p.cos(this.a1)    
                this.x2 = this.x1 + this.r2 * p.sin(this.a2)
                this.y2 = this.y1 + this.r2 * p.cos(this.a2)
            }
            
            calculateVelocities() {
                this.v1 += this.acc1
                this.v2 += this.acc2
                this.v1 *= this.dampening
                this.v2 *= this.dampening
            }
            
            calculateAccelerations() {
                let {m1, m2, r1, r2, a1, a2, v1, v2, g} = this
                let denominator = r1 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)) 
                this.acc1 = (
                    -g * (2 * m1 + m2) * p.sin(a1) +
                    -m2 * g * p.sin(a1 - 2 * a2) +
                    -2 * p.sin(a1 - a2) * m2 *
                    (v2 * v2 * r2 + v1 * v1 * r1 * p.cos(a1 - a2))
                ) / denominator
                this.acc2 = (
                    2 * p.sin(a1 - a2) * (
                        v1 * v1 * r1 * (m1 + m2) +
                        g * (m1 + m2) * p.cos(a1) +
                        v2 * v2 * r2 * m2 * p.cos(a1 - a2)
                    )
                ) / denominator
            }
        }

        let cx, cy;
        let pathCanvas;
        let doublePendulum;
        let doublePendulum2;
        let numPendulums = 10;
        let dp;
        let colorSpectrum = [];
        let shift = 0.0001;
        let pendulums = [];
        let vec;
        let newc;
        let placed = false;
        let counter = 0;
        let slider;
        let angle;
        let textbox;


        p.setup = function() {
            p.createCanvas(450, 300)
            p.textFont("system-ui");
            p.frameRate(200)
            pathCanvas = p.createGraphics(p.width, p.height)
            pathCanvas = p.createGraphics(p.width, p.height)
            angle = (1.4 * p.PI / 2);
            pathCanvas.colorMode(p.HSL, numPendulums);

            cx = p.width / 2
            cy = p.height / 2.2
            
            pathCanvas.textFont('system-ui');
            
            slider = p.createSlider(1, 50, 10, 1);
            slider.position(cx-130, 150);
            slider.style('width', '200px');
            slider.changed(p.changeNumPendulums);
            
            pathCanvas.background(0, 0, 7*numPendulums/8);
            pathCanvas.push();
            pathCanvas.textSize(20);
            pathCanvas.fill(0);
            pathCanvas.noStroke();
            pathCanvas.text('Number of Pendulums: ' + slider.value(), cx-160, 40);
            pathCanvas.pop();
            pathCanvas.translate(cx, cy)
            

            for (let i = 0; i < numPendulums; i++) {
                newc = pathCanvas.color(i, numPendulums, 2 * numPendulums / 3);
                dp = new DoublePendulum({
                    m1: 10,
                    m2: 10,
                    r1: 80,
                    r2: 80,
                    a1: angle + (i * shift),
                    a2: angle,
                    v1: 0,
                    v2: 0,
                    g: 0.5,
                    dampening: 0.999,
                    c: newc
                });
                pendulums.push(dp);
            }
        }

        p.mousePressed = function() {
            placed = true;
        }

        p.changeNumPendulums = function() {
            numPendulums = slider.value();
            pendulums = [];
            pathCanvas.colorMode(p.HSL, numPendulums);
            for (let i = 0; i < numPendulums; i++) {
                newc = pathCanvas.color(i, numPendulums, 2 * numPendulums / 3);
                dp = new DoublePendulum({
                m1: 10,
                m2: 10,
                r1: 135,
                r2: 135,
                a1: angle + (i * shift),
                a2: angle,
                v1: 0,
                v2: 0,
                g: 0.5,
                dampening: 0.999,
                c: newc
                });
                pendulums.push(dp);
            }
            placed = false;
            pathCanvas.background(0, 0, 7*numPendulums/8);
            pathCanvas.push();
            pathCanvas.translate(-cx, -cy);
            pathCanvas.textSize(20);
            pathCanvas.fill(0);
            pathCanvas.noStroke();
            pathCanvas.text('Number of Pendulums: ' + slider.value(), cx-160, 40);
            pathCanvas.pop();
        }

        p.draw = function() {
            p.clear();
            p.imageMode(p.CORNER);
            p.image(pathCanvas, 0, 0, p.width, p.height);
            counter += 1;

            p.translate(cx, cy);
            

            if (placed === false) {
                for (let i = 0; i < numPendulums; i++) {
                dp = pendulums[i];
                dp.a1 = p.atan2(cy - p.mouseY, p.mouseX - cx) + (i * shift) + p.PI/2;
                dp.a2 = p.atan2(cy - p.mouseY, p.mouseX - cx) + (i * shift) + p.PI/2;
                dp.nextPosition();
                dp.draw();
                }
            } else {
                for (let i = 0; i < numPendulums; i++) {
                        dp = pendulums[i];
                        dp.next();
                        dp.draw();
                }

                pathCanvas.background(0, 0, 7*numPendulums/8);
                
                pathCanvas.push();
                pathCanvas.textSize(20);
                pathCanvas.fill(0);
                pathCanvas.noStroke();
                pathCanvas.translate(-cx, -cy);
                pathCanvas.text('Number of Pendulums: ' + slider.value(), cx-160, 40);
                pathCanvas.pop();
                
                pathCanvas.noFill();
                pathCanvas.strokeWeight(2);

                for (let i = 0; i < numPendulums; i++) {
                    dp = pendulums[i];
                    vec = p.createVector(dp.x3, dp.y3);
                    dp.addToPath(vec);
                    pathCanvas.stroke(dp.c);
                    pathCanvas.beginShape();
                    for (let j = 0; j < dp.path.length; j++) {
                        pathCanvas.vertex(dp.path[j].x, dp.path[j].y);
                    }
                    pathCanvas.endShape();
                }
            }
        }
      }}

    </P5WebEditorSketch>
  );
}