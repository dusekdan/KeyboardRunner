const CLOUD_LIMIT = 12;
const CLOUD_MOVEMENT_SPEED_BASE = 5;

class CloudManager {
    constructor(app, container) {
        this.renderer = app.renderer;
        this.container = container;
        this.cloudsList = [];

        // First cloud will be spawned after 240 frames (roughly 4 seconds)
        this.ticks = 240;
    }

    destructor() {
        this.cloudsList.forEach((element, index, array) => {
            element.destroy();
        });
    }

    spawnCloud() {
        // Do not exceed the limit of CLOUD_LIMIT clouds.
        if (this.cloudsList.length < CLOUD_LIMIT) {
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
        }
    }

    runTick() {
        
        // Stop decreasing and rescheduling ticks once all the clouds
        // are spawned to avoid unnecessary calls to this.spawnCloud().
        if (this.ticks > 0)
            this.ticks -= 1;
        
        // Check whether to spawn a new cloud
        if (this.ticks == 0 && this.cloudsList.length < CLOUD_LIMIT) {
            this.spawnCloud();
            
            // Time to next cloud spawn
            this.ticks = Math.floor(Utils.randomNumberFromRange(36, 360));
            log("Spawned cloud, scheduled next after " + this.ticks + " ticks.");
            log("Number of clouds: " + this.cloudsList.length);
        }

        
        this.cloudsList.forEach(function (element, index, array) {
            
            // Map scale to speed (bigger scale number, higher speed)
            let currentScale = 1;
            if (element.localTransform !== null) {
                currentScale = element.localTransform.a;    // 'a' == element x scale
            }

            element.position.x -= CLOUD_MOVEMENT_SPEED_BASE * currentScale;

            if (element.position.x < 0 -this.renderer.width * 0.3) {
                log("Cloud is out of the image. Put it back on the other side.");
                element.position.set(
                    this.renderer.width + 300,  
                    Utils.randomNumberFromRange(20, 135)
                );
            }

        }.bind(this));
    }
}