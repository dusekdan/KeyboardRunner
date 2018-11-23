class CloudManager {
    constructor() {
        this.cloudsList = [];

        setInterval(function() {
            console.log("Cloud manager call. ");
            const sprite = (Math.random() > 0.5 ? "cloud_1" : "cloud_2");
            var cloud = new PIXI.Sprite(
                PIXI.loader.resources["assets/images/" + sprite + ".png"].texture
            );
            
            cloud.anchor.set(0.5, 0.5);

            cloud.position.set(
                app.renderer.width + 300,
                app.renderer.height * Math.random()
            );

            console.log("Spawned cloud at "  + cloud.x + " : "+  cloud.y)

            let minScale = 0.2;
            let maxScale = 1.2;
            let scale = Math.random() * (maxScale - minScale) + minScale;
            cloud.scale.set(scale, scale);
            
            this.cloudsList.push(cloud);
            app.stage.addChild(cloud);
        }.bind(this), Utils.randomNumberFromRange(250, 1200));
    }

    update() {
        this.cloudsList.forEach(function (element, index, array) {
            element.position.x -= 4;

            console.log("Existing cloud objects: " + array.length)

            if (element.position.x < -app.renderer.width * 0.3) {
                element.destroy();
                array.splice(0,1);
            }

        }.bind(this));
    }
}