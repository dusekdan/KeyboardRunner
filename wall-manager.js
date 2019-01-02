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
        wallGraphics.beginFill(Utils.randomIntColor());     // TODO: Fetch color here inteligently.
        wallGraphics.lineStyle(0);
        wallGraphics.drawRect(0, 135, this.renderer.width, this.renderer.height);
        wallGraphics.endFill();

        let wall = Utils.createSpriteFromGraphics(this.renderer, wallGraphics);
        wall.position.set(
            this.renderer.width,
            15
        );
        wall.scale.set(2.0, 1.0);

        this.wallList.push(wall);
        this.container.addChild(wall);
    }

    runTick() {

        this.ticks -= 1;

        if (this.ticks == 0) {
            // Do some ticking operations
            this.spawnWall();
            
            // Standard full screen wall (1200px width) travels by 4px per tick, 
            // is of the screen in 600 ticks (1200 on visible screen, 1200 until its all gone)
            // next wall need to be created in half of this time (by the time the first wall 
            // travels its 1200px and starts disappearing)).
            // If more generics is going to be added here, the ticks until the next wall is spawned
            // must be half the updates required for a wall to leave.
            // Example:
            // Wall length in ticks: ... determine whether to add new biom with duration in ticks (including
            // or excluding disappearing phase). 
            this.ticks = 1200/2; 
            
            // 510 - roughly 8.5s (60*8.5)
            log("WallManager, walls: " + this.wallList.length);
        }
        
        this.wallList.forEach(function(element, index, array) {
            element.position.x -= 4;

            let bounds = element.getBounds();
            if (element.position.x + bounds.width < 0) {
                element.destroy();
                array.splice(0,1); // Start at index 0 (the first wall) and remove one element (itself)
                console.log("Wall reached its usefulness. Time to remove it.");
            }
        }.bind(this));
    }
}