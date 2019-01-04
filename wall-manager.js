class WallManager {
    constructor (app, container) {
        // Screen rendering references.
        this.renderer = app.renderer;
        this.container = container;

        this.biomes = [];
        this.BG = new BiomeGenerator(this.renderer); 

        // Manager properties
        this.updateSpeed = 4;   // How fast biomes move to left

        // First wall spawns after 1st frame (and slides in from the right)
        this.ticks = 1;

        this.biomeNumber = 0;
    }

    runTick() {
        // Once ticks are depleted, spawn biom and re-schedule next ticks 
        // depletion, to spawn the next biom.
        this.ticks -= 1;
        if (this.ticks == 0) {
            let spawnedBiome = Math.random() > 0.5 ? this.spawnBiome("WINTER") : this.spawnBiome("DESERT"); 
            this.ticks = spawnedBiome.nextBiomeSpawn;
        }

        this.biomes.forEach((biome, index, array) => {
            biome.updatePosition(this.updateSpeed);
            if (biome.isOffScreen()) {
                biome.destructor();
                array.splice(0,1);
            }
        });
    }

    spawnBiome(type) {
        // Second parameter is the scale of the basic biom length
        // e.g. 1 for standard width, 2 for two screens biom, ...
        let biomLength = Math.floor(Utils.randomNumberFromRange(2,5));
        let biome = this.BG.constructBiome(type, biomLength);
        this.biomeNumber += 1;
        biome.setId(this.biomeNumber);
        this.biomes.push(biome);
        this.container.addChild(biome.container);
        return biome;
    }

    destructor() {
        this.biomes.forEach(element => {
            element.destructor();
        });
    }
}