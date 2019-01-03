const BIOME_BOTTOM_RANGE = 135;
const BIOME_TOP_RANGE = 525;

const X_BOUND_SAFETY_OFFSET_BIG = 200;
const X_BOUND_SAFETY_OFFSET_SMALL = 80;

class BiomeGenerator {
    constructor (renderer) {
        this.BIOME_TYPES = [
            "DESERT", "WINTER", "FOREST"
        ];

        this.renderer = renderer;
        this.renderWidth = renderer.width;;
        this.renderHeight = renderer.height;

        
        this.k = 1;
        this.pixelsPerScreen = 1200;
    }

    /**
     * Constructs biom object with its sprite container and children.
     * @param {*} type String type defined in this.BIOM_TYPES to be spawned.
     * @param {*} screenLength Integer multiplier of the screen length saying
     * how long newly generated biom should be.
     */
    constructBiome(type, screenLength) {
        switch(type) {
            case "DESERT":
                return this.constructDesertBiom(screenLength);
            break;
            case "WINTER":
            break;
            case "FOREST":
            break;
            default:
                // TODO: Return biome considered default (probably forest/meadow)
            break;
        }
    }

    constructDesertBiom(length) {

        // Keep the scaling coefficient to later scale children back down. 
        this.k = length;

        let desertBiomBackgroundColors = [0xffd54f, 0xffff81];

        let biome = new PIXI.Graphics();
        biome.beginFill(Utils.randomElement(desertBiomBackgroundColors));
        biome.lineStyle(0);
        biome.drawRect(0, 0, this.renderWidth, this.renderHeight);
        log("DRAWING BIOM, width:" + this.renderWidth + ", height:" + this.renderHeight);
        biome.endFill();
        
        let biomeSprite = Utils.createSpriteFromGraphics(this.renderer, biome);
        biomeSprite.scale.set(length, 1.0);
        let bounds = biomeSprite.getBounds();
        log("SCALED BIOM, width:" + bounds.width + ", height:" + bounds.height);
        biomeSprite.position.set(this.renderWidth, BIOME_BOTTOM_RANGE);

        // Populate the sprite with objects
        this.populateBiom(biomeSprite);


        return new Biome(length, biomeSprite);
    }

    // Normalize x coordinate for s scale. 
    n(x, s) { // DO-NOT-USE
        return (x/s);
    }

    populateBiom(sprite) {

        let xCord = 600;
        let yCord = 350;

        if (this.k !== 1) {
            this.addHugePyramidToFirstWindow(this.k, sprite);
            this.addUltraHugePyramidToLastBiomeWindow(this.k, sprite);
        }

        log("Bounds before adding pyramid")
        log(sprite.getBounds())

        // TODO: Generate far background (tiny items + few small pyramids)

        // TODO: Generate general background (pyramids mainly)

        // Should come always last to cover what is rendered behind it (perspective).
        this.addForegroundItems(this.k, sprite);
    }

    addForegroundItems(bSize, sprite) {
        // Height range should be between BIOME_TOP_RANGE and BIOME_TOP_RANGE - 170
        let FGLowerBound = BIOME_TOP_RANGE - 170;
        let FGUpperBound = BIOME_TOP_RANGE - 70;


        let foregroundItems = ["sandblock_01", "sandwall_01", "sandwall_02", "sandblock_01", "sandblock_01", "sandblock_01"];
        let foregroundItemsHuge = ["sandblock_01"];
        let foregroundItemsMedium = ["sandblock_01", "sandwall_01", "sandblock_01", "sandblock_01"];
        let hugeItemLenghts = { "sandblock_01": 171, "sandwall_01":377, "sandwall_02": 326};
        let mediumItemLengths = {"sandblock_01": 120, "sandwall_01":232, "sandwall_02": 230};
        let smallItemLengths = {"sandblock_01": 50, "sandwall_01":172, "sandwall_02": 132};
        let tinyItemLenghts = {"sandblock_01": 15, "sandwall_01":57, "sandwall_02": 60};
        
        let screensToSeed = this.k;
        for (let i = 1; i <= screensToSeed; i++) {
            // Use 'i' as a 'k' for all screen-number relevant functions.

            // Pre-generate items to be placed on i-th screen (1 huge, 1 medium, 5 small)
            let rndHuge = Utils.randomElement(foregroundItemsHuge);
            let rndMedium = Utils.randomElement(foregroundItemsMedium);
            let rndSmall = [];
            for (let i = 0; i < 5; i++) {
                rndSmall.push(Utils.randomElement(foregroundItems));
            }

            // Keep track of parts of the screen where item has been already placed.
            let placedIntervals = [];

            // Place the first huge item randomly and remember where it is placed.
            let hugeX = Utils.randomIntNumberFromRange(this.getLowerXBoundForBig(i), this.getUpperXBoundForBig(i));
            this.placeObjectTo(rndHuge + "_huge",
                hugeX,
                Utils.randomIntNumberFromRange(FGLowerBound, FGLowerBound + 35),
                sprite, bSize);
            placedIntervals.push(new Interval(hugeX, hugeX + hugeItemLenghts[rndHuge]));

            // Start placing other items to the screen if there is enough space.
            let placedMedium = 0;
            let placedSmall = 0;
            let watchDog = 250;
            while (placedIntervals.length !== 7) {
            
                // If sprite placement is not possible, skip placement.
                watchDog -= 1;
                if (watchDog <= 0) 
                {
                    break;
                }
    
                // Try placing medium-sized item.
                if (placedMedium !== 1) {
                    let mediumX = Utils.randomIntNumberFromRange(this.getLowerXBoundForBig(i), this.getUpperXBoundForBig(i));
                    let canPlace = true;
                    for (let i = 0; i < placedIntervals.length; i++) {
                        if (placedIntervals[i].covers(mediumX, mediumX + mediumItemLengths[rndMedium[0]])) {
                            canPlace = false;
                            break;
                        }
                    }
    
                    if (canPlace) { // No collision detected.
                        this.placeObjectTo(rndMedium[0] + "_medium", mediumX, Utils.randomIntNumberFromRange(FGLowerBound + 35, FGUpperBound), sprite, bSize);                            
                        placedIntervals.push(new Interval(mediumX, mediumX + mediumItemLengths[rndMedium[0]]));
                        rndMedium.shift();
                        placedMedium++;
                    }
                }
    
                // Also try placing small item.
                if (placedSmall !== 5) {
                    // Try place small
                    let smallX = Utils.randomIntNumberFromRange(this.getLowerXBoundForSmall(i), this.getUpperXBoundForSmall(i));
                    let canPlace = true;
                    for (let i = 0; i < placedIntervals.length; i++) {
                        if (placedIntervals[i].covers(smallX, smallX + smallItemLengths[rndSmall[0]])) {
                            canPlace = false;
                        }
                    }
    
                    if (canPlace) {
                        this.placeObjectTo(rndSmall[0] + "_small", smallX, Utils.randomIntNumberFromRange(FGLowerBound, FGUpperBound), sprite, bSize);
                        placedIntervals.push(
                            new Interval(smallX, smallX + smallItemLengths[rndSmall[0]])
                        );
                        rndSmall.shift();
                        placedSmall++;
                    }
                }
            }
        }
    }

    placeObjectTo(object, coordX, coordY, sprite, bSize) {
        let newSprite = new PIXI.Sprite(
            PIXI.loader.resources["assets/images/" + object + ".png"].texture
        );
        newSprite.anchor.set(0, 1); // TODO: Rethink this decision.
        newSprite.scale.set(1/bSize, 1.0);
        newSprite.position.set(coordX / bSize, coordY);
        sprite.addChild(newSprite);
    }

    getUpperXBoundForBig(k) {
        return (this.pixelsPerScreen * k) - X_BOUND_SAFETY_OFFSET_BIG; 
    }

    getLowerXBoundForBig(k) {
            return this.pixelsPerScreen * (k - 1);
    }

    getUpperXBoundForSmall(k) {
        return (this.pixelsPerScreen * k) - X_BOUND_SAFETY_OFFSET_SMALL;
    }

    getLowerXBoundForSmall(k) {
        return this.pixelsPerScreen * (k -1);
    }

    addHugePyramidToFirstWindow(bSize, biome) {
        let coordX = 175;
        let normCoordX = coordX / bSize;
        let pyramid = this.getPyramidSprite("huge");

        // Randomize pyramid height (within bounds, it should be in the back)
        let coordY = Utils.randomIntNumberFromRange(
            BIOME_BOTTOM_RANGE - 100, BIOME_BOTTOM_RANGE + 100
        );

        pyramid.position.set(normCoordX, coordY);
        pyramid.scale.set(1/bSize, 1.0);
        pyramid.anchor.set(0.5, 0.5);
        biome.addChild(pyramid);
    }

    addUltraHugePyramidToLastBiomeWindow(bSize, biome) {
        let coordX = (1200 * (bSize-1)) + ((1200/2) + 250);
        let normCoordX = coordX / bSize;
        let pyramid = this.getPyramidSprite("ultrahuge");
        pyramid.position.set(normCoordX, BIOME_TOP_RANGE - 400);
        pyramid.scale.set(1/bSize, 1.0);
        pyramid.anchor.set(0.5, 0.5);
        biome.addChild(pyramid);
    }

    getPyramidSprite(size) {
        switch(size){
            case "ultrahuge":
            case "huge":
            case "medium":
            case "small":
            case "ultrasmall":
                return new PIXI.Sprite(
                    PIXI.loader.resources["assets/images/pyramid_01_" + size + ".png"].texture
                );
            default:
            throw new Error(
                "Invalid 'pyramid' sprite size requested: " + size + " ('ultrahuge', 'huge', 'medium', 'small' and 'ultrasmall' allowed)"
            );
        }
    }

}

class Biome {
    constructor (screenLength, container) {
        let updateSpeed = 4;
        let basicPixelLength = 1200;
        
        this.gameId = 0;

        // Ticks needed for one screen to pass the display from right to left.
        let ticksToTouch = basicPixelLength / updateSpeed;

        // Total length of biome being displayed on screen.
        this.length = (screenLength * ticksToTouch) + ticksToTouch;
        this.nextBiomeSpawn = (screenLength * ticksToTouch);

        // Sprite representing the container
        this.container = container;
    }

    setId(id) {this.gameId = id;}

    isOffScreen() {
        let bounds = this.container.getBounds();
        return (this.container.position.x + bounds.width < 0);
    }

    updatePosition(by) {
        try {
            this.container.position.x -= by;
        } catch {
            throw new Error("updatePosition from " + this.container.position.x + " failed. ")
        }
    }

    destructor() {
        console.log("Biome " + this.gameId + " is destroying itself.");
        while(this.container.children.length != 0) {
            this.container.children[0].destroy();
        }
        this.container.destroy();
    }
}