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
     * Constructs biom object with its sprite container and children. Image
     * resources, their different sized variants and biome colors are defined
     * here.
     * 
     * @param {*} type String type defined in this.BIOM_TYPES to be spawned.
     * @param {*} screenLength Integer multiplier of the screen length saying
     * how long newly generated biom should be.
     */
    constructBiome(type, screenLength) {
        // Store reference to biome currently being constructer
        this.biomeType = type;
        
        // Properoties specific for all the bioms.  
        let itemSets = {};
        let itemLengths = {};
        let colorSet = [];
        switch(type) {
            case "DESERT":
                this.biomeFolder = desertBiomeFolder;

                itemSets["all"] = ["sandblock_01", "sandwall_01", 
                "sandwall_02", "sandblock_01", "sandblock_01", "sandblock_01"];
                itemSets["huge"] = ["sandblock_01"];
                itemSets["medium"] = ["sandblock_01", "sandwall_01", 
                "sandblock_01", "sandblock_01"];
                itemSets["small"] = ["sandblock_01", "sandwall_01", 
                "sandwall_02", "sandblock_01", "sandblock_01", 
                "sandblock_01", "sandblock_01"];
                itemSets["tiny"] = ["sandblock_01", "sandwall_01", 
                "sandwall_02", "sandblock_01", "sandblock_01", 
                "sandblock_01", "sandblock_01"];

                itemLengths["huge"] = { "sandblock_01": 171, "sandwall_01":377, "sandwall_02": 326};
                itemLengths["medium"] = {"sandblock_01": 120, "sandwall_01":232, "sandwall_02": 230};
                itemLengths["small"] = {"sandblock_01": 50, "sandwall_01":172, "sandwall_02": 132};
                itemLengths["tiny"] = {"sandblock_01": 15, "sandwall_01":57, "sandwall_02": 60};

                colorSet = [0xffd54f, 0xffff81];

                return this.constructBiom(screenLength, itemSets, itemLengths, colorSet);
            break;
            case "WINTER":
                this.biomeFolder = winterBiomeFolder;
                
                itemSets["all"] = ["angry_snowman", "dead_snowman_full", 
                "dead_snowman_head", "snowball_pack_01", "snowball_pack_02",
                "snowball"];
                itemSets["huge"] = ["angry_snowman", "dead_snowman_full"];
                itemSets["medium"] = ["dead_snowman_head", "snowball_pack_01", "snowball_pack_02"];
                itemSets["small"] = ["snowball"];
                itemSets["tiny"] = ["angry_snowman", "dead_snowman_full", 
                "dead_snowman_head", "snowball_pack_01", "snowball_pack_02"];

                itemLengths["huge"] = {"angry_snowman": 82, "dead_snowman_full": 180};
                itemLengths["medium"] = {"dead_snowman_head": 60, "snowball_pack_01": 60, "snowball_pack_02": 60};
                itemLengths["small"] = {"snowball": 20};
                itemLengths["tiny"] = {"angry_snowman": 28, "dead_snowman_full": 59, "dead_snowman_head": 25, "snowball_pack_01": 25, "snowball_pack_02": 25};

                colorSet = [0xBBDEFB];

                return this.constructBiom(screenLength, itemSets, itemLengths, colorSet);
            break;
            case "FOREST":
            break;
            default:
                // TODO: Return biome considered default (probably forest/meadow)
            break;
        }
    }

    constructBiom(length, itemSets, itemLengths, colorSet) {

        // Keep the scaling coefficient to later scale children back down. 
        this.k = length;

        let biome = this.prepareBiomeLayout(colorSet);

        this.populateBiom(biome, itemSets, itemLengths);

        return new Biome(this.k, biome);
    }

    prepareBiomeLayout(colorSet) {
        // First, create Graphics object of the size of a screen, of given color.
        let biome = new PIXI.Graphics();
        biome.beginFill(Utils.randomElement(colorSet));
        biome.lineStyle(0);
        biome.drawRect(0, 0, this.renderWidth, this.renderHeight);
        biome.endFill();
        
        // Then convert it to scaled sprite representing the actual biome plate.
        let sprite = Utils.createSpriteFromGraphics(this.renderer, biome);
        sprite.scale.set(this.k, 1.0);
        sprite.position.set(this.renderWidth, BIOME_BOTTOM_RANGE);

        return sprite;
    }

    populateBiom(sprite, itemSets, itemLengths) {

        // TODO: Generate far background (tiny items + few small pyramids)
        this.addFarBackgroundItems(sprite, itemSets, itemLengths);
        
        // TODO: Generate general background (pyramids mainly)
        if (this.biomeType !== "DESERT") {
            this.addBackgroundItems(sprite, itemSets, itemLengths);
        }
        
        // Note that only big items (likely in the foreground only) should 
        // be added here.
        this.addBiomeSpecificItems(sprite);

        // Should come always last to cover what is rendered behind it (perspective).
        this.addForegroundItems(this.k, sprite, itemSets, itemLengths);
    }

    addBiomeSpecificItems(biome) {
        switch (this.biomeType) {
            case "DESERT": 
                this.addHugePyramidToFirstWindow(this.k, biome);
                this.addUltraHugePyramidToLastBiomeWindow(this.k, biome);
            break;
        }
    }

    addFarBackgroundItems(sprite, itemSets, itemLenghts) {
        let FBGLowerBound = 35;
        let FBGUpperBound = 195;

        let items = itemSets["all"];
        let sizes = itemLenghts["tiny"];

        // DESERT-ONLY Only very small pyramids should be added to the far background
        if (this.biomeType === "DESERT") {
            items.push("pyramid_01");
            sizes["pyramid_01"] = 110;
        } else if (this.biomeType === "WINTER") {
            // Skip rendering snowball in farbackground (way too small to be visible)
            items = items.filter(item => item !== "snowball");
        }

        let screensToSeed = this.k;
        for (let i = 1; i<= screensToSeed; i++) {
            let placedIntervals = [];
            
            // Generate items to be placed into the background.
            let rndItems = [];
            for (let j = 0; j < 12; j++) {
                rndItems.push(Utils.randomElement(items));
            }

            let itemX = Utils.randomIntNumberFromRange(this.getLowerXBoundForSmall(i), this.getUpperXBoundForSmall(i));
            this.placeObjectTo(rndItems[0] + "_ultrasmall", itemX,
                Utils.randomIntNumberFromRange(FBGLowerBound, FBGUpperBound), sprite, this.k);
            placedIntervals.push(new Interval(itemX, itemX + sizes[rndItems[0]]));
            rndItems.shift();

            let watchDog = 250;
            while(placedIntervals.length !== 12) {
                watchDog -= 1; 
                if (watchDog <= 0) { console.log("Watchdog FBG: Reeeeeee...."); break; }

                itemX = Utils.randomIntNumberFromRange(this.getLowerXBoundForBig(i), this.getUpperXBoundForBig(i));
                let canPlace = true;
                for (let x = 0; x < placedIntervals.length; x++) {
                    if (placedIntervals[x].covers(itemX, itemX + sizes[rndItems[0]])) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    this.placeObjectTo(rndItems[0] + "_ultrasmall", itemX, Utils.randomIntNumberFromRange(FBGLowerBound, FBGUpperBound), sprite, this.k);                            
                    placedIntervals.push(new Interval(itemX, itemX + sizes[rndItems[0]]));
                    rndItems.shift();
                }
            }
        }
    }

    addBackgroundItems(sprite, itemSets, itemLenghts) {
        let BGLowerBound = 150;
        let BGUpperBound = 345;

        let items = itemSets["all"];
        let sizes = itemLenghts["small"];

        if (this.biomeType === "WINTER") {
            // Winter biome only - Do not render "small" dead snowman's body in foreground.
            items = items.filter(item => item !== "dead_snowman_full");
            items = items.filter(item => item !== "angry_snowman");
        }

        // DESERT-ONLY Only very small pyramids should be added to the background
        if (this.biomeType === "DESERT") {
            items.push("pyramid_01");
            sizes["pyramid_01"] = 184;
        }

        let screensToSeed = this.k;
        for (let i = 1; i<= screensToSeed; i++) {
            let placedIntervals = [];
            
            // Generate items to be placed into the background.
            let rndItems = [];
            for (let j = 0; j < 100; j++) {
                rndItems.push(Utils.randomElement(items));
            }

            let itemX = Utils.randomIntNumberFromRange(this.getLowerXBoundForSmall(i), this.getUpperXBoundForSmall(i));
            this.placeObjectTo(rndItems[0] + "_small", itemX,
                Utils.randomIntNumberFromRange(BGLowerBound, BGUpperBound), sprite, this.k);
            placedIntervals.push(new Interval(itemX, itemX + sizes[rndItems[0]]));
            rndItems.shift();

            let watchDog = 250;
            while(placedIntervals.length !== 5) {
                watchDog -= 1; 
                if (watchDog <= 0) { console.log("Watchdog BG: Reeeeeee...."); break; }

                itemX = Utils.randomIntNumberFromRange(this.getLowerXBoundForBig(i), this.getUpperXBoundForBig(i));
                let canPlace = true;
                for (let x = 0; x < placedIntervals.length; x++) {
                    if (placedIntervals[x].covers(itemX, itemX + sizes[rndItems[0]])) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    this.placeObjectTo(rndItems[0] + "_small", itemX, Utils.randomIntNumberFromRange(BGLowerBound, BGUpperBound), sprite, this.k);                            
                    placedIntervals.push(new Interval(itemX, itemX + sizes[rndItems[0]]));
                    rndItems.shift();
                }
            }
        }
    }

    addForegroundItems(bSize, sprite, itemSets, itemLenghts) {
        // Height range should be between BIOME_TOP_RANGE and BIOME_TOP_RANGE - 170
        let FGLowerBound = BIOME_TOP_RANGE - 170;
        let FGUpperBound = BIOME_TOP_RANGE - 70;


        let foregroundItems = itemSets["all"];
        let foregroundItemsHuge = itemSets["huge"];
        let foregroundItemsMedium = itemSets["medium"];
        let hugeItemLenghts = itemLenghts["huge"];
        let mediumItemLengths = itemLenghts["medium"];
        let smallItemLengths = itemLenghts["small"];
        
        if (this.biomeType === "WINTER") {
            // Winter biome only - Do not render "small" dead snowman's body in foreground.
            foregroundItems = foregroundItems.filter(item => item !== "dead_snowman_full");
            foregroundItems = foregroundItems.filter(item => item !== "angry_snowman");
        }

        let screensToSeed = this.k;
        for (let i = 1; i <= screensToSeed; i++) {
            // Use 'i' as a 'k' for all screen-number relevant functions.

            // Pre-generate items to be placed on i-th screen (1 huge, 1 medium, 5 small)
            let rndHuge = Utils.randomElement(foregroundItemsHuge);
            let rndMedium = [Utils.randomElement(foregroundItemsMedium)];
            let rndSmall = [];
            for (let i = 0; i < 5; i++) {
                rndSmall.push(Utils.randomElement(foregroundItems));
            }

            // Keep track of parts of the screen where item has been already placed.
            let placedIntervals = [];

            // Place the first huge item randomly and remember where it is placed.
            let hugeX = Utils.randomIntNumberFromRange(this.getLowerXBoundForBig(i), this.getUpperXBoundForBig(i));
            this.placeObjectTo(rndHuge + "_huge", hugeX,
                Utils.randomIntNumberFromRange(FGLowerBound, FGLowerBound + 35),
                sprite, bSize);
            placedIntervals.push(new Interval(hugeX, hugeX + hugeItemLenghts[rndHuge]));

            // Start placing other items to the screen if there is enough space.
            let placedMedium = 0, placedSmall = 0;
            let watchDog = 250;
            while (placedIntervals.length !== 6) {
            
                // If sprite placement is not possible, skip placement.
                watchDog -= 1;
                if (watchDog <= 0) 
                {
                    log("Watchdog: *autistic screeching*...");
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
                if (placedSmall !== 4) {
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
        log("Trying to place: " + this.biomeFolder + object + ".png");
        let newSprite = new PIXI.Sprite(
            PIXI.loader.resources[this.biomeFolder + object + ".png"].texture
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
                    PIXI.loader.resources[desertBiomeFolder + "pyramid_01_" + size + ".png"].texture
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