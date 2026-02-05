import P5WebEditorSketch from "../../components/lesson/P5WebEditorSketch";

export default function ExponentialRabbitSketch({ width = 500, height = 450 }) {
  return (
    <P5WebEditorSketch width={width} height={height}>
      {(p) => {
        let rabbits = [];
        let generation = 0;
        let nextButton;

        // Island blob settings (oval)
        let islandCX, islandCY;
        let islandRX, islandRY; // radii

        p.setup = function() {
            p.createCanvas(500, 450);
            p.textFont("system-ui");

            islandCX = p.width / 2;
            islandCY = p.height / 2 + 10;
            islandRX = p.width * 0.42;
            islandRY = p.height * 0.32;

            rabbits.push(new Rabbit());
            rabbits.push(new Rabbit());

            nextButton = p.createButton("Next Generation");
            nextButton.mousePressed(nextGeneration);
            styleButton();
            positionButton();
        }

        p.windowResized = function() {
            positionButton();
        }

        function positionButton() {
        // Center button at bottom
            nextButton.position(p.width / 2 - 85, p.height - 40);
        }

        function styleButton() {
            nextButton.style("background-color", "#ffffff");
            nextButton.style("color", "#0f1218");
            nextButton.style("border", "none");
            nextButton.style("padding", "12px 20px");
            nextButton.style("border-radius", "999px");
            nextButton.style("font-size", "18px");
            nextButton.style("font-family", "Segoe UI");
            nextButton.style("cursor", "pointer");
            nextButton.style("transition", "transform 0.08s ease, background-color 0.2s ease");

            nextButton.mouseOver(() => nextButton.style("background-color", "#e9eefc"));
            nextButton.mouseOut(() => {
                nextButton.style("background-color", "#ffffff");
                nextButton.style("transform", "scale(1)");
        });

        // Use native DOM events for press, without overriding p5 mousePressed(nextGeneration)
        nextButton.elt.addEventListener("mousedown", () => {
            nextButton.style("transform", "scale(0.98)");
        });
        nextButton.elt.addEventListener("mouseup", () => {
            nextButton.style("transform", "scale(1)");
        });
        nextButton.elt.addEventListener("mouseleave", () => {
            nextButton.style("transform", "scale(1)");
        });
        }

        function disableButton() {
            nextButton.attribute("disabled", "");
            nextButton.style("background-color", "#555");
            nextButton.style("color", "#999");
            nextButton.style("cursor", "not-allowed");
            nextButton.style("transform", "scale(1)");
        }

        p.draw = function() {
            p.background("#0f1218");

            drawTopInfo();

            for (let r of rabbits) {
                r.applySeparation(rabbits);
                r.moveAndConstrain();  // keep inside rounded blob
                r.display();
            }
        }

        class Rabbit {
            constructor() {
                // spawn inside island
                this.pos = randomPointInIsland();
                let angle = p.random(p.TWO_PI);
                this.vel = p.createVector(p.cos(angle), p.sin(angle)).mult(0.3);
            }

            applySeparation(others) {
                let force = p.createVector(0, 0);
                let personalSpace = 18;

                for (let other of others) {
                    if (other === this) continue;
                    let d = this.pos.dist(other.pos);
                    if (d < personalSpace && d > 0) {
                        let repel = this.pos.copy().sub(other.pos);
                        repel.normalize();
                        repel.div(d); // stronger when closer
                        force.add(repel);
                    }
                }

                force.limit(0.22);
                this.vel.add(force);
            }

            moveAndConstrain() {
                this.pos.add(this.vel);
                this.vel.mult(0.94); // friction = smooth

                // If outside island oval, pull back in
                if (!insideIsland(this.pos.x, this.pos.y)) {
                // Project back toward center until inside (simple + stable)
                let dir = p.createVector(islandCX, islandCY).sub(this.pos);
                dir.setMag(0.01);
                for (let i = 0; i < 30; i++) {
                    this.pos.add(dir);
                    if (insideIsland(this.pos.x, this.pos.y)) break;
                }
                // damp velocity on boundary hits
                this.vel.mult(0.6);
                }
            }

            display() {
                p.fill(255);
                p.noStroke();

                // body
                p.ellipse(this.pos.x, this.pos.y, 10, 10);
                // ears
                p.ellipse(this.pos.x - 3, this.pos.y - 7, 4, 8);
                p.ellipse(this.pos.x + 3, this.pos.y - 7, 4, 8);
            }
        }

        function nextGeneration() {
            if (generation >= 8) return; // safety check

            let newRabbits = [];
            for (let r of rabbits) newRabbits.push(new Rabbit());
            rabbits = rabbits.concat(newRabbits);

            generation++;

            if (generation >= 8) {
                disableButton();
            }
        }


        function drawTopInfo() {
            p.fill(255);
            p.noStroke();
            p.textSize(22);
            p.textAlign(p.CENTER, p.CENTER);

            let infoText = `Month: ${generation}        Population: ${rabbits.length}`;
            p.text(infoText, p.width / 2, 28);
        }

        function insideIsland(x, y) {
            // ellipse equation: ((x-cx)/rx)^2 + ((y-cy)/ry)^2 <= 1
            let dx = (x - islandCX) / islandRX;
            let dy = (y - islandCY) / islandRY;
            let noise = p.random(0,1);
            return dx * dx + dy * dy + noise <= 1;
        }

        function randomPointInIsland() {
            // rejection sample inside ellipse
            while (true) {
                let x = p.random(islandCX - islandRX, islandCX + islandRX);
                let y = p.random(islandCY - islandRY, islandCY + islandRY);
                if (insideIsland(x, y)) return p.createVector(x, y);
            }
        }
      }}
    </P5WebEditorSketch>
  );
}