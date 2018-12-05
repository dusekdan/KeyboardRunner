class WallManager {
    constructor (app, container) {
        this.renderer = app.renderer;
        this.container = container;
        this.wallList = [];

        // First wall will be spawned after 240 frames (roughly 4 seconds)
        this.ticks = 240;
    }

    destructor() {
        this.wallList.forEach((element, index, array) => {
            element.destroy();
        })
    }

    spawnWall() {
        let wallGraphics = new PIXI.Graphics();
        wallGraphics.beginFill(Utils.randomIntColor());
        wallGraphics.lineStyle(0);
        wallGraphics.drawRect(0, 135, this.renderer.width, this.renderer.height);
        wallGraphics.endFill();

        let wall = Utils.createSpriteFromGraphics(this.renderer, wallGraphics);
        wall.position.set(
            this.renderer.width + 100,
            15
        );
        wall.scale.set(2.5, 1.0);

        this.wallList.push(wall);
        this.container.addChild(wall);
    }

    runTick() {

        this.ticks -= 1;

        if (this.ticks == 0) {
            // Do some ticking operations
            this.spawnWall();
            this.ticks = 510; // roughly 8.5s (60*8.5)
            log("WallManager, walls: " + this.wallList.length);
        }
        
        this.wallList.forEach(function(element, index, array) {
            element.position.x -= 4;

            if (element.position.x < -this.renderer.width * 2.5) {
                console.log("Wall reached its usefulness. Time to remove it.");
                element.destroy();
                array.splice(0,1); // Start at index 0 (the first wall) and remove one element (itself)
            }
        }.bind(this));
    }
}