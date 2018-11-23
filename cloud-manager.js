class CloudManager {
    constructor(app, container) {
        this.app = app;
        this.renderer = app.renderer;
        this.container = container;
        this.parentContainer = this.container.parent;
        this.cloudsList = [];

        setInterval(function() {
            const sprite = (Math.random() > 0.5 ? "cloud_1" : "cloud_2");
            var cloud = new PIXI.Sprite(
                PIXI.loader.resources["assets/images/" + sprite + ".png"].texture
            );
            
            cloud.anchor.set(0.5, 0.5);

            cloud.position.set(
                this.renderer.width + 300,
                Utils.randomNumberFromRange(20, 135)
            );

            let minScale = 0.1;
            let maxScale = 0.4;
            let scale = Math.random() * (maxScale - minScale) + minScale;

            cloud.scale.set(scale, scale);
            
            this.cloudsList.push(cloud);
            this.container.addChild(cloud);
        }.bind(this), 600);
    }

    update() {
        
        console.log("Number of clouds: " + this.cloudsList.length);
        
        this.cloudsList.forEach(function (element, index, array) {
            
            // Map scale to speed (bigger scale number, higher speed)
            let currentScale = 1;
            if (element.localTransform !== null) {
                currentScale = element.localTransform.a;    // 'a' == element x scale
            }

            element.position.x -= 5 * currentScale;

            if (element.position.x < -this.renderer.width * 0.3) {
                console.log("Out of image condition satisfied.");
                element.destroy();
                array.splice(index,1);
            }

        }.bind(this));
    }
}