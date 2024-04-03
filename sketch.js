let tiles = [];
let symbols, newSymbols, ogSymbols, hybridSymbols;
let fonts = {};
let logotype;
let arrow, smoothArrow;
let defaultSettings;
let settings, buttonRanges;

let flocks = [];
let flockSize = 300;
let flockTop = -1;
let flockBottom = -1;
let flockLeft = -1;
let flockRight = -1;

let wobblyCircle;
let radialPoints = [];

let palette;

let logoLayer;

let colourPickers = [];

let toolbarVisible = true;
let keebButtonsVisible = true;
let blobSeed = -1;

let lastKeebInput = 0;

let numToChange = -1;
let displayLoadingFrame = false;
let updateOnNextFrame = false;
let updating = false;

function preload() {

    for (let i = 0; i < 3; i++) tiles.push(loadImage("./images/tile"+i+".png"));

    newSymbols = loadJSON("./json/symbols.json");
    ogSymbols = loadJSON("./json/og-symbols.json");
    hybridSymbols = loadJSON("./json/hybrid-symbols.json");
    defaultSettings = loadJSON("./json/settings.json");
    settings = loadJSON("./json/settings.json");
    buttonRanges = loadJSON("./json/button-ranges.json");

    logotype = loadImage("./images/logotype.svg");
    arrow = loadImage("./images/arrow.png");
    smoothArrow = loadImage("./images/smooth-arrow.png");

    fonts.jost = loadFont("./fonts/Jost-Regular.ttf");
}

function setup() {

    // clearStorage();

    newSymbols = newSymbols.symbols;
    for (let i = 0; i < newSymbols.length; i++) {
        for (let j = 0; j < newSymbols[i].colours.length; j++) {
            newSymbols[i].colours[j] = color(newSymbols[i].colours[j]);
        }
    }

    ogSymbols = ogSymbols.symbols;
    for (let i = 0; i < ogSymbols.length; i++) {
        for (let j = 0; j < ogSymbols[i].colours.length; j++) {
            ogSymbols[i].colours[j] = color(ogSymbols[i].colours[j]);
        }
    }

    hybridSymbols = hybridSymbols.symbols;
    for (let i = 0; i < hybridSymbols.length; i++) {
        for (let j = 0; j < hybridSymbols[i].colours.length; j++) {
            hybridSymbols[i].colours[j] = color(hybridSymbols[i].colours[j]);
        }
    }

    symbols = hybridSymbols;

    // if (getItem("settings") != null) settings = getItem("settings");
    fillMissingSettings();

    // let minHeight = windowHeight > 1200 ? windowHeight : 1200;
    // createCanvas(windowWidth, minHeight);

    // createCanvas(settings.canvasWidth, settings.canvasHeight);
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);
    noSmooth();

    pixelateLogo();

    setupInput();
    setupKeyButtons();

    setupButtonStartValues();

    newWobblyCircle();

    display();
}

function draw() {

    // updateSettings();

    // if (frameCount-lastKeebInput < 200) select("#button-holder").style("display", "none");
    // else select("#button-holder").style("display", "block");

    if (displayLoadingFrame) {
        displayLoading();
        updateOnNextFrame = true;
        displayLoadingFrame = false;
    } else if (updateOnNextFrame) {
        change(numToChange);
        update();
        updating = true;
        updateOnNextFrame = false;
    } else if (updating) {
        updating = false;
    }
}

function update() {

    // resizeCanvas(settings.canvasWidth, settings.canvasHeight);

    // if (settings.symbolSet == "hybrid") symbols = hybridSymbols;
    // else if (settings.symbolSet == "og") symbols = ogSymbols;
    // else if (settings.symbolSet == "new") symbols = newSymbols;

    // pixelateLogo();

    newWobblyCircle();

    display();
}

function display() {

    clear();

    let bgColour = color(settings.bgColour);
    bgColour.setAlpha(255*settings.bgAlpha);

    background(bgColour);

    if (!settings.shadowBelow) {
        for (let i = 0; i < flocks.length; i++) {
            for (let j = 0; j < flocks[i].length; j++) {
                flocks[i][j].display();
            }
        }
    }

    if (!settings.hideLogo && settings.logotypeSize > 0 && settings.logotypeSize <= 250) {
        tint(settings.logotypeShadowColour);
        image(logoLayer, even(width/2+int(settings.logotypeShadowOffset.x*2)), even(height/2+int(settings.logotypeShadowOffset.y*2)), settings.logotypeSize*4, settings.logotypeSize*4);
        tint(255);
    }

    if (settings.shadowBelow) {
        for (let i = 0; i < flocks.length; i++) {
            for (let j = 0; j < flocks[i].length; j++) {
                flocks[i][j].display();
            }
        }
    }

    if (!settings.hideLogo && settings.logotypeSize > 0 && settings.logotypeSize <= 250) {
        tint(settings.logotypeColour);
        image(logoLayer, even(width/2), even(height/2), settings.logotypeSize*4, settings.logotypeSize*4);
    }
}

function displayLoading() {

    push();
    if (settings.uiMode == "light") fill("#333");
    else if (settings.uiMode == "dark") fill("#fff");
    textSize(60);
    textAlign(CENTER, TOP);
    textFont(fonts.jost);
    text("Thinking...", width/2, 20);
    pop();
}

function fillMissingSettings() {

    for (let s in defaultSettings) {
        if (!(s in settings)) settings[s] = defaultSettings[s];
    }
}

function newWobblyCircle() {

    flocks = [];

    let w = constrain(int(settings.blobWidth), 0, 500);
    let h = constrain(int(settings.blobHeight), 0, 500);
    let sharpness = constrain(settings.blobSharpness, 0, 50);

    for (let i = 1; i < 2; i++) {
        wobblyCircle = new WobblyCircle(w, h, sharpness, width/2, height/2, color(0, 0, 0, 100));
        clear();
        wobblyCircle.display();
        // push();
        // translate(width/2, height/2)
        // // scale(-1, 1);
        // image(smoothArrow, 0, 0);
        // pop();
        flocks.push(createFlock());
    }

    for (let i = 0; i < flocks.length; i++) {
        for (let j = 0; j < flocks[i].length; j++) {
            flocks[i][j].getColour();
        }
    }

    display();
}

function pixelateLogo() {

    if (settings.logotypeSize <= 0 || settings.logotypeSize > 250) return;

    logoLayer = createGraphics(settings.logotypeSize*2, settings.logotypeSize*2);
    logoLayer.image(logotype, 0, 0, settings.logotypeSize*2, settings.logotypeSize*2);

    logoLayer.loadPixels();

    for (let i = 0; i < logoLayer.width; i++) {
        for (let j = 0; j < logoLayer.height; j++) {
            let colour = logoLayer.get(i, j);
            if (colour[3] < 255) colour[3] = 0;
            logoLayer.set(i, j, colour);
        }
    }

    logoLayer.updatePixels();
}

function createFlock() {

    flockTop = -1;
    flockBottom = -1;
    flockLeft = -1;
    flockRight = -1;

    let flock = [];
    // let radialPoints = [];

    // if (settings.useRadialPoints) {
    //     for (let i = 0; i < int(constrain(settings.radialPointCount, 0, 50)); i++) radialPoints.push(new RadialPoint(radialPoints));
    // }

    let spacing = constrain(int(settings.flockOverallDensity), 5, 10000);

    for (let i = 0; i < width; i+=spacing) {

        let edgeStrength = 0;

        for (let j = 0; j < height; j+=spacing) {

            if (get(i, j)[3] != 0) {

                let strength = edgeStrength;

                for (let k = 0; k < radialPoints.length; k++) {

                    if (!radialPoints[k].valid) continue;

                    let distance = dist(radialPoints[k].x, radialPoints[k].y, i, j);
                    if (distance < radialPoints[k].size) {
                        distance = map(distance, 0, radialPoints[k].size, 1, 0);
                        if (radialPoints[k].inverted) {
                            strength += distance;
                        } else {
                            strength -= distance;
                        }
                    }
                }

                strength = constrain(strength, 0, 1);

                flock.push(new Bird(i, j, flock, strength));

                if (edgeStrength < 1) edgeStrength += float(constrain(settings.linearGradient, 0, 1));
                // if (edgeStrength < 1) edgeStrength += 0.05;
                if (flockTop == -1 || flockTop < j) flockTop = j;
                if (flockBottom == -1 || flockBottom > j) flockBottom = j;
                if (flockLeft == -1 || flockLeft > i) flockLeft = i;
                if (flockRight == -1 || flockRight < i) flockRight = i;
            }
        }
    }

    let flockPadX = (width-flockRight+flockLeft)/2;
    let shiftX = even(flockPadX-flockLeft);

    let flockPadY = (height-flockBottom+flockTop)/2;
    let shiftY = even(flockPadY-flockTop);

    for (let i = 0; i < flock.length; i++) {
        flock[i].x += shiftX;
        flock[i].y += shiftY;
    }

    return flock;
}

function fixedRandom(input) {

    var seeded = new Math.seedrandom(input);
    return seeded();
}