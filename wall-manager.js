class WallManager {
    constructor (app, container) {
        this.app = app;
        this.renderer = app.renderer;
        this.container = container;
        this.parentContainer = this.container.parent;

        this.wallList = [];

        setInterval(function () {

            // Spawn rectangle that will move to the left and then disappear

            let wallGraphics = new PIXI.Graphics();
            wallGraphics.beginFill(Utils.randomIntColor());
            wallGraphics.lineStyle(0);
            wallGraphics.drawRect(0, 135, this.renderer.width, this.renderer.height);
            wallGraphics.endFill();

            let wallTexture = PIXI.RenderTexture.create(wallGraphics.width, wallGraphics.height);
            this.renderer.render(wallGraphics, wallTexture);

            let wallSprite = new PIXI.Sprite(wallTexture);
            wallSprite.position.set(
                this.renderer.width + 100,
                15
            );
            wallSprite.scale.set(2.5, 1.0);

            

            this.wallList.push(wallSprite);
            this.container.addChild(wallSprite);
        }.bind(this), 8400);
    }

    runTick() {
        console.log("Running Wall-Manager tick... Walls in total: " + this.wallList.length);
        
        this.wallList.forEach(function(element, index, array) {
            element.position.x -= 4;

            if (element.position.x < -this.renderer.width * 2.5) {
                console.log("Time to remove the current wall (its out of the picture)");
                element.destroy();
                array.splice(0,1); // Start at index 0 (the first wall) and remove one element (itself)
            }
        }.bind(this));
    }
}