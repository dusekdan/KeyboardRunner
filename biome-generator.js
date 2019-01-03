class BiomeGenerator {
    constructor (renderer) {
        this.BIOME_TYPES = [
            "DESERT", "WINTER", "FOREST"
        ];

        this.renderer = renderer;
        this.renderWidth = renderer.width;;
        this.renderHeight = renderer.height;
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
        let biome = new PIXI.Graphics();
        biome.beginFill(Utils.randomIntColor());
        biome.lineStyle(0);
        biome.drawRect(0, 135, this.renderWidth, this.renderHeight);
        log("DRAWING BIOM, width:" + this.renderWidth + ", height:" + this.renderHeight);
        biome.endFill();

        let biomeSprite = Utils.createSpriteFromGraphics(this.renderer, biome);
        biomeSprite.scale.set(length, 1.0);
        biomeSprite.position.set(this.renderWidth, 15);

        return new Biome(length, biomeSprite);
    }
}

class Biome {
    constructor (screenLength, container) {
        let updateSpeed = 4;
        let basicPixelLength = 1200;

        // Ticks needed for one screen to pass the display from right to left.
        let ticksToTouch = basicPixelLength / updateSpeed;

        // Total length of biome being displayed on screen.
        this.length = (screenLength * ticksToTouch) + ticksToTouch;
        this.nextBiomeSpawn = (screenLength * ticksToTouch);

        // Sprite representing the container
        this.container = container;
    }

    isOffScreen() {
        let bounds = this.container.getBounds();
        return (this.container.position.x + bounds.width < 0);
    }

    updatePosition(by) {
        this.container.position.x -= by;
    }

    destructor() {
        while(this.container.children.length != 0) {
            this.container.children[0].destroy();
        }
        this.container.destroy();
    }
}