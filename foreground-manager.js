class ForegroundManager {
    constructor(app, container) {
        log("Foreground manager created");
        this.container = container;

        this.entities = {};

        this.ticks = 100;

        // Class variables
        this.entityLimit = 10;
        this.entitySize = 25;

        //this.createEntity('testword', false);
    }

    addPlayerEntity(player) {
        this.player = player;

        this.shouldMoveForward = true;
    }

    // TODO: This class should probably contain the calls for wordlists
    // and creation of entities for the levels.

    createEntity(word, isEnemy) {
        // Graphics -> Sprite
        var entityContainer = new PIXI.Container();
        entityContainer.zIndex = 5;
        
        var entityT = new PIXI.Text(word, {
            fontFamily: 'arial',
            fontSize: 12,
            fill: "black"
        });
        entityContainer.addChild(entityT);

        entityT.anchor.set(0.5, 0.5);
        entityT.position.set(0, 0);

        var entityG = new PIXI.Graphics();
        entityG.beginFill(0x000000);
        entityG.drawRect(0, 0, 25, 25);
        entityG.endFill();

        var entity = Utils.createSpriteFromGraphics(app.renderer, entityG);
        entity.anchor.set(0.5, 0.5);
        entity.position.set(0, 24);
        entity.interactive = true;
        entity.buttonMode = true;
        
        // Put it outside the screen (a little)
        entityContainer.addChild(entity);
        entityContainer.position.set(
            app.renderer.width,
            Math.floor(Utils.randomNumberFromRange(250, 525))
        );

        entityT.buttonMode = true;
        entityT.interactive = true;


        // TEST: Action on entity click.
        entityT.on('pointerdown', () => {
            log("text-destroy")
            this.destroyEntity(word);
        });
        entity.on('pointerdown', () => {
            log("sprite-destroy")
            this.destroyEntity(word);
        });

        // TODO: Append text to entity
        this.entities[word] = entityContainer;
        this.container.addChild(entityContainer);

    }

    destroyEntity(word) {
        log("...destroy op...");
        let child = this.entities[word];
        this.container.removeChild(child);
        delete this.entities[word];
    }

    updateEntity(word) {
        // TODO: Should change HP of entity under given word
    }

    runTick() {
        // Update all the entities as necessary.
        let updateJump = 2;
        if (this.player.position.x < 150 && this.shouldMoveForward){
            this.player.position.x += updateJump;
        } else {
            this.shouldMoveForward = false;
        }

        if (this.player.position.x > 0 && this.shouldMoveForward === false) {
            this.player.position.x -= updateJump;
        }
        else {
            this.shouldMoveForward = true;
        }

        // Spawn entities every once in a while
        if (this.ticks > 0)
            this.ticks -= 1;
        
        if (this.ticks == 0 && Object.keys(this.entities).length < this.entityLimit) {
            this.createEntity(Utils.makeId(), true);
            this.ticks = Math.floor(Utils.randomNumberFromRange(36, 360));
            log("Spawned entity. Scheduling next entity to: " + this.ticks + " ticks. Total: " + Object.keys(this.entities).length);
        }

        for (var key in this.entities) {
            let value = this.entities[key];
            this.moveEntity(value);
        }
    }

    moveEntity(entity) {
        if (entity.position.x > -entity.width) {
            // Move it
            entity.position.x -= 0.5;
            
            // Move vertically towards the bottom of the screen only if 
            // the entity remains on the screen.
            if (entity.position.y + 1 < app.renderer.height - 1) {
                let upOrDown = Utils.randomNumberFromRange(0, 1) < 0.5 ? -1 : 1;
                entity.position.y += upOrDown;
            } else {
                entity.position.y -= 1;
            } // TODO: Same check should be done for the other boundary of the screen. 
            
        }
        else {  // otherwise delete it / put it back on the other side. Decide TODO:
            entity.position.x = app.renderer.width + entity.width;
            log("Entity went of the screen. Something should be done about it");
        }
    }

}