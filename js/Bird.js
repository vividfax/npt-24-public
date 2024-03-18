class Bird {

    constructor(x, y, flock, edgeStrength) {

        let offset = map(edgeStrength, 0, 1, 1, random(settings.flockEdgeBlur));
        this.x = x + random(-offset, offset);
        this.y = y + random(-offset, offset);
        this.x = this.x;
        this.y = this.y;
        this.edgeStrength = edgeStrength;
        this.tileNum = int(random(tiles.length));

        for (let i = 0; i < flock.length; i++) {

            if (flock[i].dead) continue;
            let distance = dist(this.x, this.y, flock[i].x, flock[i].y);
            if (distance < int(settings.flockSparserDensity)*edgeStrength) {
                this.dead = true;
                break;
            }
        }
    }

    getColour() {

        let amount = map(this.edgeStrength, 0, 1, 0.2, 0.8);
        if (!settings.tieColourToDensity) {
            amount = 1-(this.y-flockTop)/(flockBottom-flockTop);
        }
        let offset = float(settings.colourBlending);
        amount += random(-offset, offset);
        amount = constrain(amount, 0, 1);
        // this.colour = lerpColor(palette.dark, palette.light, amount);

        let num = int((symbols.length)*amount);
        if (!settings.tieSymbolsToColour) num = int(random(symbols.length));
        if (num >= symbols.length) num = symbols.length-1;
        this.symbol = symbols[num];
        this.colours = this.symbol.colours;
        this.symbol = this.symbol.shape;

        if (!settings.useGradient) {

            this.colour = lerpColor(this.colours[0], this.colours[1], random());

        } else {

            let colours = settings.symbolColours;
            if (settings.flipGradient) colours = colours.toReversed();
            let num;
            let lower;
            let upper;

            for (let i = 0; i < colours.length; i++) {
                if ((1/(colours.length-1))*i >= amount) {
                    num = i-1;
                    lower = (1/(colours.length-1))*(i-1);
                    upper = (1/(colours.length-1))*i;
                    break;
                }
            }

            if (num < 0) num = 0;
            let lerpAmount = map(amount, lower, upper, 0, 1);
            this.colour = lerpColor(color(colours[num]), color(colours[num+1]), lerpAmount);
        }
    }

    update() {

    }

    display() {

        if (this.dead) return;

        // fill(0);
        // ellipse(this.x, this.y, 3);

        // tint(this.colour);
        // image(tiles[this.tileNum], this.x, this.y, 8, 8);

        let s = 2;

        push();
        translate(even(this.x), even(this.y));
        translate(-even(this.symbol[0].length/2), -even(this.symbol.length/2));
        noStroke();
        fill(this.colour);
        // fill(0);

        for (let i = 0; i < this.symbol.length; i++) {
            for (let j = 0; j < this.symbol[i].length; j++) {
                if (this.symbol[i][j]) rect(even(j*s), even(i*s), 1*s, 1*s);
            }
        }
        pop();
    }
}

function even(num) {

    num /= 2;
    return round(num)*2;
}