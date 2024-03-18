class RadialPoint {

    constructor(otherPoints) {

        this.otherPoints = otherPoints;
        this.size = random(int(settings.radialSizeMin), int(settings.radialSizeMax));
        this.x = random(width);
        this.y = random(height);

        this.valid = true;
        this.tries = 0;

        while (!this.testIfValid()) {
            this.tries++;
            this.x = random(width);
            this.y = random(height);
        }

        if (this.y > height/2) {
            this.inverted = false;
        } else {
            this.inverted = true;
        }
    }

    testIfValid() {

        if (this.tries > 40) {
            this.valid = false;
            return true;
        }

        if (get(this.x, this.y)[3] == 0) return false;

        for (let i = 0; i < this.otherPoints.length; i++) {
            let distance = dist(this.x, this.y, this.otherPoints[i].x, this.otherPoints[i].y);
            if (distance < 100) return false;
        }

        return true;
    }
}