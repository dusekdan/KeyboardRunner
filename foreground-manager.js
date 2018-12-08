const ScoreTextStyle = { "letterSpacing": 2, "fontFamily" : "Arial Black", "fill": "#000","fontSize": 20,"fontVariant": "small-caps"};

class ForegroundManager {
    constructor(app, container, wordSet) {
        log("Foreground manager created");
        this.container = container;

        this.entities = {};

        this.entitiesL = [];

        this.entityViews = [];

        this.ticks = 100;
        
        this.wordList = wordSet;

        this.score = 0;

        // Class variables
        this.entityLimit = 10;
        this.entitySize = 25;

        this.currentTarget = null;

        //this.createEntity('testword', false);
    }

    destructor() {
        this.player.destroy();
        
        this.entityViews.forEach((element, index, array) => {
            this.destroyEntity(element);
        });

        this.container.children.forEach((element, index, array) => {
            element.destroy();
        })
    }

    calculateScore(age, length) {
        // FUTURE: Introduce game speed into equation
        const pointsPerLetter = 10;
        const ticksPerSecond = 60;
        const penaltyPerSecond = 10;
        let scoreBase = length * pointsPerLetter;
        let ageInSeconds = age / ticksPerSecond;
        let penalty = 0;
        if (ageInSeconds > 3.5) {
            penalty = ageInSeconds * penaltyPerSecond;
        }

        this.score += Math.floor(scoreBase - penalty);
        return this.score;
    }

    addPlayerEntity() {
        var playerG = new PIXI.Graphics();
        playerG.beginFill(0x000000);
        playerG.lineStyle(0);
        playerG.drawRect(0, 0, 125, 175);
        playerG.endFill();
    
        var player = Utils.createSpriteFromGraphics(app.renderer, playerG);
        player.position.set(35,  400);
        this.container.addChild(player);

        this.player = player;
        this.shouldMoveForward = true;
    }

    addScoreIndicator() {
        var scoreText = new PIXI.Text("Score: " + 0, ScoreTextStyle);
        scoreText.name = "ScoreIndicator"; // TODO: Test what is in .name by default (inherited)
        scoreText.position.set(
            app.renderer.width - 300,
            25
        );
        this.container.addChild(scoreText);
    }

    updateScoreIndicator(value) {
        let scoreIndicator = this.container.getChildByName("ScoreIndicator");
        log(scoreIndicator);
        if (scoreIndicator !== undefined) {
            scoreIndicator.text = "Score: " + value;
            scoreIndicator.style = ScoreTextStyle;
        }
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
        log("Destroyed objects from entityViews.");

        // Entity destroys itself and removes anything visual from the stage.
        entity.destroyEntity();
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
            } else {
                log("No suitable candidates found. This would be a miss");
            }

        } else {
            // Check if the pressed key is the key expected in currentTarget
            if (this.currentTarget.model.getRemaining().startsWith(letter)) {
                this.currentTarget.updateEntityDestruction(letter);
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
        
        if (
            this.ticks == 0 && 
            this.entityViews.length < this.entityLimit &&
            this.wordList.length != 0   // No words available, game ending condition should trigger soon. FUTURE: Ensure game ending condition is triggered synchronously (maybe check in entity destruction; then this part of the condition will not be necessary)
            ) {
            
            let wordToSpawn = this.wordList.pop();
            
            this.createEntity(wordToSpawn, true);
            
            this.ticks = Math.floor(Utils.randomNumberFromRange(36, 360));
            log("Spawned entity. Scheduling next entity to: " + this.ticks + " ticks. Total: " + this.entityViews.length);
        }

        // Make existing entities move
        this.entityViews.forEach((element, index, array) => {
            element.updateEntityMovement();
        });

        // Calculate score here & then destroy entity for good.
        if (this.currentTarget !== null && this.currentTarget.isEntityDestroyed()) {

            let score = this.calculateScore(
                this.currentTarget.model.age, 
                this.currentTarget.model.word.length
            );
            log("Calculated score: " + score);
            this.updateScoreIndicator(score);

            this.destroyEntity(this.currentTarget);
            this.currentTarget = null;
        }

        // Check game ending condition
        if (this.isLevelBeaten()) {
            alert("Congratulations! You have beaten the level.");   // TODO: Replace this with in-game rendered pop-up.
            return "LEVEL-FINISHED-FLAG-TERMINATED";
        } else {
            return "LEVEL-IN-PROGRESS";
        }
    }

    isLevelBeaten() {
        return this.wordList.length == 0 && this.entityViews.length == 0;
    }
}

class Entity {
    constructor(word, isEnemy) {
        this.word = word;
        this.isEnemy = isEnemy
        this.wordProgress = "";     // No destruction at the beginning
        this.hits = 0;
        this.age = 0;
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

        var textStyle = {
            "dropShadow": true,
            "dropShadowAlpha": 0.6,
            "dropShadowAngle": 0,
            "dropShadowBlur": 37,
            "dropShadowColor": "#dde94b",
            "dropShadowDistance": 0, 
            "letterSpacing": 2, 
            "fontFamily" : "Arial Black",
            "fill": "#d654e0",
            "fontSize": 20,
            "fontVariant": "small-caps", 
            "strokeThickness":2
        };
        let newText = this.prepareEntityText(this.model.getRemaining(), textStyle);
        
        // Put entity container on top of the others (it is active now)
        // Note that 'children.length' must be decreased as the index must exist. 
        this.parent.setChildIndex(
            this.container, 
            this.parent.children.length - 1
        );
        
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
        // Update entity age every tick by one
        this.model.age += 1;

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