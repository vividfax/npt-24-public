class WobblyCircle {

    constructor(w, h, wobble, x, y, colour) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.radius = (w+h)/2;
        this.colour = colour;

        this.offset = (this.radius+1)/20*wobble;

        this.offsets = [];
        this.offsetDirections = [];

        for (let i = 0; i < 12; i++) {

            let seeded = fixedRandom(settings.blobSeed+""+i);
            this.offsets[i] = map(seeded, 0, 1, -this.offset, this.offset);
            this.offsetDirections[i] = random([-1, 1]);
        }
    }

    update() {

        for (let i = 0; i < 12; i++) {

            let currentOffset = this.offsets[i];

            if (currentOffset > this.offset || currentOffset < -this.offset) this.offsetDirections[i] *= -1;

            this.offsets[i] += this.offsetDirections[i]*random(0.05*this.radius/50);
        }
    }

    overlap(otherCircle) {

        let distance = dist(this.x, this.y, otherCircle.x, otherCircle.y);
        let radii = this.radius + otherCircle.radius + 3;

        if (distance < radii) return true;
    }

    hitsEdge() {

        let borderWidth = 27;

        if (this.x + this.radius >= width-borderWidth) return true;
        else if (this.x - this.radius <= borderWidth) return true;
        else if (this.y + this.radius >= height-borderWidth) return true;
        else if (this.y - this.radius <= borderWidth) return true;
    }

    grow() {

        this.radius++;
    }

    display() {

        let radius = this.radius;

        if (radius <= 0) return;

        push();
        translate(this.x, this.y);
        angleMode(DEGREES);
        noStroke();
        fill(this.colour);

        beginShape();

        for (let i = 0; i < 2; i++) {

            curveVertex(0, -this.h+this.offsets[0]);
            curveVertex(this.w*.7+this.offsets[1], -this.h*.7+this.offsets[2]);
            curveVertex(this.w+this.offsets[3], 0);
            curveVertex(this.w*.7+this.offsets[4], this.h*.7+this.offsets[5]);
            curveVertex(0, this.h+this.offsets[6]);
            curveVertex(-this.w*.7+this.offsets[7], this.h*.7+this.offsets[8]);
            curveVertex(-this.w+this.offsets[9], 0);
            curveVertex(-this.w*.7+this.offsets[10], -this.h*.7+this.offsets[11]);
        }

        endShape(CLOSE);

        pop();
    }
}