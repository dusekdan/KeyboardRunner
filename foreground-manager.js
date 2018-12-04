class ForegroundManager {
    constructor(app, container) {
        log("Foreground manager created");
        this.container = container;

        this.entities = {};

        this.entitiesL = [];

        this.entityViews = [];

        this.ticks = 100;

        // Class variables
        this.entityLimit = 10;
        this.entitySize = 25;

        this.currentTarget = null;

        //this.createEntity('testword', false);
    }

    addPlayerEntity(player) {
        this.player = player;

        this.shouldMoveForward = true;
    }

    // TODO: This class should probably contain the calls for wordlists
    // and creation of entities for the levels.

    createEntity(word, isEnemy) {
        // Game operates with event.keyCode which is always uppercase (the KEY)
        let normalizedWord = word.toUpperCase();

        var entityObject = new Entity(normalizedWord, isEnemy);
        this.entitiesL.push(entityObject); // # Maybe remove after entityViews are up and running.

        // Entity view has reference to Entity object and is already responsible
        // for drawing the entity into this.container.
        var entityView = new EntityView(entityObject, this.container);
        this.entityViews.push(entityView);
    }

    destroyEntity(entity) {
        log("Destroying entity.");

        // Remove all references to the entity from FGManager.
        this.entityViews.filter(el => el.model.word !== entity.model.word);
        log(this.entityViews);
        
        let toDelete;
        for(let i = 0; i < this.entityViews.length; i++) {
            if (this.entityViews[i].model.word === entity.model.word) {
                toDelete = i;
            }
        }
        this.entityViews.splice(toDelete, 1);
        log(this.entityViews);
        
        this.entitiesL.filter(el => {
            log(el.word + " vs " + entity.model.word)
            log(el.word !== entity.model.word);
            return el.word !== entity.model.word;
        });

        log("Destroyed objects from entitiesL and entityViews.");
        log(this.entitiesL);

        // Entity destroys itself and removes anything visual from the stage.
        entity.destroyEntity();

        /*let child = this.entities[word];
        this.container.removeChild(child);
        delete this.entities[word];*/
    }

    updateEntity(word) {
        // TODO: Should change HP of entity under given word
    }

    keypressNotify(keyCode) {
        // Check if the pressed key has some consequences
        let letter = String.fromCharCode(keyCode);
        log("Key " + keyCode  + " pressed. Read as '" + letter + "' char.");
        
        // Search for suitable target
        if (this.currentTarget === null) {
            let candidates = [];
            this.entityViews.forEach((element, index, array) => {
                if (element.model.getRemaining().startsWith(letter)) {
                    candidates.push(element);
                }
            });

            // FUTURE: Pick target closer to the player (atm: the first)
            if (candidates.length > 0) {
                log("Candidate would be: " + candidates[0].model.word);
                this.currentTarget = candidates[0];
                this.currentTarget.updateEntityDestruction(letter);

                // TEST: Destroying entity in runTick method, as keypressNotify is called asynchronously
                // and therefore can result in destroying entity while it is still being processed.
                
                /*if (this.currentTarget.isEntityDestroyed()) {
                    // Destroy entity visually
                    this.destroyEntity(this.currentTarget);
                    this.currentTarget = null;
                }*/

            } else {
                log("No suitable candidates found. This would be a miss");
            }

        } else {
            // Check if the pressed key is the key expected in currentTarget
            if (this.currentTarget.model.getRemaining().startsWith(letter)) {
                this.currentTarget.updateEntityDestruction(letter);
                /*if (this.currentTarget.isEntityDestroyed()) {
                    this.destroyEntity(this.currentTarget);
                    this.currentTarget = null;
                }*/
            } else {
                log("Current target does not start with this letter. That would be miss.");
            }
        }
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
        
        if (this.ticks == 0 && this.entityViews.length < this.entityLimit) {
            this.createEntity(Utils.makeId(), true);
            this.ticks = Math.floor(Utils.randomNumberFromRange(36, 360));
            log("Spawned entity. Scheduling next entity to: " + this.ticks + " ticks. Total: " + this.entityViews.length);
        }

        // Make existing entities move
        this.entityViews.forEach((element, index, array) => {
            element.updateEntityMovement();
        });

        // Check the target's current state
        if (this.currentTarget !== null && this.currentTarget.isEntityDestroyed()) {
            this.destroyEntity(this.currentTarget);
            this.currentTarget = null;
        }
    }
}

class Entity {
    constructor(word, isEnemy) {
        this.word = word;
        this.isEnemy = isEnemy
        this.wordProgress = "";     // No destruction at the beginning
        this.hits = 0;
    } 

    destruct(letter) {
        if (this.word[this.hits] == letter) {
            this.wordProgress += letter;
            this.hits += 1;
        } else {
            log("Incorrect destruction attempt. Tried: " + letter + ", actual: " + this.word[this.hits]);
        }
    }

    getRemaining() {
        return this.word.substr(this.hits, this.word.length);
    }

    // FUTURE: Expand by regenerate function
}


class EntityView {
    constructor(model, parentContainer) {
        this.model = model;
        this.parent = parentContainer;

        // Create graphics object
        this.container = new PIXI.Container();

        // Visual text object for entity
        var text = this.prepareEntityText(model.word);
        
        // Entity Sprite
        var sprite = new PIXI.Sprite(
            PIXI.loader.resources["assets/images/entity_place_holder.png"].texture
            );
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(0, 24);
            
        this.container.addChild(text);
        this.container.addChild(sprite);

        // Randomize height in which the entity is going to be displayed.
        this.container.position.set(
            app.renderer.width,
            Math.floor(Utils.randomNumberFromRange(250, 525))
        );
        
        // Put the child on screen
        this.parent.addChild(this.container);
    }

    prepareEntityText(text, style) {
        var textStyle = { "letterSpacing": 2, "fontFamily" : "Arial Black", "fill": "#000","fontSize": 20,"fontVariant": "small-caps"} ;
        if (style) {
            textStyle = style;
        }
        var textElement = new PIXI.Text(text, textStyle);
        
        textElement.anchor.set(0.5, 0.5);
        textElement.position.set(0, 0);

        return textElement;
    }

    updateView() {
        // Iterate over childs of 'entity' container, replace text with most current
        // text of the model
        let textChildren;
        for(let i = 0; i < this.container.children.length; i++) {
            if (this.container.children[i] instanceof PIXI.Text) {
                textChildren = this.container.children[i];
            }
        }

        if (textChildren) { // Removing existing textChildren
            this.container.removeChild(textChildren);
        } 

        var textStyle = {"dropShadow": true,
        "dropShadowAlpha": 0.6,
        "dropShadowAngle": 0,
        "dropShadowBlur": 37,
        "dropShadowColor": "#dde94b",
        "dropShadowDistance": 0, "letterSpacing": 2, "fontFamily" : "Arial Black", "fill": "#d654e0","fontSize": 20,"fontVariant": "small-caps", "strokeThickness":2} ;
        let newText = this.prepareEntityText(this.model.getRemaining(), textStyle);
        this.container.addChild(newText);
    }

    updateEntityDestruction(letter) {
        this.model.destruct(letter);
        this.updateView();
    }

    isEntityDestroyed() {
        return this.model.word == this.model.wordProgress;
    }

    destroyEntity() {
        this.container.removeChildren();
        this.container.destroy();
    }

    updateEntityMovement() {
        if (this.container.position.x > -this.container.width) {
            // Movement towards the player
            this.container.position.x -= 0.5;
            
            // Randomized movement up and down
            if (this.container.position.y + 1 < app.renderer.height -1) {
                let upOrDown = Utils.randomNumberFromRange(0, 1) < 0.5 ? -1 : 1;
                this.container.position.y += upOrDown;
            } else {
                this.container.position.y -= 1; // TODO: same check to avoid escaping over the top border.
            }
        } else {
            // Once it passes the player's side of the screen, put it back on
            // start
            this.container.position.x = app.renderer.width + this.container.width;
            log("Entity went of the screen. Putting it back to start.");
        }
    }
}