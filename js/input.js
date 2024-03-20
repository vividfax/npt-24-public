function setupInput() {

    return;

    setupCollapsibles();
    setupColourPickers();

    select("#add-colour").mousePressed(addColourPicker);
    select("#minus-colour").mousePressed(minusColourPicker);
    select("#export-settings").mousePressed(exportSettings);
    select("#reset-settings").mousePressed(resetSettings);
    select("#load-settings").mousePressed(loadSettings);
    select("#save-settings").mousePressed(saveSettings);
    select("#random-seed").mousePressed(randomiseBlobSeed);
    select("#make-blob").mousePressed(newWobblyCircle);
    select("#update").mousePressed(update);
    select("#symbol-set").value(settings.symbolSet);
    select("#symbol-density").checked(settings.tieSymbolsToColour);
    select("#colour-density").checked(settings.tieColourToDensity);
    select("#use-gradient").checked(settings.useGradient);
    select("#flip-gradient").checked(settings.flipGradient);
    select("#colour-blending").value(settings.colourBlending);
    select("#bg-alpha").value(settings.bgAlpha);
    select("#canvas-width").value(settings.canvasWidth);
    select("#canvas-height").value(settings.canvasHeight);
    select("#hide-logo").checked(settings.hideLogo);
    select("#shadow-below").checked(settings.shadowBelow);
    select("#logotype-size").value(settings.logotypeSize);
    select("#shadow-x").value(settings.logotypeShadowOffset.x);
    select("#shadow-y").value(settings.logotypeShadowOffset.y);
    select("#blob-width").value(settings.blobWidth);
    select("#blob-height").value(settings.blobHeight);
    select("#blob-sharpness").value(settings.blobSharpness);
    select("#blob-seed").value(settings.blobSeed);
    select("#edge-blur").value(settings.flockEdgeBlur);
    select("#overall-density").value(settings.flockOverallDensity);
    select("#sparser-density").value(settings.flockSparserDensity);
    select("#linear-gradient").value(settings.linearGradient);
    select("#enable-radial").checked(settings.useRadialPoints);
    select("#radial-point-count").value(settings.radialPointCount);
    select("#radial-size-min").value(settings.radialSizeMin);
    select("#radial-size-max").value(settings.radialSizeMax);
}

function setupCollapsibles() {

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "grid") {
                content.style.display = "none";
            } else {
                content.style.display = "grid";
            }
        });
    }
}

function setupColourPickers() {

    let defaults = settings.symbolColours;

    select("#colour-picker-holder").html("");
    colourPickers = [];

    for (let i = 0; i < defaults.length; i++) {

        let picker = createColorPicker(defaults[i]);
        picker.parent("colour-picker-holder");
        colourPickers.push(picker);
    }

    select("#bg-colour").value(settings.bgColour);
    select("#logotype-colour").value(settings.logotypeColour);
    select("#shadow-colour").value(settings.logotypeShadowColour);
}

function addColourPicker() {

    let picker = createColorPicker(color(random(255), random(255), random(255)));
    picker.parent("colour-picker-holder");
    colourPickers.push(picker);
}

function minusColourPicker() {

    if (colourPickers.length <= 1) return;

    let removed = colourPickers.pop();
    removed.remove();
}

function randomiseBlobSeed() {

    randomiseRadialPoints();

    let rand = int(random(99999));
    settings.blobSeed = rand;
    select("#blob-seed").value(settings.blobSeed);

    newWobblyCircle();
}

function updateSettings() {

    return;

    updateColours();

    settings.symbolSet = select("#symbol-set").value();
    settings.tieSymbolsToColour = select("#symbol-density").checked();
    settings.tieColourToDensity = select("#colour-density").checked();
    settings.useGradient = select("#use-gradient").checked();
    settings.flipGradient = select("#flip-gradient").checked();
    settings.colourBlending = select("#colour-blending").value();
    settings.bgAlpha = select("#bg-alpha").value();
    settings.canvasWidth = select("#canvas-width").value();
    settings.canvasHeight = select("#canvas-height").value();
    settings.hideLogo = select("#hide-logo").checked();
    settings.shadowBelow = select("#shadow-below").checked();
    settings.logotypeSize = select("#logotype-size").value();
    settings.logotypeShadowOffset.x = select("#shadow-x").value();
    settings.logotypeShadowOffset.y = select("#shadow-y").value();
    settings.blobWidth = select("#blob-width").value();
    settings.blobHeight = select("#blob-height").value();
    settings.blobSharpness = select("#blob-sharpness").value();
    settings.blobSeed = select("#blob-seed").value();
    settings.flockEdgeBlur = select("#edge-blur").value();
    settings.flockOverallDensity = select("#overall-density").value();
    settings.flockSparserDensity = select("#sparser-density").value();
    settings.linearGradient = select("#linear-gradient").value();
    settings.useRadialPoints = select("#enable-radial").checked();
    settings.radialPointCount = select("#radial-point-count").value();
    settings.radialSizeMin = select("#radial-size-min").value();
    settings.radialSizeMax = select("#radial-size-max").value();

    // if (settings.logotypeSize < 1) {
    //     settings.logotypeSize = 1;
    //     select("#logotype-size").value(1);
    // }
}

function updateColours() {

    colourRange = [];
    let str = "linear-gradient(to right";
    let jump = 100/(colourPickers.length-1);

    for (let i = 0; i < colourPickers.length; i++) {
        colourRange.push(colourPickers[i].value());
        str += ", "+colourPickers[i].value()+" "+i*jump+"%";
    }

    settings.symbolColours = colourRange;

    str += ")";

    select("#gradient").style("background", str);
    settings.bgColour = select("#bg-colour").value();
    settings.logotypeColour = select("#logotype-colour").value();
    settings.logotypeShadowColour = select("#shadow-colour").value();
}

function exportSettings() {

    saveJSON(settings, "settings.json");
}

function loadSettings() {

    if (getItem("settings") != null) settings = getItem("settings");
    refreshSettings();
}

function saveSettings() {

    storeItem("settings", settings);
}

function resetSettings() {

    settings = JSON.parse(JSON.stringify(defaultSettings));
    refreshSettings();
}

function refreshSettings() {

    setupColourPickers();
    select("#symbol-set").value(settings.symbolSet);
    select("#symbol-density").checked(settings.tieSymbolsToColour);
    select("#colour-density").checked(settings.tieColourToDensity);
    select("#use-gradient").checked(settings.useGradient);
    select("#flip-gradient").checked(settings.flipGradient);
    select("#colour-blending").value(settings.colourBlending);
    select("#bg-alpha").value(settings.bgAlpha);
    select("#canvas-width").value(settings.canvasWidth);
    select("#canvas-height").value(settings.canvasHeight);
    select("#hide-logo").checked(settings.hideLogo);
    select("#shadow-below").checked(settings.shadowBelow);
    select("#logotype-size").value(settings.logotypeSize);
    select("#shadow-x").value(settings.logotypeShadowOffset.x);
    select("#shadow-y").value(settings.logotypeShadowOffset.y);
    select("#blob-width").value(settings.blobWidth);
    select("#blob-height").value(settings.blobHeight);
    select("#blob-sharpness").value(settings.blobSharpness);
    select("#blob-seed").value(settings.blobSeed);
    select("#edge-blur").value(settings.flockEdgeBlur);
    select("#overall-density").value(settings.flockOverallDensity);
    select("#sparser-density").value(settings.flockSparserDensity);
    select("#linear-gradient").value(settings.linearGradient);
    select("#enable-radial").checked(settings.useRadialPoints);
    select("#radial-point-count").value(settings.radialPointCount);
    select("#radial-size-min").value(settings.radialSizeMin);
    select("#radial-size-max").value(settings.radialSizeMax);
    // newWobblyCircle();
    update();
}

function keyPressed() {

    pressKeyButton();

    return;

    if (keyCode == ENTER) {

        toolbarVisible = !toolbarVisible;

        if (toolbarVisible) select("#toolbar-container").style("display", "block");
        else select("#toolbar-container").style("display", "none");

    } else if (keyCode == 32) { // SPACEBAR

        if (!toolbarVisible) update();
    }
}

function pressKeyButton() {

    if (key === "q" || key === "Q") changeNumToChange(0);
    else if (key === "w" || key === "W") changeNumToChange(1);
    else if (key === "e" || key === "E") changeNumToChange(2);
    else if (key === "r" || key === "R") changeNumToChange(3);
    else if (key === "t" || key === "T") changeNumToChange(4);
    else if (key === "y" || key === "Y") changeNumToChange(5);
    else if (keyCode === ENTER) {
        if (keebButtonsVisible) select("#button-holder").style("display", "none");
        else select("#button-holder").style("display", "block");
        keebButtonsVisible = !keebButtonsVisible;
    }
    else return;
}

function setupKeyButtons() {

    select("#btn1").mousePressed(() => changeNumToChange(0));
    select("#btn2").mousePressed(() => changeNumToChange(1));
    select("#btn3").mousePressed(() => changeNumToChange(2));
    select("#btn4").mousePressed(() => changeNumToChange(3));
    select("#btn5").mousePressed(() => changeNumToChange(4));
    select("#btn6").mousePressed(() => changeNumToChange(5));
}

function setupButtonStartValues() {

    settings.symbolColours = buttonRanges[0].palettes[0].symbolColours;
    settings.bgColour = buttonRanges[0].palettes[0].bgColour;
    settings.logotypeColour = buttonRanges[0].palettes[0].logotypeColour;
    settings.logotypeShadowColour = buttonRanges[0].palettes[0].logotypeShadowColour;

    settings.blobSharpness = buttonRanges[2].start;
    settings.flockOverallDensity = buttonRanges[3].start;
    settings.flockEdgeBlur = buttonRanges[4].start;
    settings.radialPointCount = buttonRanges[5].start;

    randomiseBlobSeed();
}

function change(num) {

    if (num == 0) {
        buttonRanges[num].index++;
        if (buttonRanges[num].index >= buttonRanges[num].palettes.length) buttonRanges[num].index = 0;
        let index = buttonRanges[num].index;
        settings.symbolColours = buttonRanges[num].palettes[index].symbolColours;
        settings.bgColour = buttonRanges[num].palettes[index].bgColour;
        settings.logotypeColour = buttonRanges[num].palettes[index].logotypeColour;
        settings.logotypeShadowColour = buttonRanges[num].palettes[index].logotypeShadowColour;
    } else if (num == 1) {
        randomiseBlobSeed();
    } else if (num == 2) {
        settings.blobSharpness = int(settings.blobSharpness);
        settings.blobSharpness += buttonRanges[num].step;
        if (settings.blobSharpness > buttonRanges[num].upper) settings.blobSharpness = buttonRanges[num].lower;
    } else if (num == 3) {
        settings.flockOverallDensity = int(settings.flockOverallDensity);
        settings.flockOverallDensity += buttonRanges[num].step;
        if (settings.flockOverallDensity > buttonRanges[num].upper) settings.flockOverallDensity = buttonRanges[num].lower;
        settings.flockSparserDensity = settings.flockOverallDensity*2;
    } else if (num == 4) {
        settings.flockEdgeBlur = int(settings.flockEdgeBlur);
        settings.flockEdgeBlur += buttonRanges[num].step;
        if (settings.flockEdgeBlur > buttonRanges[num].upper) settings.flockEdgeBlur = buttonRanges[num].lower;
    } else if (num == 5) {
        settings.radialPointCount = int(settings.radialPointCount);
        settings.radialPointCount += buttonRanges[num].step;
        if (settings.radialPointCount > buttonRanges[num].upper) settings.radialPointCount = buttonRanges[num].lower;
        randomiseRadialPoints();
    } else {
        return;
    }

    // update();
}

function changeNumToChange(num) {

    if (displayLoadingFrame || updateOnNextFrame || updating) return;

    numToChange = num;
    displayLoadingFrame = true;
}

function randomiseRadialPoints() {

    radialPoints = [];

    if (settings.useRadialPoints) {
        for (let i = 0; i < int(constrain(settings.radialPointCount, 0, 50)); i++) radialPoints.push(new RadialPoint(radialPoints));
    }
}